<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\StoreSkillRequest;
use App\Http\Requests\Api\v1\UpdateSkillRequest;
use App\Http\Resources\Api\v1\SkillResource;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class SkillController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min(max((int)$request->input('per_page', 50), 1), 100);

        $query = Skill::query();

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }

        $skills = $query->orderBy('sort_order', 'asc')
            ->orderBy('proficiency', 'desc')
            ->paginate($perPage);

        return SkillResource::collection($skills);
    }

    public function store(StoreSkillRequest $request): JsonResponse
    {
        $skill = $request->user()->skills()->create($request->validated());

        return (new SkillResource($skill))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateSkillRequest $request, Skill $skill): SkillResource
    {
        Gate::authorize('update', $skill);

        $skill->update($request->validated());

        return new SkillResource($skill);
    }

    public function destroy(Skill $skill): JsonResponse
    {
        Gate::authorize('delete', $skill);

        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully.',
        ], 200);
    }
}
