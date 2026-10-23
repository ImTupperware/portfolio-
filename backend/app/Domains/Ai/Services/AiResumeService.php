<?php

namespace App\Domains\Ai\Services;

use App\Models\Certification;
use App\Models\Education;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkExperience;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiResumeService
{
    /**
     * Answers a visitor question grounded in live resume facts.
     */
    public function answer(string $query, array $history = []): string
    {
        $knowledge = $this->buildKnowledgeContext();

        $apiKey = config('services.gemini.key');
        if (!empty($apiKey)) {
            $geminiResponse = $this->askGemini($query, $history, $knowledge, $apiKey);
            if ($geminiResponse !== null) {
                return $geminiResponse;
            }
        }

        return $this->smartLocalResponse($query, $knowledge);
    }

    /**
     * Aggregates live public database records into structured resume context.
     */
    private function buildKnowledgeContext(): array
    {
        $user = User::where('role', 'admin')->first();
        $experiences = WorkExperience::where('is_visible', true)
            ->orderBy('is_current', 'desc')
            ->orderBy('sort_order', 'asc')
            ->get();
        $projects = Project::with('tags')
            ->where('status', 'published')
            ->orderBy('featured', 'desc')
            ->orderBy('sort_order', 'asc')
            ->get();
        $skills = Skill::orderBy('category', 'asc')->orderBy('proficiency', 'desc')->get();
        $certifications = Certification::orderBy('sort_order', 'asc')->get();
        $educations = Education::orderBy('sort_order', 'asc')->get();

        return compact('user', 'experiences', 'projects', 'skills', 'certifications', 'educations');
    }

    /**
     * Calls Google Gemini REST API.
     */
    private function askGemini(string $query, array $history, array $ctx, string $apiKey): ?string
    {
        try {
            $model = config('services.gemini.model', 'gemini-1.5-flash');
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

            $systemPrompt = "You are the AI Career Assistant representing " . ($ctx['user']?->name ?? 'Ahmad') . 
                ". Professional Title: " . ($ctx['user']?->title ?? '') . 
                ". Bio: " . ($ctx['user']?->summary ?? '') . 
                ". Location: " . ($ctx['user']?->location ?? '') . 
                ". Availability: " . ($ctx['user']?->availability ?? '') . 
                ". WhatsApp: " . ($ctx['user']?->whatsapp ?? '') . 
                ". Email: " . ($ctx['user']?->email ?? '') . 
                ". Experiences: " . json_encode($ctx['experiences']) . 
                ". Projects: " . json_encode($ctx['projects']) . 
                ". Skills: " . json_encode($ctx['skills']) . 
                ". Certifications: " . json_encode($ctx['certifications']) . 
                ". Be concise, friendly, professional, and ground all claims in these facts. If asked something unknown, politely offer to connect via WhatsApp or Email.";

            $response = Http::timeout(10)->post($url, [
                'system_instruction' => [
                    'parts' => [['text' => $systemPrompt]]
                ],
                'contents' => [
                    ['role' => 'user', 'parts' => [['text' => $query]]]
                ],
                'generationConfig' => [
                    'temperature' => 0.4,
                    'maxOutputTokens' => 600,
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
                if ($reply) {
                    return trim($reply);
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Gemini AI chat call fallback triggered: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Intelligent local knowledge retrieval engine when no external API key is configured.
     */
    private function smartLocalResponse(string $query, array $ctx): string
    {
        $q = strtolower($query);
        $user = $ctx['user'];

        // 1. Contact / WhatsApp / Email / Availability
        if (str_contains($q, 'contact') || str_contains($q, 'email') || str_contains($q, 'whatsapp') || str_contains($q, 'hire') || str_contains($q, 'call') || str_contains($q, 'reach') || str_contains($q, 'open') || str_contains($q, 'avail') || str_contains($q, 'role')) {
            $msg = "You can connect with {$user?->name} directly through multiple channels:\n";
            if ($user?->whatsapp) {
                $digits = preg_replace('/[^0-9]/', '', $user->whatsapp);
                $msg .= "• **WhatsApp**: [Click to Chat](https://wa.me/{$digits}) ({$user->whatsapp})\n";
            }
            if ($user?->email) {
                $msg .= "• **Email**: [{$user->email}](mailto:{$user->email})\n";
            }
            if ($user?->linkedin_url) {
                $msg .= "• **LinkedIn**: [Profile]({$user->linkedin_url})\n";
            }
            if ($user?->github_url) {
                $msg .= "• **GitHub**: [Profile]({$user->github_url})\n";
            }
            $msg .= "\nHe is currently **{$user?->availability}**.";
            return $msg;
        }

        // 2. Skills / Technologies / Stack
        if (str_contains($q, 'skill') || str_contains($q, 'stack') || str_contains($q, 'tech') || str_contains($q, 'language') || str_contains($q, 'framework')) {
            $grouped = $ctx['skills']->groupBy('category')->map(fn($items) => $items->pluck('name')->join(', '));
            $msg = "{$user?->name}'s technical expertise spans modern full-stack web development, offline-first PWAs, and cloud databases:\n\n";
            foreach ($grouped as $category => $skillList) {
                $msg .= "• **" . ucfirst($category) . "**: {$skillList}\n";
            }
            return $msg . "\nFeel free to ask for details about any specific skill or project!";
        }

        // 3. Work Experience / History
        if (str_contains($q, 'experience') || str_contains($q, 'career') || str_contains($q, 'background') || str_contains($q, 'work') || str_contains($q, 'company') || str_contains($q, 'intern') || str_contains($q, 'history')) {
            $msg = "Here is a summary of {$user?->name}'s professional experience:\n\n";
            foreach ($ctx['experiences']->take(3) as $exp) {
                $period = $exp->is_current ? 'Present' : $exp->end_date;
                $msg .= "• **{$exp->role}** at *{$exp->company}* ({$exp->start_date} – {$period})\n  {$exp->summary}\n\n";
            }
            return $msg . "Would you like to know more about a specific role or achievement?";
        }

        // 4. Projects
        if (str_contains($q, 'project') || str_contains($q, 'build') || str_contains($q, 'portfolio') || str_contains($q, 'demo') || str_contains($q, 'code')) {
            $msg = "Here are notable architectural projects delivered by {$user?->name}:\n\n";
            foreach ($ctx['projects']->take(3) as $p) {
                $tags = implode(', ', $p->tags->pluck('name')->toArray());
                $msg .= "• **{$p->title}**: {$p->summary}\n  *Technologies*: {$tags}\n";
                if ($p->live_url) $msg .= "  *Live Demo*: [Visit Demo]({$p->live_url})\n";
                $msg .= "\n";
            }
            return $msg . "You can explore all projects in the Projects section above!";
        }

        // 5. Certifications / Education
        if (str_contains($q, 'cert') || str_contains($q, 'degree') || str_contains($q, 'education') || str_contains($q, 'university') || str_contains($q, 'school')) {
            $certs = $ctx['certifications']->map(fn($c) => "• **{$c->name}** issued by {$c->issuer}")->join("\n");
            $edus = $ctx['educations']->map(fn($e) => "• **{$e->degree} in {$e->field_of_study}**, {$e->institution}")->join("\n");
            return "### Certifications\n{$certs}\n\n### Education\n{$edus}";
        }

        // Default greeting / overview
        return "Hello! I am {$user?->name}'s AI Career Assistant.\n\n" .
            "{$user?->name} is a **{$user?->title}** based in {$user?->location}.\n\n" .
            "{$user?->summary}\n\n" .
            "You can ask me about:\n" .
            "• His **core technical skills and architecture expertise**\n" .
            "• Notable **projects and production systems**\n" .
            "• Career history and **work experiences**\n" .
            "• Direct **contact channels (WhatsApp, Email, LinkedIn)**";
    }
}
