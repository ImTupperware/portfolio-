<?php

namespace App\Domains\Project\Actions;

use App\Domains\Project\DTOs\ProjectData;
use App\Models\Project;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UpdateProjectAction
{
    /**
     * Executes project update inside an ACID transaction with anti-IDOR validation.
     *
     * @throws AuthorizationException
     */
    public function execute(User $user, Project $project, ProjectData $data): Project
    {
        // Anti-IDOR ownership barrier
        if ((int)$user->id !== (int)$project->user_id) {
            throw new AuthorizationException('Access denied: You do not own this project.');
        }

        return DB::transaction(function () use ($project, $data) {
            $slug = $project->slug;
            if ($data->slug && $data->slug !== $project->slug) {
                $baseSlug = Str::slug($data->slug);
                $slug = $baseSlug;
                $counter = 1;
                while (Project::where('slug', $slug)->where('id', '!=', $project->id)->exists()) {
                    $slug = "{$baseSlug}-{$counter}";
                    $counter++;
                }
            }

            $project->update([
                'title' => $data->title,
                'slug' => $slug,
                'summary' => $data->summary,
                'description' => $data->description,
                'thumbnail_url' => $data->thumbnail_url,
                'live_url' => $data->live_url,
                'app_url' => $data->app_url,
                'github_url' => $data->github_url,
                'featured' => $data->featured,
                'status' => $data->status,
                'sort_order' => $data->sort_order,
            ]);

            if (isset($data->tags)) {
                $tagIds = [];
                foreach ($data->tags as $tagName) {
                    $cleanName = trim($tagName);
                    if ($cleanName === '') {
                        continue;
                    }
                    $tag = Tag::firstOrCreate(
                        ['slug' => Str::slug($cleanName)],
                        ['name' => $cleanName]
                    );
                    $tagIds[] = $tag->id;
                }
                $project->tags()->sync($tagIds);
            }

            return $project->load('tags');
        }, attempts: 3);
    }
}
