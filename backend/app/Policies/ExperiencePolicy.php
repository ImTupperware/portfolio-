<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkExperience;

class ExperiencePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, WorkExperience $experience): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Anti-IDOR: Strict resource ownership verification.
     */
    public function update(User $user, WorkExperience $experience): bool
    {
        return (int)$user->id === (int)$experience->user_id;
    }

    /**
     * Anti-IDOR: Strict resource ownership verification.
     */
    public function delete(User $user, WorkExperience $experience): bool
    {
        return (int)$user->id === (int)$experience->user_id;
    }
}
