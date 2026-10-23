<?php

namespace App\Http\Controllers\Api\v1;

use App\Domains\Project\Actions\CreateProjectAction;
use App\Domains\Project\Actions\DeleteProjectAction;
use App\Domains\Project\Actions\UpdateProjectAction;
use App\Domains\Project\DTOs\ProjectData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\StoreProjectRequest;
use App\Http\Requests\Api\v1\UpdateProjectRequest;
use App\Http\Resources\Api\v1\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class ProjectController extends Controller
{
    /**
     * Public / Authenticated paginated listing.
     * Enforces explicit B-Tree indexed search and pagination.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min(max((int)$request->input('per_page', 12), 1), 50);

        $query = Project::with('tags');

        // Non-admin / unauthenticated users only see published projects
        $user = $request->user() ?? auth('sanctum')->user();
        if (!$user || $user->role !== 'admin') {
            $query->published();
        } elseif ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($request->has('tag')) {
            $tag = $request->input('tag');
            $slug = \Illuminate\Support\Str::slug($tag);
            $query->whereHas('tags', fn($q) => $q->where('slug', $slug)->orWhere('name', $tag));
        }

        $projects = $query->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return ProjectResource::collection($projects);
    }

    public function show(Project $project): ProjectResource
    {
        $this->authorize('view', $project);

        $project->increment('views_count');

        return new ProjectResource($project->load('tags'));
    }

    public function store(StoreProjectRequest $request, CreateProjectAction $action): JsonResponse
    {
        $dto = ProjectData::fromArray($request->validated());
        $project = $action->execute($request->user(), $dto);

        return (new ProjectResource($project))
            ->response()
            ->setStatusCode(201);
    }

    public function update(
        UpdateProjectRequest $request,
        Project $project,
        UpdateProjectAction $action
    ): ProjectResource {
        $dto = ProjectData::fromArray($request->validated(), $project);
        $updated = $action->execute($request->user(), $project, $dto);

        return new ProjectResource($updated);
    }

    public function destroy(
        Request $request,
        Project $project,
        DeleteProjectAction $action
    ): JsonResponse {
        Gate::authorize('delete', $project);

        $action->execute($request->user(), $project);

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
        ], 200);
    }
}
