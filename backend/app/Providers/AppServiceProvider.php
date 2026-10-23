<?php

namespace App\Providers;

use App\Models\Project;
use App\Models\Skill;
use App\Policies\ProjectPolicy;
use App\Policies\SkillPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::shouldBeStrict(!app()->isProduction());

        // Register Policies
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Skill::class, SkillPolicy::class);
        Gate::policy(\App\Models\WorkExperience::class, \App\Policies\ExperiencePolicy::class);

        // Token-Bucket Rate Limiters
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('inquiries', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function () {
                return response()->json([
                    'success' => false,
                    'message' => 'Too many messages sent. Please wait a minute before submitting again.',
                ], 429);
            });
        });

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });
    }
}
