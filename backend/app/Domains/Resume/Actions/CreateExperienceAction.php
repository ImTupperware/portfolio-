<?php

namespace App\Domains\Resume\Actions;

use App\Domains\Resume\DTOs\ExperienceData;
use App\Models\User;
use App\Models\WorkExperience;
use Illuminate\Support\Facades\DB;

class CreateExperienceAction
{
    /**
     * Executes work experience creation in an ACID transaction.
     */
    public function execute(User $user, ExperienceData $data): WorkExperience
    {
        return DB::transaction(function () use ($user, $data) {
            return WorkExperience::create([
                'user_id' => $user->id,
                'company' => $data->company,
                'role' => $data->role,
                'employment_type' => $data->employment_type,
                'location' => $data->location,
                'start_date' => $data->start_date,
                'end_date' => $data->is_current ? null : $data->end_date,
                'is_current' => $data->is_current,
                'summary' => $data->summary,
                'highlights' => $data->highlights,
                'technologies' => $data->technologies,
                'is_visible' => $data->is_visible,
                'sort_order' => $data->sort_order,
            ]);
        }, attempts: 3);
    }
}
