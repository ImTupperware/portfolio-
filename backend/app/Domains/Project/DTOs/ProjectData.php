<?php

namespace App\Domains\Project\DTOs;

use App\Models\Project;

readonly class ProjectData
{
    /**
     * @param array<string> $tags
     */
    public function __construct(
        public string $title,
        public ?string $slug,
        public string $summary,
        public string $description,
        public ?string $thumbnail_url = null,
        public ?string $live_url = null,
        public ?string $app_url = null,
        public ?string $github_url = null,
        public bool $featured = false,
        public string $status = 'draft',
        public int $sort_order = 0,
        public array $tags = [],
    ) {}

    public static function fromArray(array $data, ?Project $existing = null): self
    {
        return new self(
            title: (string)($data['title'] ?? $existing?->title ?? ''),
            slug: isset($data['slug']) && !empty($data['slug']) ? (string)$data['slug'] : $existing?->slug,
            summary: (string)($data['summary'] ?? $existing?->summary ?? ''),
            description: (string)($data['description'] ?? $existing?->description ?? ''),
            thumbnail_url: array_key_exists('thumbnail_url', $data) ? $data['thumbnail_url'] : $existing?->thumbnail_url,
            live_url: array_key_exists('live_url', $data) ? $data['live_url'] : $existing?->live_url,
            app_url: array_key_exists('app_url', $data) ? $data['app_url'] : $existing?->app_url,
            github_url: array_key_exists('github_url', $data) ? $data['github_url'] : $existing?->github_url,
            featured: (bool)($data['featured'] ?? $existing?->featured ?? false),
            status: (string)($data['status'] ?? $existing?->status ?? 'draft'),
            sort_order: (int)($data['sort_order'] ?? $existing?->sort_order ?? 0),
            tags: (array)($data['tags'] ?? ($existing ? $existing->tags->pluck('name')->toArray() : [])),
        );
    }
}
