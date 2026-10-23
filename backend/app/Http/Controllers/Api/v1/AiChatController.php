<?php

namespace App\Http\Controllers\Api\v1;

use App\Domains\Ai\Services\AiResumeService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\AiChatRequest;
use Illuminate\Http\JsonResponse;

class AiChatController extends Controller
{
    /**
     * Handle public AI Career Assistant inquiries.
     */
    public function chat(AiChatRequest $request, AiResumeService $aiService): JsonResponse
    {
        $message = (string)$request->input('message');
        $history = (array)$request->input('history', []);

        $reply = $aiService->answer($message, $history);

        return response()->json([
            'success' => true,
            'reply' => $reply,
        ]);
    }
}
