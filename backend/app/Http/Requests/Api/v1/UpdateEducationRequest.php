<?php

namespace App\Http\Requests\Api\v1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'institution' => ['sometimes', 'required', 'string', 'max:255'],
            'degree' => ['sometimes', 'required', 'string', 'max:255'],
            'field_of_study' => ['sometimes', 'required', 'string', 'max:255'],
            'start_year' => ['sometimes', 'required', 'integer', 'min:1970', 'max:2100'],
            'end_year' => ['nullable', 'integer', 'min:1970', 'max:2100'],
            'grade' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
