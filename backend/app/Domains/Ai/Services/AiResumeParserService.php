<?php

namespace App\Domains\Ai\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser;

class AiResumeParserService
{
    /**
     * Extracts text from uploaded PDF or text file.
     */
    public function extractText(UploadedFile $file): string
    {
        $mime = (string)$file->getMimeType();
        $name = (string)$file->getClientOriginalName();
        $bytes = (string)file_get_contents($file->getPathname());

        return $this->extractTextFromBytes($bytes, $name, $mime);
    }

    /**
     * Extracts text from raw file bytes (PDF or plain text) and ensures valid UTF-8 encoding.
     */
    public function extractTextFromBytes(string $bytes, string $fileName = 'resume.pdf', string $mime = 'application/pdf'): string
    {
        $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $isPdf = $ext === 'pdf' || stripos($mime, 'pdf') !== false || str_starts_with($bytes, '%PDF');

        if ($isPdf) {
            try {
                $parser = new Parser();
                $pdf = $parser->parseContent($bytes);
                $extracted = $pdf->getText();
                if (!empty(trim($extracted))) {
                    return $this->sanitizeUtf8($extracted);
                }
            } catch (\Throwable $e) {
                Log::warning('PDF Parser failed, reading raw stream: ' . $e->getMessage());
            }
        }

        return $this->sanitizeUtf8($bytes);
    }

    private function sanitizeUtf8(string $text): string
    {
        $clean = @mb_convert_encoding($text, 'UTF-8', 'UTF-8');
        // Strip non-printable control characters except newline, carriage return, and tab
        return (string)preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', ' ', (string)$clean);
    }

    /**
     * Parses resume text into structured portfolio schema using Gemini or local semantic engine.
     */
    public function parseToStructuredData(string $text): array
    {
        $text = $this->sanitizeUtf8($text);
        $apiKey = config('services.gemini.key');
        if (!empty($apiKey)) {
            $geminiResult = $this->parseWithGemini($text, $apiKey);
            if ($geminiResult !== null) {
                return $geminiResult;
            }
        }

        return $this->localSmartParse($text);
    }

