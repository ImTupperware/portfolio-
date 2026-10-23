<?php

namespace App\Policies;

use App\Models\Skill;
use App\Models\User;

class SkillPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Skill $skill): bool
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
    public function update(User $user, Skill $skill): bool
    {
        return (int)$user->id === (int)$skill->user_id;
    }

    /**
     * Anti-IDOR: Strict resource ownership verification.
     */
    public function delete(User $user, Skill $skill): bool
    {
        return (int)$user->id === (int)$skill->user_id;
    }
}
