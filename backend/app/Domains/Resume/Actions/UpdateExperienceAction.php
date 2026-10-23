<?php

namespace App\Domains\Resume\Actions;

use App\Domains\Resume\DTOs\ExperienceData;
use App\Models\User;
use App\Models\WorkExperience;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

class UpdateExperienceAction
{
    /**
     * Executes work experience update inside an ACID transaction with anti-IDOR verification.
     *
     * @throws AuthorizationException
     */
    public function execute(User $user, WorkExperience $experience, ExperienceData $data): WorkExperience
    {
        // Anti-IDOR ownership barrier
        if ((int)$user->id !== (int)$experience->user_id) {
            throw new AuthorizationException('Access denied: You do not own this experience record.');
        }

        return DB::transaction(function () use ($experience, $data) {
            $experience->update([
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
                'sort_order' => $data->sort_order,
                'is_visible' => $data->is_visible,
            ]);

            return $experience;
        }, attempts: 3);
    }
}
