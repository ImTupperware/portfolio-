<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\StoreCertificationRequest;
use App\Http\Requests\Api\v1\UpdateCertificationRequest;
use App\Models\Certification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class CertificationController extends Controller
{
    public function store(StoreCertificationRequest $request): JsonResponse
    {
        $cert = $request->user()->certifications()->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Certification added successfully.',
            'data' => $cert,
        ], 201);
    }

    public function update(UpdateCertificationRequest $request, Certification $certification): JsonResponse
    {
        Gate::authorize('update', $certification);

        $certification->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Certification updated successfully.',
            'data' => $certification,
        ]);
    }

    public function destroy(Certification $certification): JsonResponse
    {
        Gate::authorize('delete', $certification);

        $certification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Certification deleted successfully.',
        ]);
    }
}