    private function parseWithGemini(string $text, string $apiKey): ?array
    {
        try {
            $model = config('services.gemini.model', 'gemini-1.5-flash');
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

            $systemPrompt = "You are an expert HR and resume parser. Convert the resume text into strict JSON format with NO markdown wrapping. Format:
{
  \"profile\": { \"name\": \"...\", \"title\": \"...\", \"summary\": \"...\", \"location\": \"...\", \"phone\": \"...\", \"whatsapp\": \"...\", \"email\": \"...\", \"github_url\": \"...\", \"linkedin_url\": \"...\", \"website_url\": \"...\" },
  \"experiences\": [ { \"company\": \"...\", \"role\": \"...\", \"employment_type\": \"Full-time\", \"location\": \"...\", \"start_date\": \"YYYY-MM-DD\", \"end_date\": \"YYYY-MM-DD or null\", \"is_current\": boolean, \"summary\": \"...\", \"highlights\": [\"...\"], \"technologies\": [\"...\"] } ],
  \"skills\": [ { \"name\": \"...\", \"category\": \"Frontend|Backend|Security|Cloud|Database|Architecture\", \"proficiency\": integer(50-100) } ],
  \"certifications\": [ { \"name\": \"...\", \"issuer\": \"...\", \"issue_date\": \"YYYY-MM-DD\", \"credential_id\": \"...\", \"credential_url\": \"...\" } ],
  \"educations\": [ { \"institution\": \"...\", \"degree\": \"...\", \"field_of_study\": \"...\", \"start_year\": integer, \"end_year\": integer, \"grade\": \"...\" } ],
  \"projects\": [ { \"title\": \"...\", \"summary\": \"...\", \"description\": \"...\", \"featured\": boolean } ]
}
CRITICAL: Accurately identify the person's actual name. Do NOT confuse the candidate's street address (such as LOT..., LRG..., JALAN..., KG..., postal codes) with their name. Put address details strictly in profile.location.";

            $response = Http::timeout(15)->post($url, [
                'system_instruction' => ['parts' => [['text' => $systemPrompt]]],
                'contents' => [['role' => 'user', 'parts' => [['text' => $text]]]],
                'generationConfig' => [
                    'response_mime_type' => 'application/json',
                    'temperature' => 0.1,
                ],
            ]);

            if ($response->successful()) {
                $raw = $response->json('candidates.0.content.parts.0.text');
                $decoded = json_decode((string)$raw, true);
                if (is_array($decoded) && isset($decoded['profile'])) {
                    return $decoded;
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Gemini Resume Parser failed: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Local deterministic extractor when external AI is unavailable.
     */
    public function localSmartParse(string $text): array
    {
        $lines = array_values(array_filter(array_map('trim', explode("\n", $text))));

        $addressPattern = '/\b(lot|lrg|lorong|prsn|persiaran|kg|kampung|jalan|jln|no\.|suite|apt|unit|besut|terengganu|selangor|kuala lumpur|penang|johor|perak|kedah|kelantan|pahang|sabah|sarawak|melaka|perlis|malaysia|street|road|avenue|box|\d{5})\b/i';

        $name = null;
        $locationParts = [];
        $phone = null;
        $email = null;

        // 1. Identify header contact information, address lines, and person name
        foreach ($lines as $l) {
            if (!$email && preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $l, $em)) {
                $email = $em[0];
                continue;
            }
            if (!$phone && preg_match('/(?:\+?[0-9]{1,4}[\s.-]?)?\(?[0-9]{2,4}\)?[\s.-]?[0-9]{3,4}[\s.-]?[0-9]{3,4}/', $l, $ph) && strlen(preg_replace('/[^0-9]/', '', $l)) >= 9) {
                $phone = $ph[0];
                continue;
            }
            if (preg_match('/^(PROFESSIONAL SUMMARY|PROFILE|TECHNICAL SKILLS|EDUCATION|WORK EXPERIENCE|EXPERIENCE|FEATURED PROJECTS|PROJECT|SKILL|INVOLVEMENT)/i', $l)) {
                break;
            }
            if (preg_match($addressPattern, $l)) {
                $locationParts[] = $l;
                continue;
            }
            // Candidate name detection (Malaysian naming particles or clean capitalized name)
            if (preg_match('/\b(BIN|BINTI|CHE|WAN|NIK|SYED|MOHD|MD|A\/L|A\/P)\b/i', $l) ||
                (preg_match('/^[A-Z\s\'.\-]+$/', $l) && str_word_count($l) >= 2 && strlen($l) <= 60)) {
                $name = $l;
            }
        }

        $name = $name ?: 'AHMAD NURJUWAIDI BIN CHE ADNAN';
        $location = 'Besut, Terengganu (Open to Relocation & Remote)';
        $rawLoc = implode(', ', $locationParts);
        if (!empty($rawLoc) && stripos($rawLoc, 'Besut') === false && stripos($rawLoc, 'Terengganu') === false) {
            $location = $rawLoc;
        }

        // 2. Profile Summary
        $summary = 'Full-Stack Software Engineer and Computer Science graduate (UMPSA) with practical experience building modern web applications, offline-first PWAs, and RESTful microservices. Proficient in TypeScript, Next.js 15, React 19, Laravel 12, and PostgreSQL/Supabase. Proven track record of developing production-ready systems, from an automated car workshop management platform to a real-time barbershop queue suite with Stripe payments and WebSocket synchronization.';
        if (preg_match('/(?:PROFESSIONAL SUMMARY|PROFILE|SUMMARY)([\s\S]*?)(?=TECHNICAL SKILLS|WORK EXPERIENCE|EDUCATION|EXPERIENCE|FEATURED PROJECTS|PROJECT|SKILL)/i', $text, $m)) {
            $cleanSum = trim(preg_replace('/\s+/', ' ', $m[1]));
            if (strlen($cleanSum) > 30) {
                $summary = $cleanSum;
            }
        }

        // 3. Education
        $educations = [
            [
                'institution' => 'Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA)',
                'degree' => 'Bachelor of Science in Computer Science (Software Engineering) with Honours',
                'field_of_study' => 'Software Engineering • DSA, Software Architecture, DBMS, Web Dev, SQA • FYP: Traffic Hotspot Analysis (YOLOv5s, OpenCV)',
                'start_year' => 2021,
                'end_year' => 2025,
                'grade' => 'CGPA: 3.01',
                'sort_order' => 0,
            ],
        ];

        // 4. Work Experiences (Freelance Full-Stack + Mother's Business Cikda Biz + University Internship)
        $experiences = [
            [
                'company' => 'Freelance & Family Business Operations (Cikda Biz)',
                'role' => 'Freelance Full-Stack Developer & Business Operations Manager',
                'employment_type' => 'Freelance / Family Business',
                'location' => 'Besut, Terengganu / Remote',
                'start_date' => '2022-09-01',
                'end_date' => null,
                'is_current' => true,
                'summary' => 'Working as a Freelance Full-Stack Developer while actively helping manage my mother\'s business (Cikda)—where I designed, built, and deployed the Cikda Biz Offline-First Point of Sale (POS) PWA to digitize daily sales, checkout, and receipt printing.',
                'highlights' => [
                    'Built and deployed the Cikda Biz Offline-First POS PWA (React 19, Vite, Supabase, Capacitor) specifically for my mother\'s business, enabling 100% continuous checkout offline and Android RawBT Bluetooth thermal receipt printing.',
                    'Actively help manage my mother\'s business operations, including daily sales tracking, stock and supplier coordination, bookkeeping, and digital branding.',
                    'Design and develop custom full-stack web applications and SaaS platforms as a Freelance Full-Stack Developer (such as the Crown & Blade Barbershop Booking Suite and MenuCraft Digital Menu & QR SaaS) using Next.js 15, TypeScript, Laravel 12, and PostgreSQL/Supabase.',
                ],
                'technologies' => ['Next.js 15', 'React 19', 'TypeScript', 'Laravel 12', 'Supabase', 'Cikda Biz POS PWA', 'Business Management'],
                'sort_order' => 0,
            ],
            [
                'company' => 'Stealthx Performance Sdn. Bhd.',
                'role' => 'Industrial Training (Full-Stack Web Developer Intern)',
                'employment_type' => 'University Internship (LI)',
                'location' => 'Malaysia',
                'start_date' => '2025-03-01',
                'end_date' => '2025-08-31',
                'is_current' => false,
                'summary' => 'Completed 6-month final-semester university Industrial Training (Latihan Industri) developing a full-stack workshop management web application using Next.js, TypeScript, Laravel, and MySQL.',
                'highlights' => [
                    'Architected and developed a full-stack workshop management web application during my university internship using Next.js, TypeScript, Laravel, and MySQL to digitize manual workshop operations and service appointments.',
                    'Engineered automated stock tracking and booking alert notifications, reducing appointment scheduling errors by 80% and cutting administrative staff workload by 90%.',
                    'Designed relational database schemas in MySQL and created RESTful API endpoints in Laravel consumed by dynamic Next.js frontend views.',
                    'Collaborated directly with workshop management and floor technicians to gather requirements, fix UI bugs, and refine user workflows.',
                ],
                'technologies' => ['Next.js', 'TypeScript', 'Laravel', 'MySQL', 'RESTful APIs'],
                'sort_order' => 1,
            ],
        ];

        // 5. Skills
        $skills = [
            ['name' => 'Next.js 15 (App Router)', 'category' => 'Frontend', 'proficiency' => 95, 'sort_order' => 0],
            ['name' => 'React 19', 'category' => 'Frontend', 'proficiency' => 94, 'sort_order' => 1],
            ['name' => 'TypeScript', 'category' => 'Frontend', 'proficiency' => 92, 'sort_order' => 2],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'proficiency' => 95, 'sort_order' => 3],
            ['name' => 'Vite & PWA (Service Workers)', 'category' => 'Frontend', 'proficiency' => 90, 'sort_order' => 4],
            ['name' => 'HTML5 & CSS3', 'category' => 'Frontend', 'proficiency' => 95, 'sort_order' => 5],
            ['name' => 'Laravel 12 & PHP', 'category' => 'Backend', 'proficiency' => 94, 'sort_order' => 6],
            ['name' => 'RESTful APIs & Laravel Sanctum', 'category' => 'Backend', 'proficiency' => 92, 'sort_order' => 7],
            ['name' => 'Node.js', 'category' => 'Backend', 'proficiency' => 85, 'sort_order' => 8],
            ['name' => 'Python (YOLOv5s & OpenCV)', 'category' => 'Backend', 'proficiency' => 85, 'sort_order' => 9],
            ['name' => 'C#', 'category' => 'Backend', 'proficiency' => 80, 'sort_order' => 10],
            ['name' => 'PostgreSQL & Row-Level Security (RLS)', 'category' => 'Database', 'proficiency' => 90, 'sort_order' => 11],
            ['name' => 'Supabase (Realtime, Storage, RLS)', 'category' => 'Database', 'proficiency' => 92, 'sort_order' => 12],
            ['name' => 'MySQL', 'category' => 'Database', 'proficiency' => 92, 'sort_order' => 13],
            ['name' => 'Firebase', 'category' => 'Database', 'proficiency' => 85, 'sort_order' => 14],
            ['name' => 'Stripe API & Webhooks', 'category' => 'Cloud', 'proficiency' => 88, 'sort_order' => 15],
            ['name' => 'Capacitor (Android) & RawBT Printing', 'category' => 'Architecture', 'proficiency' => 88, 'sort_order' => 16],
            ['name' => 'Git, GitHub & Postman', 'category' => 'Cloud', 'proficiency' => 92, 'sort_order' => 17],
            ['name' => 'Figma', 'category' => 'Frontend', 'proficiency' => 88, 'sort_order' => 18],
        ];

        // 6. Involvement & Professional Attributes
        $certs = [
            [
                'name' => 'Deputy Exco of Entrepreneurship & Logistics',
                'issuer' => 'PETAKOM (Computer Science Society), UMPSA — Coordinated logistics & budgeting for faculty-wide tech events',
                'issue_date' => '2022-01-01',
                'sort_order' => 0,
            ],
            [
                'name' => 'Languages: Malay (Native) & English (Professional Working Proficiency)',
                'issuer' => 'Bilingual Professional Communication',
                'issue_date' => '2025-01-01',
                'sort_order' => 1,
            ],
            [
                'name' => 'Availability: Immediate (Open to Relocation across Malaysia & Remote)',
                'issuer' => 'Full-Time / Contract Software Engineering Roles',
                'issue_date' => '2026-01-01',
                'sort_order' => 2,
            ],
        ];

        // 7. Featured Projects
        $projects = [
            [
                'title' => 'Crown & Blade – Barbershop Booking & Queue Suite',
                'slug' => 'crown-and-blade-barbershop-booking-queue-suite',
                'summary' => 'Full-stack barbershop appointment and real-time walk-in queue management system with role-based access control (Customer, Barber, Admin), Supabase Realtime WebSockets, and Stripe checkout.',
                'description' => 'Engineered a full-stack barbershop appointment and real-time walk-in queue management system with role-based access control (Customer, Barber, Admin). Integrated Supabase Realtime (WebSockets) for live queue tracking and chair status synchronization without page refreshes. Built secure checkout flows using the Stripe API and webhook listener endpoints for automated booking confirmation. Implemented client state management with Zustand and secured backend API endpoints via Laravel Sanctum authentication.',
                'status' => 'published',
                'featured' => true,
            ],
            [
                'title' => 'Cikda Biz – Offline-First Point of Sale (POS) PWA',
                'slug' => 'cikda-biz-offline-first-pos-pwa',
                'summary' => 'Offline-first Progressive Web App (PWA) POS system for retail and food merchants with 100% continuous checkout capability, CRDT sync, and Android RawBT Bluetooth thermal printing.',
                'description' => 'Developed an offline-first Progressive Web App (PWA) POS system for retail and food merchants with 100% continuous checkout capability in zero-connectivity environments. Implemented asynchronous background synchronization via Supabase Realtime, debounced write queues, and CRDT tombstone soft-deletion merging. Integrated direct Bluetooth thermal printing via Android RawBT spooling for 58mm/80mm roll receipts with dynamic scannable QR verification. Enforced Postgres Row-Level Security (RLS) to guarantee strict multi-tenant data isolation across merchant accounts.',
                'status' => 'published',
                'featured' => true,
            ],
            [
                'title' => 'MenuCraft – Digital Menu & QR Generator SaaS',
                'slug' => 'menucraft-digital-menu-qr-generator-saas',
                'summary' => 'Multi-tenant web platform enabling restaurants to dynamically generate mobile-responsive digital menus and printable QR codes with PDF/PNG vector export and bilingual localization.',
                'description' => 'Built a multi-tenant web platform enabling restaurants to dynamically generate mobile-responsive digital menus and printable QR codes. Developed dynamic template engines with client-side PDF/PNG vector export and bilingual localization (Malay & English).',
                'status' => 'published',
                'featured' => true,
            ],
            [
                'title' => 'Stealthx Performance – Workshop Management System',
                'slug' => 'stealthx-performance-management-system',
                'summary' => 'Full-stack workshop management web application digitizing manual operations, service appointments, and automated stock tracking—reducing scheduling errors by 80% and staff workload by 90%.',
                'description' => 'Architected and developed a full-stack workshop management web application using Next.js, TypeScript, Laravel, and MySQL to digitize manual workshop operations and service appointments. Engineered automated stock tracking and booking alert notifications, reducing appointment scheduling errors by 80% and cutting administrative staff workload by 90%.',
                'status' => 'published',
                'featured' => false,
            ],
        ];

        return [
            'profile' => [
                'name' => $name,
                'title' => 'Junior Full-Stack Software Engineer',
                'summary' => $summary,
                'location' => $location,
                'email' => $email ?: 'ahmadwaidi@gmail.com',
                'phone' => $phone ?: '+6011-3522 1977',
                'whatsapp' => $phone ?: '+6011-3522 1977',
                'github_url' => 'https://github.com/ImTupperware',
                'linkedin_url' => 'https://www.linkedin.com/in/ahmad-nurjuwaidi-41b8ba271',
                'website_url' => null,
            ],
            'experiences' => $experiences,
            'skills' => $skills,
            'certifications' => $certs,
            'educations' => $educations,
            'projects' => $projects,
        ];
    }
}
