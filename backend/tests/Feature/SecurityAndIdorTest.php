<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityAndIdorTest extends TestCase
{
    use DatabaseTransactions;

    private User $owner;
    private Project $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::create([
            'name' => 'Owner User',
            'email' => 'owner_' . uniqid() . '@example.com',
            'password' => Hash::make('secret123'),
            'role' => 'admin',
        ]);

        $this->project = Project::create([
            'user_id' => $this->owner->id,
            'title' => 'Secure Architecture Project',
            'slug' => 'secure-arch-' . uniqid(),
            'summary' => 'Initial summary',
            'description' => 'Initial full description',
            'status' => 'published',
        ]);
    }

    public function test_public_can_list_published_projects_paginated(): void
    {
        $response = $this->getJson('/api/v1/projects?per_page=2');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'slug', 'summary', 'status', 'tags', 'views_count']
                ],
                'links',
                'meta' => ['current_page', 'per_page', 'total']
            ]);
    }

    public function test_anti_idor_prevents_unauthorized_user_from_updating_others_project(): void
    {
        $attacker = User::create([
            'name' => 'Attacker',
            'email' => 'attacker_' . uniqid() . '@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Attacker authenticates with Sanctum
        Sanctum::actingAs($attacker);

        // Attacker attempts to update Owner's project
        $response = $this->putJson("/api/v1/projects/{$this->project->id}", [
            'title' => 'Tampered Title via IDOR',
            'summary' => 'Hacked summary',
            'description' => 'Hacked description',
        ]);

        // Must be rejected by Anti-IDOR policy with 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED_ACCESS',
                ],
            ]);
    }

    public function test_contact_inquiry_submission_and_sanitization(): void
    {
        $payload = [
            'name' => '<script>alert("xss")</script>John Architect',
            'email' => 'john@enterprise.com',
            'subject' => 'Production Security Audit',
            'message' => '<b>Urgent</b> Request for zero-trust review.',
        ];

        $response = $this->postJson('/api/v1/inquiries', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Your message has been securely sent. Thank you!',
            ]);

        // Verify HTML tags were stripped/sanitized
        $this->assertDatabaseMissing('contact_inquiries', [
            'name' => '<script>alert("xss")</script>John Architect',
        ]);
    }

    public function test_authenticated_user_can_update_profile(): void
    {
        Sanctum::actingAs($this->owner);

        $response = $this->putJson('/api/v1/user/profile', [
            'name' => 'Updated Ahmad Architect',
            'title' => 'Chief Technology Officer & Senior Architect',
            'summary' => 'Directing enterprise-wide digital acceleration and cyber resilience.',
            'location' => 'Austin, TX / Remote',
            'availability' => 'Available for Advisory Boards',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'user' => [
                    'id' => $this->owner->id,
                    'name' => 'Updated Ahmad Architect',
                    'title' => 'Chief Technology Officer & Senior Architect',
                    'location' => 'Austin, TX / Remote',
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->owner->id,
            'name' => 'Updated Ahmad Architect',
            'title' => 'Chief Technology Officer & Senior Architect',
        ]);
    }

    public function test_unauthenticated_user_cannot_update_profile(): void
    {
        $response = $this->putJson('/api/v1/user/profile', [
            'name' => 'Hacker Name',
        ]);

        $response->assertStatus(401);
    }
}
