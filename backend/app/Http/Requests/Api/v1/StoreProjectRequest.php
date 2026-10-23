<?php

namespace App\Http\Requests\Api\v1;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash', 'unique:projects,slug'],
            'summary' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'thumbnail_url' => ['nullable', 'url', 'max:1024'],
            'live_url' => ['nullable', 'url', 'max:1024'],
            'app_url' => ['nullable', 'url', 'max:1024'],
            'github_url' => ['nullable', 'url', 'max:1024'],
            'featured' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'in:draft,published,archived'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'tags' => ['sometimes', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}
