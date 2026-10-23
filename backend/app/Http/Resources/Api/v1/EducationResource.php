<?php

namespace App\Http\Resources\Api\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EducationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'institution' => $this->institution,
            'degree' => $this->degree,
            'field_of_study' => $this->field_of_study,
            'start_year' => (int)$this->start_year,
            'end_year' => $this->end_year ? (int)$this->end_year : null,
            'grade' => $this->grade,
            'sort_order' => (int)$this->sort_order,
        ];
    }
}
