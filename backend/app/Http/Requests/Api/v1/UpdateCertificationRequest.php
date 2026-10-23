<?php

namespace App\Http\Requests\Api\v1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCertificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'issuer' => ['sometimes', 'required', 'string', 'max:255'],
            'issue_date' => ['sometimes', 'required', 'date'],
            'expiry_date' => ['nullable', 'date'],
            'credential_id' => ['nullable', 'string', 'max:100'],
            'credential_url' => ['nullable', 'url', 'max:1024'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
