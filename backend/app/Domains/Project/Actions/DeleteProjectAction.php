<?php

namespace App\Domains\Project\Actions;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

class DeleteProjectAction
{
    /**
     * Executes project deletion inside an ACID transaction with anti-IDOR validation.
     *
     * @throws AuthorizationException
     */
    public function execute(User $user, Project $project): void
    {
        // Anti-IDOR ownership barrier (Admin allowed)
        if ($user->role !== 'admin' && (int)$user->id !== (int)$project->user_id) {
            throw new AuthorizationException('Access denied: You do not own this project.');
        }

        DB::transaction(function () use ($project) {
            $project->tags()->detach();
            $project->delete();
        }, attempts: 3);
    }
}
