<?php

namespace App\Http\Requests\Api\v1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExperienceRequest extends FormRequest
{
    public function authorize(): bool
    {
        $experience = $this->route('experience');
        return $experience && $this->user() && $this->user()->can('update', $experience);
    }

    public function rules(): array
    {
        return [
            'company' => ['sometimes', 'required', 'string', 'max:150'],
            'role' => ['sometimes', 'required', 'string', 'max:150'],
            'employment_type' => ['sometimes', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:100'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_current' => ['sometimes', 'boolean'],
            'summary' => ['sometimes', 'required', 'string'],
            'highlights' => ['sometimes', 'required', 'array', 'min:1'],
            'highlights.*' => ['string', 'max:500'],
            'technologies' => ['sometimes', 'required', 'array'],
            'technologies.*' => ['string', 'max:50'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_visible' => ['sometimes', 'boolean'],
        ];
    }
}
