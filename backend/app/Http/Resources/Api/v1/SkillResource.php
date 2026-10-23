<?php

namespace App\Http\Resources\Api\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'category' => $this->category,
            'proficiency' => (int)$this->proficiency,
            'icon' => $this->icon,
            'sort_order' => (int)$this->sort_order,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
