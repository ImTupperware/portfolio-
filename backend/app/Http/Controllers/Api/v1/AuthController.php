<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\LoginRequest;
use App\Http\Requests\Api\v1\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password credentials provided.'],
            ]);
        }

        // Revoke existing tokens for single-session security posture or keep fresh
        $token = $user->createToken('portfolio-auth-token', ['*'], now()->addDays(7))->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => $this->formatUserResponse($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($this->formatUserResponse($request->user()));
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        DB::transaction(function () use ($user, $request) {
            $user->update($request->validated());
        }, attempts: 3);

        $user->refresh();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => $this->formatUserResponse($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    private function formatUserResponse(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'title' => $user->getAttribute('title'),
            'summary' => $user->getAttribute('summary'),
            'location' => $user->getAttribute('location'),
            'availability' => $user->getAttribute('availability'),
            'phone' => $user->getAttribute('phone'),
            'whatsapp' => $user->getAttribute('whatsapp'),
            'github_url' => $user->getAttribute('github_url'),
            'linkedin_url' => $user->getAttribute('linkedin_url'),
            'website_url' => $user->getAttribute('website_url'),
        ];
    }
}
