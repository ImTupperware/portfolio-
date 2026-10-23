<?php

namespace App\Http\Requests\Api\v1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    /**
     * Enforce Anti-IDOR policy check at the Request authorization barrier.
     */
    public function authorize(): bool
    {
        $project = $this->route('project');
        return $project && $this->user() && $this->user()->can('update', $project);
    }

    public function rules(): array
    {
        $project = $this->route('project');
        $projectId = $project?->id;

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash', Rule::unique('projects', 'slug')->ignore($projectId)],
            'summary' => ['sometimes', 'required', 'string', 'max:500'],
            'description' => ['sometimes', 'required', 'string'],
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
