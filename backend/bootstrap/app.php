<?php

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Centralized Error Shield - Zero SQL, Internal File Path, or Stack Trace Leakage
        $exceptions->render(function (QueryException $e, Request $request) {
            $correlationId = Str::uuid()->toString();
            Log::error("Database Query Exception [{$correlationId}]: " . $e->getMessage(), [
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'DATABASE_ERROR',
                    'message' => 'An internal database error occurred. The incident has been securely logged.',
                    'correlation_id' => $correlationId,
                ],
            ], 500);
        });

        $exceptions->render(function (\PDOException $e, Request $request) {
            $correlationId = Str::uuid()->toString();
            Log::error("PDO Exception [{$correlationId}]: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'STORAGE_ENGINE_ERROR',
                    'message' => 'Service temporarily unavailable. Please retry shortly.',
                    'correlation_id' => $correlationId,
                ],
            ], 503);
        });

        $exceptions->render(function (AuthorizationException|\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e, Request $request) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED_ACCESS',
                    'message' => $e->getMessage() ?: 'Access denied: You do not have permission to access or modify this resource.',
                ],
            ], 403);
        });

        $exceptions->render(function (ModelNotFoundException|NotFoundHttpException $e, Request $request) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'RESOURCE_NOT_FOUND',
                    'message' => 'The requested resource was not found.',
                ],
            ], 404);
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHENTICATED',
                    'message' => 'Authentication is required to perform this action.',
                ],
            ], 401);
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'VALIDATION_FAILED',
                    'message' => 'The given data failed validation.',
                    'errors' => $e->errors(),
                ],
            ], 422);
        });

        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($e instanceof HttpException) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'HTTP_ERROR_' . $e->getStatusCode(),
                        'message' => $e->getMessage(),
                    ],
                ], $e->getStatusCode());
            }

            $correlationId = Str::uuid()->toString();
            Log::critical("Unhandled Exception [{$correlationId}]: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'INTERNAL_SERVER_ERROR',
                    'message' => 'An unexpected server error occurred.',
                    'correlation_id' => $correlationId,
                ],
            ], 500);
        });
    })->create();
