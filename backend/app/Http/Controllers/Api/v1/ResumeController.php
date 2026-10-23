<?php

namespace App\Http\Controllers\Api\v1;

use App\Domains\Resume\Actions\CreateExperienceAction;
use App\Domains\Resume\Actions\UpdateExperienceAction;
use App\Domains\Resume\DTOs\ExperienceData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\StoreExperienceRequest;
use App\Http\Requests\Api\v1\UpdateExperienceRequest;
use App\Http\Resources\Api\v1\CertificationResource;
use App\Http\Resources\Api\v1\EducationResource;
use App\Http\Resources\Api\v1\ExperienceResource;
use App\Http\Resources\Api\v1\SkillResource;
use App\Models\Certification;
use App\Models\Education;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkExperience;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class ResumeController extends Controller
{
    /**
     * Get aggregated Executive Resume bundle.
     */
    public function bundle(Request $request): JsonResponse
    {
        $admin = User::where('role', 'admin')->first();

        $expQuery = WorkExperience::query();
        $user = $request->user() ?? auth('sanctum')->user();
        if (!$user || $user->role !== 'admin') {
            $expQuery->where('is_visible', true);
        }

        $experiences = $expQuery->orderBy('is_current', 'desc')
            ->orderBy('sort_order', 'asc')
            ->orderBy('start_date', 'desc')
            ->get();

        $certifications = Certification::orderBy('sort_order', 'asc')
            ->orderBy('issue_date', 'desc')
            ->get();

        $educations = Education::orderBy('sort_order', 'asc')
            ->orderBy('start_year', 'desc')
            ->get();

        $skills = Skill::orderBy('sort_order', 'asc')
            ->orderBy('proficiency', 'desc')
            ->get();

        return response()->json([
            'profile' => [
                'name' => $admin?->name ?? 'AHMAD NURJUWAIDI BIN CHE ADNAN',
                'title' => $admin?->title ?? 'Junior Full-Stack Software Engineer',
                'summary' => $admin?->summary ?? 'Full-Stack Software Engineer and Computer Science graduate (UMPSA) with practical experience building modern web applications, offline-first PWAs, and RESTful microservices. Proficient in TypeScript, Next.js 15, React 19, Laravel 12, and PostgreSQL/Supabase.',
                'email' => $admin?->email ?? 'ahmadwaidi@gmail.com',
                'location' => $admin?->location ?? 'Besut, Terengganu (Open to Relocation & Remote)',
                'availability' => $admin?->availability ?? 'Immediate (Open to Relocation across Malaysia & Remote roles)',
                'phone' => $admin?->phone ?? '+6011-3522 1977',
                'whatsapp' => $admin?->whatsapp ?? $admin?->phone ?? '+6011-3522 1977',
                'github_url' => $admin?->github_url ?? 'https://github.com/ImTupperware',
                'linkedin_url' => $admin?->linkedin_url ?? 'https://www.linkedin.com/in/ahmad-nurjuwaidi-41b8ba271',
                'website_url' => $admin?->website_url,
            ],
            'experiences' => ExperienceResource::collection($experiences),
            'certifications' => CertificationResource::collection($certifications),
            'educations' => EducationResource::collection($educations),
            'skills' => SkillResource::collection($skills),
        ]);
    }

    public function experiences(Request $request): AnonymousResourceCollection
    {
        $perPage = min(max((int)$request->input('per_page', 20), 1), 50);

        $user = $request->user() ?? auth('sanctum')->user();
        if (!$user || $user->role !== 'admin') {
            $query->where('is_visible', true);
        }

        $list = $query->orderBy('is_current', 'desc')
            ->orderBy('sort_order', 'asc')
            ->orderBy('start_date', 'desc')
            ->paginate($perPage);

        return ExperienceResource::collection($list);
    }

    public function storeExperience(StoreExperienceRequest $request, CreateExperienceAction $action): JsonResponse
    {
        $dto = ExperienceData::fromArray($request->validated());
        $exp = $action->execute($request->user(), $dto);

        return (new ExperienceResource($exp))->response()->setStatusCode(201);
    }

    public function updateExperience(
        UpdateExperienceRequest $request,
        WorkExperience $experience,
        UpdateExperienceAction $action
    ): ExperienceResource {
        $dto = ExperienceData::fromArray($request->validated(), $experience);
        $updated = $action->execute($request->user(), $experience, $dto);

        return new ExperienceResource($updated);
    }

    public function destroyExperience(WorkExperience $experience): JsonResponse
    {
        Gate::authorize('delete', $experience);
        $experience->delete();

        return response()->json(['success' => true, 'message' => 'Experience removed.']);
    }
}
