<?php

namespace App\Domains\Project\Actions;

use App\Domains\Project\DTOs\ProjectData;
use App\Models\Project;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateProjectAction
{
    /**
     * Executes project creation inside an ACID transaction.
     */
    public function execute(User $user, ProjectData $data): Project
    {
        return DB::transaction(function () use ($user, $data) {
            $baseSlug = $data->slug ?: Str::slug($data->title);
            $slug = $baseSlug;
            $counter = 1;

            while (Project::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }

            $project = Project::create([
                'user_id' => $user->id,
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

            if (!empty($data->tags)) {
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
