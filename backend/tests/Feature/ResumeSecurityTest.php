<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WorkExperience;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ResumeSecurityTest extends TestCase
{
    use DatabaseTransactions;

    public function test_resume_bundle_returns_valid_structure(): void
    {
        $response = $this->getJson('/api/v1/resume');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'profile' => ['name', 'title', 'summary', 'email', 'location'],
                'experiences' => [
                    '*' => ['id', 'company', 'role', 'summary', 'highlights', 'technologies', 'is_current']
                ],
                'certifications' => [
                    '*' => ['id', 'name', 'issuer', 'issue_date']
                ],
                'educations' => [
                    '*' => ['id', 'institution', 'degree', 'field_of_study', 'start_year']
                ],
                'skills',
            ]);
    }

    public function test_anti_idor_prevents_unauthorized_user_from_updating_others_experience(): void
    {
        $owner = User::create([
            'name' => 'Resume Owner',
            'email' => 'owner_resume_' . uniqid() . '@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $experience = WorkExperience::create([
            'user_id' => $owner->id,
            'company' => 'Enterprise Cloud',
            'role' => 'Security Architect',
            'employment_type' => 'Full-time',
            'start_date' => '2023-01-01',
            'is_current' => true,
            'summary' => 'Owner summary',
            'highlights' => ['Led zero trust deployment'],
            'technologies' => ['Laravel', 'MySQL'],
        ]);

        $attacker = User::create([
            'name' => 'Attacker',
            'email' => 'attacker_resume_' . uniqid() . '@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        Sanctum::actingAs($attacker);

        $response = $this->putJson("/api/v1/experiences/{$experience->id}", [
            'company' => 'Tampered Company via IDOR',
            'role' => 'Tampered Role',
            'summary' => 'Tampered summary',
            'highlights' => ['Hacked highlight'],
            'technologies' => ['Hacked'],
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED_ACCESS',
                ],
            ]);
    }

    public function test_owner_can_delete_experience_and_attacker_is_denied(): void
    {
        $owner = User::create([
            'name' => 'Owner Delete Test',
            'email' => 'owner_del_' . uniqid() . '@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $experience = WorkExperience::create([
            'user_id' => $owner->id,
            'company' => 'Delete Test Corp',
            'role' => 'Lead Architect',
            'employment_type' => 'Full-time',
            'start_date' => '2023-01-01',
            'is_current' => true,
            'summary' => 'Delete test summary',
            'highlights' => ['Highlight 1'],
            'technologies' => ['PHP'],
        ]);

        $attacker = User::create([
            'name' => 'Attacker Del',
            'email' => 'attacker_del_' . uniqid() . '@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Attacker denied
        Sanctum::actingAs($attacker);
        $this->deleteJson("/api/v1/experiences/{$experience->id}")
            ->assertStatus(403);

        // Owner succeeds
        Sanctum::actingAs($owner);
        $this->deleteJson("/api/v1/experiences/{$experience->id}")
            ->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('work_experiences', ['id' => $experience->id]);
    }

    public function test_hidden_experience_is_not_visible_to_public(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin', 'password' => Hash::make('password123'), 'role' => 'admin']
        );

        $hiddenExp = WorkExperience::create([
            'user_id' => $admin->id,
            'company' => 'Top Secret Corp ' . uniqid(),
            'role' => 'Classified Architect',
            'employment_type' => 'Full-time',
            'start_date' => '2024-01-01',
            'is_current' => true,
            'is_visible' => false,
            'summary' => 'Classified summary',
            'highlights' => ['Classified highlight'],
            'technologies' => ['Cryptographic'],
        ]);

        // Public check - should NOT see hidden experience
        $responsePublic = $this->getJson('/api/v1/resume');
        $responsePublic->assertStatus(200);
        $this->assertFalse(
            collect($responsePublic->json('experiences'))->contains('id', $hiddenExp->id)
        );

        // Authenticated admin check - should see hidden experience
        Sanctum::actingAs($admin);
        $responseAdmin = $this->getJson('/api/v1/resume');
        $responseAdmin->assertStatus(200);
        $this->assertTrue(
            collect($responseAdmin->json('experiences'))->contains('id', $hiddenExp->id)
        );
    }
}
