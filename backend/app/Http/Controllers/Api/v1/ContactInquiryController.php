<?php

namespace App\Http\Controllers\Api\v1;

use App\Domains\Inquiry\Actions\SubmitInquiryAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\StoreInquiryRequest;
use App\Http\Resources\Api\v1\ContactInquiryResource;
use App\Models\ContactInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ContactInquiryController extends Controller
{
    /**
     * Store new visitor contact inquiry.
     */
    public function store(StoreInquiryRequest $request, SubmitInquiryAction $action): JsonResponse
    {
        $inquiry = $action->execute($request->validated(), $request->ip());

        return response()->json([
            'success' => true,
            'message' => 'Your message has been securely sent. Thank you!',
            'data' => new ContactInquiryResource($inquiry),
        ], 201);
    }

    /**
     * Admin view with mandatory pagination.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min(max((int)$request->input('per_page', 20), 1), 50);

        $inquiries = ContactInquiry::query()
            ->when($request->has('status'), fn($q) => $q->where('status', $request->input('status')))
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return ContactInquiryResource::collection($inquiries);
    }
}
