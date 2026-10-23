<?php

namespace App\Http\Resources\Api\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExperienceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'company' => $this->company,
            'role' => $this->role,
            'employment_type' => $this->employment_type,
            'location' => $this->location,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'is_current' => (bool)$this->is_current,
            'summary' => $this->summary,
            'highlights' => $this->highlights ?: [],
            'technologies' => $this->technologies ?: [],
            'sort_order' => (int)$this->sort_order,
            'is_visible' => (bool)($this->is_visible ?? true),
        ];
    }
}
