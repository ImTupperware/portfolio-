<?php

namespace App\Http\Resources\Api\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'summary' => $this->summary,
            'description' => $this->description,
            'thumbnail_url' => $this->thumbnail_url,
            'live_url' => $this->live_url,
            'app_url' => $this->app_url,
            'github_url' => $this->github_url,
            'featured' => (bool)$this->featured,
            'status' => $this->status,
            'sort_order' => (int)$this->sort_order,
            'views_count' => (int)$this->views_count,
            'tags' => $this->tags ? $this->tags->pluck('name')->values()->all() : [],
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
