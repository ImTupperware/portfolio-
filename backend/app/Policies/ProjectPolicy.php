<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    /**
     * Admin bypass for all authorization policies.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->role === 'admin') {
            return true;
        }
        return null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     * Public projects are viewable by anyone; drafts require ownership.
     */
    public function view(?User $user, Project $project): bool
    {
        if ($project->status === 'published') {
            return true;
        }

        return $user !== null && (int)$user->id === (int)$project->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Anti-IDOR: Determine whether the user can update the model.
     * Strictly verifies ownership: auth()->id() === project->user_id
     */
    public function update(User $user, Project $project): bool
    {
        return (int)$user->id === (int)$project->user_id;
    }

    /**
     * Anti-IDOR: Determine whether the user can delete the model.
     * Strictly verifies ownership: auth()->id() === project->user_id
     */
    public function delete(User $user, Project $project): bool
    {
        return (int)$user->id === (int)$project->user_id;
    }
}
