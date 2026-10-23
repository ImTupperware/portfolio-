<?php

namespace Database\Seeders;

use App\Domains\Project\Actions\CreateProjectAction;
use App\Domains\Project\DTOs\ProjectData;
use App\Models\Certification;
use App\Models\Education;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkExperience;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $profileData = [
            'name' => 'AHMAD NURJUWAIDI BIN CHE ADNAN',
            'title' => 'Software Engineering Fresh Graduate | Freelance Full-Stack Developer',
            'summary' => 'Computer Science (Software Engineering) fresh graduate from Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA, 2025) and Freelance Full-Stack Developer. Completed a 6-month university Industrial Training at Stealthx Performance Sdn. Bhd., and actively helps manage my mother\'s business while developing production-ready systems—including the Cikda Biz Offline-First POS PWA built specifically to digitize her daily business operations, alongside Next.js 15, React 19, Laravel 12, and Supabase web applications.',
            'location' => 'Besut, Terengganu (Open to Relocation & Remote)',
            'availability' => 'Fresh Graduate (2025) & Freelance Full-Stack Developer • Available Immediately',
            'phone' => '+6011-3522 1977',
            'whatsapp' => '+6011-3522 1977',
            'github_url' => 'https://github.com/ImTupperware',
            'linkedin_url' => 'https://www.linkedin.com/in/ahmad-nurjuwaidi-41b8ba271',
            'website_url' => null,
        ];

        $admin = User::where('role', 'admin')->first();
        if (!$admin) {
            $admin = User::create(array_merge($profileData, [
                'email' => 'ahmadwaidi@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]));
        } else {
            $admin->update(array_merge($profileData, [
                'email' => 'ahmadwaidi@gmail.com',
            ]));
        }

        // Clean previous records to populate fresh resume data
        $admin->projects()->delete();
        $admin->skills()->delete();
        $admin->workExperiences()->delete();
        $admin->certifications()->delete();
        $admin->educations()->delete();

        // 1. Featured Projects
        $action = new CreateProjectAction();
        $projects = [
            [
                'title' => 'Cikda Biz – Offline-First Point of Sale (POS) PWA',
                'slug' => 'cikda-biz-offline-first-pos-pwa',
                'summary' => 'Built to digitize and help manage my mother\'s business—an offline-first Progressive Web App (PWA) POS system with 100% continuous checkout capability, Supabase Realtime sync, and Android RawBT Bluetooth thermal receipt printing.',
                'description' => 'Designed and developed an offline-first Progressive Web App (PWA) Point of Sale (POS) system specifically to modernize and manage my mother\'s retail/food business operations (Cikda). Delivers 100% continuous checkout capability in zero-connectivity environments, asynchronous background synchronization via Supabase Realtime with debounced write queues and CRDT soft-deletion merging, direct Bluetooth thermal receipt printing (58mm/80mm) via Android RawBT with dynamic QR verification, and Postgres Row-Level Security (RLS).',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
                'live_url' => 'https://cikdabiz.com',
                'app_url' => 'https://app.cikdabiz.com',
                'github_url' => 'https://github.com/ImTupperware',
                'featured' => true,
                'status' => 'published',
                'sort_order' => 1,
                'tags' => ['React 19', 'Vite', 'Supabase', 'Capacitor (Android)', 'PWA', 'PostgreSQL RLS', 'RawBT Bluetooth'],
            ],
            [
                'title' => 'Crown & Blade – Barbershop Booking & Queue Suite',
                'slug' => 'crown-and-blade-barbershop-booking-queue-suite',
                'summary' => 'Full-stack barbershop appointment and real-time walk-in queue management system with role-based access control (Customer, Barber, Admin), Supabase Realtime WebSockets, and Stripe checkout.',
                'description' => 'Engineered a full-stack barbershop appointment and real-time walk-in queue management system with role-based access control (Customer, Barber, Admin). Integrated Supabase Realtime (WebSockets) for live queue tracking and chair status synchronization without page refreshes. Built secure checkout flows using the Stripe API and webhook listener endpoints for automated booking confirmation. Implemented client state management with Zustand and secured backend API endpoints via Laravel Sanctum authentication.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
                'live_url' => 'https://crownandblade.com',
                'app_url' => 'https://app.crownandblade.com',
                'github_url' => 'https://github.com/ImTupperware',
                'featured' => true,
                'status' => 'published',
                'sort_order' => 2,
                'tags' => ['Next.js 15', 'Laravel 12', 'Supabase Realtime', 'Stripe API', 'Zustand', 'Laravel Sanctum'],
            ],
            [
                'title' => 'MenuCraft – Digital Menu & QR Generator SaaS',
                'slug' => 'menucraft-digital-menu-qr-generator-saas',
                'summary' => 'Multi-tenant web platform enabling restaurants to dynamically generate mobile-responsive digital menus and printable QR codes with PDF/PNG vector export and bilingual localization.',
                'description' => 'Built a multi-tenant web platform enabling restaurants to dynamically generate mobile-responsive digital menus and printable QR codes. Developed dynamic template engines with client-side PDF/PNG vector export and bilingual localization (Malay & English).',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
                'live_url' => null,
                'github_url' => 'https://github.com/ImTupperware',
                'featured' => true,
                'status' => 'published',
                'sort_order' => 3,
                'tags' => ['Next.js', 'TypeScript', 'Tailwind CSS', 'Multi-Tenant SaaS', 'PDF/PNG Export'],
            ],
            [
                'title' => 'Stealthx Performance – Workshop Management System',
                'slug' => 'stealthx-performance-management-system',
                'summary' => 'Full-stack workshop management web application digitizing manual operations, service appointments, and automated stock tracking—reducing scheduling errors by 80% and staff workload by 90%.',
                'description' => 'Architected and developed a full-stack workshop management web application using Next.js, TypeScript, Laravel, and MySQL to digitize manual workshop operations and service appointments. Engineered automated stock tracking and booking alert notifications, reducing appointment scheduling errors by 80% and cutting administrative staff workload by 90%.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
                'live_url' => null,
                'github_url' => 'https://github.com/ImTupperware',
                'featured' => false,
                'status' => 'published',
                'sort_order' => 4,
                'tags' => ['Next.js', 'TypeScript', 'Laravel', 'MySQL', 'RESTful APIs'],
            ],
            [
                'title' => 'Traffic Congestion Detection & Hotspot Analysis (FYP)',
                'slug' => 'traffic-hotspot-analysis-yolov5s',
                'summary' => 'Computer vision and deep learning pipeline to detect and analyze traffic congestion and hotspots from video streams using Python, YOLOv5s, and OpenCV.',
                'description' => 'Final Year Project at UMPSA implementing real-time vehicle detection, traffic congestion analysis, and hotspot identification from CCTV footage using Python, YOLOv5s, and OpenCV.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
                'live_url' => null,
                'github_url' => 'https://github.com/ImTupperware',
                'featured' => false,
                'status' => 'published',
                'sort_order' => 5,
                'tags' => ['Python', 'YOLOv5s', 'OpenCV', 'Deep Learning'],
            ],
        ];

        foreach ($projects as $item) {
            $action->execute($admin, ProjectData::fromArray($item));
        }

        // 2. Technical Skills
        $skills = [
            // Frontend
            ['name' => 'Next.js 15 (App Router)', 'category' => 'Frontend', 'proficiency' => 95, 'sort_order' => 1],
            ['name' => 'React 19', 'category' => 'Frontend', 'proficiency' => 94, 'sort_order' => 2],
            ['name' => 'TypeScript', 'category' => 'Frontend', 'proficiency' => 92, 'sort_order' => 3],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'proficiency' => 95, 'sort_order' => 4],
            ['name' => 'Vite & PWA (Service Workers)', 'category' => 'Frontend', 'proficiency' => 90, 'sort_order' => 5],
            ['name' => 'HTML5 & CSS3', 'category' => 'Frontend', 'proficiency' => 95, 'sort_order' => 6],
            // Backend & APIs
            ['name' => 'Laravel 12 & PHP', 'category' => 'Backend', 'proficiency' => 94, 'sort_order' => 7],
            ['name' => 'RESTful APIs & Laravel Sanctum', 'category' => 'Backend', 'proficiency' => 92, 'sort_order' => 8],
            ['name' => 'Node.js', 'category' => 'Backend', 'proficiency' => 85, 'sort_order' => 9],
            ['name' => 'Python (YOLOv5s & OpenCV)', 'category' => 'Backend', 'proficiency' => 85, 'sort_order' => 10],
            ['name' => 'C#', 'category' => 'Backend', 'proficiency' => 80, 'sort_order' => 11],
            // Databases & Cloud
            ['name' => 'PostgreSQL & Row-Level Security (RLS)', 'category' => 'Database', 'proficiency' => 90, 'sort_order' => 12],
            ['name' => 'Supabase (Realtime, Storage, RLS)', 'category' => 'Database', 'proficiency' => 92, 'sort_order' => 13],
            ['name' => 'MySQL', 'category' => 'Database', 'proficiency' => 92, 'sort_order' => 14],
            ['name' => 'Firebase', 'category' => 'Database', 'proficiency' => 85, 'sort_order' => 15],
            // Tools & Integrations
            ['name' => 'Stripe API & Webhooks', 'category' => 'Cloud', 'proficiency' => 88, 'sort_order' => 16],
            ['name' => 'Capacitor (Android) & RawBT Printing', 'category' => 'Architecture', 'proficiency' => 88, 'sort_order' => 17],
            ['name' => 'Git, GitHub & Postman', 'category' => 'Cloud', 'proficiency' => 92, 'sort_order' => 18],
            ['name' => 'Figma', 'category' => 'Frontend', 'proficiency' => 88, 'sort_order' => 19],
        ];

        foreach ($skills as $skill) {
            Skill::create(array_merge($skill, ['user_id' => $admin->id]));
        }

        // 3. Freelance Full-Stack, Family Business (Cikda Biz) & University Internship
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
                'is_visible' => true,
                'sort_order' => 1,
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
                'is_visible' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($experiences as $exp) {
            WorkExperience::create(array_merge($exp, ['user_id' => $admin->id]));
        }

        // 4. Involvement & Professional Attributes
        $certifications = [
            [
                'name' => 'Deputy Exco of Entrepreneurship & Logistics',
                'issuer' => 'PETAKOM (Computer Science Society), UMPSA (2022)',
                'issue_date' => '2022-01-01',
                'credential_id' => null,
                'credential_url' => null,
                'sort_order' => 1,
            ],
            [
                'name' => 'Languages: Malay (Native) & English (Professional Working Proficiency)',
                'issuer' => 'Bilingual Communication',
                'issue_date' => '2025-01-01',
                'credential_id' => null,
                'credential_url' => null,
                'sort_order' => 2,
            ],
            [
                'name' => 'Fresh Graduate (2025) — Open to Relocation across Malaysia & Remote',
                'issuer' => 'Immediate Availability for Graduate / Entry-Level Software Engineer Roles',
                'issue_date' => '2025-09-01',
                'credential_id' => null,
                'credential_url' => null,
                'sort_order' => 3,
            ],
        ];

        foreach ($certifications as $cert) {
            Certification::create(array_merge($cert, ['user_id' => $admin->id]));
        }

        // 5. Education
        $educations = [
            [
                'institution' => 'Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA)',
                'degree' => 'Bachelor of Science in Computer Science (Software Engineering) with Honours',
                'field_of_study' => 'Software Engineering • DSA, Software Architecture, DBMS, Web Dev, SQA • FYP: Traffic Hotspot Analysis (YOLOv5s, OpenCV)',
                'start_year' => 2021,
                'end_year' => 2025,
                'grade' => 'CGPA: 3.01',
                'sort_order' => 1,
            ],
        ];

        foreach ($educations as $edu) {
            Education::create(array_merge($edu, ['user_id' => $admin->id]));
        }
    }
}
