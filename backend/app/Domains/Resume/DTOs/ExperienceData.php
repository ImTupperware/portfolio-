<?php

namespace App\Domains\Resume\DTOs;

use App\Models\WorkExperience;

readonly class ExperienceData
{
    /**
     * @param array<string> $highlights
     * @param array<string> $technologies
     */
    public function __construct(
        public string $company,
        public string $role,
        public string $employment_type,
        public ?string $location,
        public string $start_date,
        public ?string $end_date,
        public bool $is_current,
        public string $summary,
        public array $highlights,
        public array $technologies,
        public int $sort_order = 0,
        public bool $is_visible = true,
    ) {}

    public static function fromArray(array $data, ?WorkExperience $existing = null): self
    {
        $startDate = $data['start_date'] ?? null;
        if (!$startDate && $existing?->start_date) {
            $startDate = is_string($existing->start_date)
                ? $existing->start_date
                : $existing->start_date->format('Y-m-d');
        }

        $endDate = array_key_exists('end_date', $data)
            ? $data['end_date']
            : ($existing?->end_date ? (is_string($existing->end_date) ? $existing->end_date : $existing->end_date->format('Y-m-d')) : null);

        return new self(
            company: (string)($data['company'] ?? $existing?->company ?? ''),
            role: (string)($data['role'] ?? $existing?->role ?? ''),
            employment_type: (string)($data['employment_type'] ?? $existing?->employment_type ?? 'Full-time'),
            location: array_key_exists('location', $data) ? $data['location'] : $existing?->location,
            start_date: (string)($startDate ?? date('Y-m-d')),
            end_date: $endDate,
            is_current: (bool)($data['is_current'] ?? $existing?->is_current ?? false),
            summary: (string)($data['summary'] ?? $existing?->summary ?? ''),
            highlights: (array)($data['highlights'] ?? $existing?->highlights ?? []),
            technologies: (array)($data['technologies'] ?? $existing?->technologies ?? []),
            sort_order: (int)($data['sort_order'] ?? $existing?->sort_order ?? 0),
            is_visible: (bool)($data['is_visible'] ?? $existing?->is_visible ?? true),
        );
    }
}
