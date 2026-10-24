<?php

use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\ContactInquiryController;
use App\Http\Controllers\Api\v1\ProjectController;
use App\Http\Controllers\Api\v1\ResumeController;
use App\Http\Controllers\Api\v1\SkillController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Authentication endpoints (Throttled via token-bucket)
    Route::middleware(['throttle:auth'])->group(function () {
        Route::post('/auth/login', [AuthController::class, 'login']);
    });

    // Public Read Endpoints (Throttled via general API rate limiter)
    Route::middleware(['throttle:api'])->group(function () {
        Route::get('/health', fn () => response()->json(['status' => 'ok', 'timestamp' => now()->toIso8601String()]));
        Route::get('/resume', [ResumeController::class, 'bundle']);
        Route::get('/experiences', [ResumeController::class, 'experiences']);
        Route::get('/projects', [ProjectController::class, 'index']);
        Route::get('/projects/{project:slug}', [ProjectController::class, 'show']);
        Route::get('/skills', [SkillController::class, 'index']);
        Route::get('/orders', [\App\Http\Controllers\Api\v1\OrderController::class, 'index']);
        Route::post('/ai/chat', [\App\Http\Controllers\Api\v1\AiChatController::class, 'chat']);
    });

    // Public Contact Form (Strict token-bucket rate limit: 5/minute)
    Route::middleware(['throttle:inquiries'])->group(function () {
        Route::post('/inquiries', [ContactInquiryController::class, 'store']);
    });

    // Protected Admin Endpoints (Sanctum Authenticated + Anti-IDOR Authorization)
    Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::put('/user/profile', [AuthController::class, 'updateProfile']);

        // Resume & Experience Management
        Route::post('/experiences', [ResumeController::class, 'storeExperience']);
        Route::put('/experiences/{experience}', [ResumeController::class, 'updateExperience']);
        Route::delete('/experiences/{experience}', [ResumeController::class, 'destroyExperience']);

        // Projects Management
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::put('/projects/{project}', [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

        // Skills Management
        Route::post('/skills', [SkillController::class, 'store']);
        Route::put('/skills/{skill}', [SkillController::class, 'update']);
        Route::delete('/skills/{skill}', [SkillController::class, 'destroy']);

        // Certifications Management
        Route::post('/certifications', [\App\Http\Controllers\Api\v1\CertificationController::class, 'store']);
        Route::put('/certifications/{certification}', [\App\Http\Controllers\Api\v1\CertificationController::class, 'update']);
        Route::delete('/certifications/{certification}', [\App\Http\Controllers\Api\v1\CertificationController::class, 'destroy']);

        // Education Management
        Route::post('/educations', [\App\Http\Controllers\Api\v1\EducationController::class, 'store']);
        Route::put('/educations/{education}', [\App\Http\Controllers\Api\v1\EducationController::class, 'update']);
        Route::delete('/educations/{education}', [\App\Http\Controllers\Api\v1\EducationController::class, 'destroy']);

        // Inquiries Management
        Route::get('/inquiries', [ContactInquiryController::class, 'index']);

        // AI Resume Parsing & Ingestion
        Route::post('/resume/parse-ai', [\App\Http\Controllers\Api\v1\ResumeAiController::class, 'parse']);
        Route::post('/resume/import-ai', [\App\Http\Controllers\Api\v1\ResumeAiController::class, 'import']);
    });
});
