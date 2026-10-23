<?php

namespace App\Http\Controllers\Api\v1;

use App\Domains\Ai\Services\AiResumeParserService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResumeAiController extends Controller
{
    /**
     * Parses uploaded PDF or pasted text into structured resume JSON.
     */
    public function parse(Request $request, AiResumeParserService $parser): JsonResponse
    {
        $rawText = '';

        if ($request->hasFile('file')) {
            $request->validate(['file' => ['required', 'file', 'max:10240']]);
            $rawText = $parser->extractText($request->file('file'));
        } elseif ($request->filled('file_base64')) {
            $request->validate([
                'file_base64' => ['required', 'string'],
                'file_name' => ['nullable', 'string', 'max:255'],
                'file_mime' => ['nullable', 'string', 'max:120'],
            ]);
            $decoded = base64_decode((string)$request->input('file_base64'), true);
            if ($decoded === false) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid file encoding. Please re-select or drop your resume file.',
                ], 422);
            }
            $fileName = (string)$request->input('file_name', 'resume.pdf');
            $fileMime = (string)$request->input('file_mime', 'application/pdf');
            $rawText = $parser->extractTextFromBytes($decoded, $fileName, $fileMime);
        } elseif ($request->filled('text')) {
            $request->validate(['text' => ['required', 'string', 'min:10', 'max:50000']]);
            $rawText = (string)$request->input('text');
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Please provide either a resume file (PDF/TXT) or paste resume text.',
            ], 422);
        }

        $structured = $parser->parseToStructuredData($rawText);

        return response()->json([
            'success' => true,
            'preview' => $structured,
        ]);
    }

    /**
     * Commits confirmed structured data to the database inside an ACID transaction.
     */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'data' => ['required', 'array'],
            'data.profile' => ['required', 'array'],
            'data.experiences' => ['sometimes', 'array'],
            'data.skills' => ['sometimes', 'array'],
            'data.certifications' => ['sometimes', 'array'],
            'data.educations' => ['sometimes', 'array'],
            'data.projects' => ['sometimes', 'array'],
            'mode' => ['sometimes', 'in:replace,merge'],
        ]);

        $user = $request->user();
        $payload = $request->input('data');
        $mode = $request->input('mode', 'replace');

        DB::transaction(function () use ($user, $payload, $mode) {
            // 1. Update Profile
            if (isset($payload['profile']) && is_array($payload['profile'])) {
                $user->update(array_filter([
                    'name' => $payload['profile']['name'] ?? $user->name,
                    'title' => $payload['profile']['title'] ?? $user->title,
                    'summary' => $payload['profile']['summary'] ?? $user->summary,
                    'location' => $payload['profile']['location'] ?? $user->location,
                    'phone' => $payload['profile']['phone'] ?? $user->phone,
                    'whatsapp' => $payload['profile']['whatsapp'] ?? $user->whatsapp,
                    'github_url' => $payload['profile']['github_url'] ?? $user->github_url,
                    'linkedin_url' => $payload['profile']['linkedin_url'] ?? $user->linkedin_url,
                    'website_url' => $payload['profile']['website_url'] ?? $user->website_url,
                ]));
            }

            // If replace mode, clear previous records
            if ($mode === 'replace') {
                $user->workExperiences()->delete();
                $user->skills()->delete();
                $user->certifications()->delete();
                $user->educations()->delete();
                if (!empty($payload['projects'])) {
                    $user->projects()->delete();
                }
            }

            // 2. Insert Experiences
            if (!empty($payload['experiences'])) {
                foreach ($payload['experiences'] as $idx => $exp) {
                    $user->workExperiences()->create([
                        'company' => $exp['company'] ?? 'Company',
                        'role' => $exp['role'] ?? 'Engineer',
                        'employment_type' => $exp['employment_type'] ?? 'Full-time',
                        'location' => $exp['location'] ?? null,
                        'start_date' => $exp['start_date'] ?? now()->toDateString(),
                        'end_date' => !empty($exp['is_current']) ? null : ($exp['end_date'] ?? null),
                        'is_current' => !empty($exp['is_current']),
                        'summary' => $exp['summary'] ?? 'Professional experience',
                        'highlights' => $exp['highlights'] ?? [],
                        'technologies' => $exp['technologies'] ?? [],
                        'is_visible' => true,
                        'sort_order' => $idx,
                    ]);
                }
            }

            // 3. Insert Skills
            if (!empty($payload['skills'])) {
                foreach ($payload['skills'] as $idx => $s) {
                    $user->skills()->create([
                        'name' => $s['name'],
                        'category' => $s['category'] ?? 'Backend',
                        'proficiency' => (int)($s['proficiency'] ?? 85),
                        'sort_order' => $idx,
                    ]);
                }
            }

            // 4. Insert Certifications
            if (!empty($payload['certifications'])) {
                foreach ($payload['certifications'] as $idx => $c) {
                    $user->certifications()->create([
                        'name' => \Illuminate\Support\Str::limit($c['name'] ?? 'Certification', 195, ''),
                        'issuer' => \Illuminate\Support\Str::limit($c['issuer'] ?? 'Verified Issuer', 145, ''),
                        'issue_date' => $c['issue_date'] ?? now()->toDateString(),
                        'credential_id' => isset($c['credential_id']) ? \Illuminate\Support\Str::limit($c['credential_id'], 145, '') : null,
                        'credential_url' => $c['credential_url'] ?? null,
                        'sort_order' => $idx,
                    ]);
                }
            }

            // 5. Insert Educations
            if (!empty($payload['educations'])) {
                foreach ($payload['educations'] as $idx => $e) {
                    $user->educations()->create([
                        'institution' => \Illuminate\Support\Str::limit($e['institution'] ?? 'University', 195, ''),
                        'degree' => \Illuminate\Support\Str::limit($e['degree'] ?? 'Degree', 145, ''),
                        'field_of_study' => \Illuminate\Support\Str::limit($e['field_of_study'] ?? 'Field of Study', 145, ''),
                        'start_year' => (int)($e['start_year'] ?? 2021),
                        'end_year' => isset($e['end_year']) ? (int)$e['end_year'] : null,
                        'grade' => isset($e['grade']) ? \Illuminate\Support\Str::limit($e['grade'], 48, '') : null,
                        'sort_order' => $idx,
                    ]);
                }
            }

            // 6. Insert Projects
            if (!empty($payload['projects'])) {
                foreach ($payload['projects'] as $idx => $p) {
                    $user->projects()->create([
                        'title' => $p['title'],
                        'slug' => $p['slug'] ?? \Illuminate\Support\Str::slug($p['title']),
                        'summary' => $p['summary'] ?? '',
                        'description' => $p['description'] ?? '',
                        'featured' => !empty($p['featured']),
                        'status' => $p['status'] ?? 'published',
                        'sort_order' => $idx,
                    ]);
                }
            }
        }, attempts: 3);

        return response()->json([
            'success' => true,
            'message' => 'Resume successfully ingested. Your portfolio has been populated.',
        ]);
    }
}
