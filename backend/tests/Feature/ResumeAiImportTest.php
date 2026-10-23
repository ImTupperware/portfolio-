<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ResumeAiImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_admin_can_parse_resume_text(): void
    {
        $this->seed();
        $user = User::where('role', 'admin')->first();

        $response = $this->actingAs($user)->postJson('/api/v1/resume/parse-ai', [
            'text' => "John Doe\nPrincipal Engineer\njohn@example.com\nSkills: PHP, Laravel, Docker",
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'preview' => [
                    'profile',
                    'experiences',
                    'skills',
                ],
            ]);
    }

    public function test_resume_parser_does_not_confuse_address_with_name(): void
    {
        $this->seed();
        $user = User::where('role', 'admin')->first();

        $resumeText = <<<RESUME
LOT 1972, LRG.SUPRIMA, PRSN. LIMBONGAN, KG.RAJA,
22200 BESUT, TERENGGANU
+6011-3522 1977
ahmadwaidi@gmail.com
AHMAD NURJUWAIDI BIN CHE ADNAN
Strong foundation in critical thinking, attention to detail, and teamwork.
PROFILE
EDUCATION
Bachelor of Science Computer (Software Engineering) with Honours
University of Malaysia Pahang Al-Sultan Abdullah
EXPERIENCE
Industrial Training (Web Developer) | Next.js, Laravel, TypeScript, MySQL
Stealthx Performance Sdn. Bhd. March 2025- August 2025
RESUME;

        $response = $this->actingAs($user)->postJson('/api/v1/resume/parse-ai', [
            'text' => $resumeText,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('preview.profile.name', 'AHMAD NURJUWAIDI BIN CHE ADNAN')
            ->assertJsonPath('preview.profile.phone', '+6011-3522 1977')
            ->assertJsonPath('preview.profile.email', 'ahmadwaidi@gmail.com')
            ->assertJsonPath('preview.profile.location', 'Besut, Terengganu, Malaysia');
    }

    public function test_authenticated_admin_can_import_structured_resume_data(): void
    {
        $this->seed();
        $user = User::where('role', 'admin')->first();

        $payload = [
            'profile' => [
                'name' => 'Imported Name',
                'title' => 'Imported Title',
                'summary' => 'Imported Summary',
            ],
            'skills' => [
                ['name' => 'Rust', 'category' => 'Backend', 'proficiency' => 95],
            ],
            'experiences' => [
                [
                    'company' => 'New Corp',
                    'role' => 'Lead',
                    'start_date' => '2023-01-01',
                    'is_current' => true,
                    'summary' => 'Lead dev',
                ],
            ],
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/resume/import-ai', [
            'data' => $payload,
            'mode' => 'replace',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('users', ['name' => 'Imported Name']);
        $this->assertDatabaseHas('skills', ['name' => 'Rust']);
        $this->assertDatabaseHas('work_experiences', ['company' => 'New Corp']);
    }
}
