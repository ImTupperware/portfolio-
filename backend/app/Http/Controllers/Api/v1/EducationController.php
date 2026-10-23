<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\StoreEducationRequest;
use App\Http\Requests\Api\v1\UpdateEducationRequest;
use App\Models\Education;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class EducationController extends Controller
{
    public function store(StoreEducationRequest $request): JsonResponse
    {
        $edu = $request->user()->educations()->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Education record added successfully.',
            'data' => $edu,
        ], 201);
    }

    public function update(UpdateEducationRequest $request, Education $education): JsonResponse
    {
        Gate::authorize('update', $education);

        $education->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Education record updated successfully.',
            'data' => $education,
        ]);
    }

    public function destroy(Education $education): JsonResponse
    {
        Gate::authorize('delete', $education);

        $education->delete();

        return response()->json([
            'success' => true,
            'message' => 'Education record deleted successfully.',
        ]);
    }
}
