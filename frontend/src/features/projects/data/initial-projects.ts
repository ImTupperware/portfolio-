import { PaginatedProjectsResponse } from "../schemas/project.schema";

export const INITIAL_PROJECTS: PaginatedProjectsResponse = {
  data: [
    {
      id: 1044635,
      user_id: 1,
      title: "Cikda Biz – Offline-First Point of Sale (POS) PWA",
      slug: "cikda-biz-offline-first-pos-pwa",
      summary:
        "Built to digitize and help manage my mother's business—an offline-first Progressive Web App (PWA) POS system with 100% continuous checkout capability, Supabase Realtime sync, and Android RawBT Bluetooth thermal receipt printing.",
      description:
        "Designed and developed an offline-first Progressive Web App (PWA) Point of Sale (POS) system specifically to modernize and manage my mother's retail/food business operations (Cikda). Delivers 100% continuous checkout capability in zero-connectivity environments, asynchronous background synchronization via Supabase Realtime with debounced write queues and CRDT soft-deletion merging, direct Bluetooth thermal receipt printing (58mm/80mm) via Android RawBT with dynamic QR verification, and Postgres Row-Level Security (RLS).",
      thumbnail_url:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      live_url: "https://cikdabiz.com",
      app_url: "https://app.cikdabiz.com",
      github_url: "https://github.com/ImTupperware",
      featured: true,
      status: "published",
      sort_order: 1,
      views_count: 0,
      tags: [
        "React 19",
        "Vite",
        "Supabase",
        "Capacitor (Android)",
        "PWA",
        "PostgreSQL RLS",
        "RawBT Bluetooth",
      ],
      created_at: "2026-10-24T19:16:14.000000Z",
      updated_at: "2026-10-24T19:16:14.000000Z",
    },
    {
      id: 1044636,
      user_id: 1,
      title: "Crown & Blade – Barbershop Booking & Queue Suite",
      slug: "crown-and-blade-barbershop-booking-queue-suite",
      summary:
        "Full-stack barbershop appointment and real-time walk-in queue management system with role-based access control (Customer, Barber, Admin), Supabase Realtime WebSockets, and Stripe checkout.",
      description:
        "Engineered a full-stack barbershop appointment and real-time walk-in queue management system with role-based access control (Customer, Barber, Admin). Integrated Supabase Realtime (WebSockets) for live queue tracking and chair status synchronization without page refreshes. Built secure checkout flows using the Stripe API and webhook listener endpoints for automated booking confirmation. Implemented client state management with Zustand and secured backend API endpoints via Laravel Sanctum authentication.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
      live_url: "https://crownandblade.com",
      app_url: "https://app.crownandblade.com",
      github_url: "https://github.com/ImTupperware",
      featured: true,
      status: "published",
      sort_order: 2,
      views_count: 0,
      tags: [
        "Next.js 15",
        "Laravel 12",
        "Supabase Realtime",
        "Stripe API",
        "Zustand",
        "Laravel Sanctum",
      ],
      created_at: "2026-10-24T19:16:14.000000Z",
      updated_at: "2026-10-24T19:16:14.000000Z",
    },
    {
      id: 1044637,
      user_id: 1,
      title: "MenuCraft – Digital Menu & QR Generator SaaS",
      slug: "menucraft-digital-menu-qr-generator-saas",
      summary:
        "Multi-tenant web platform enabling restaurants to dynamically generate mobile-responsive digital menus and printable QR codes with PDF/PNG vector export and bilingual localization.",
      description:
        "Built a multi-tenant web platform enabling restaurants to dynamically generate mobile-responsive digital menus and printable QR codes. Developed dynamic template engines with client-side PDF/PNG vector export and bilingual localization (Malay & English).",
      thumbnail_url:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      live_url: null,
      app_url: null,
      github_url: "https://github.com/ImTupperware",
      featured: true,
      status: "published",
      sort_order: 3,
      views_count: 0,
      tags: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Multi-Tenant SaaS",
        "PDF/PNG Export",
      ],
      created_at: "2026-10-24T19:16:14.000000Z",
      updated_at: "2026-10-24T19:16:14.000000Z",
    },
    {
      id: 1044638,
      user_id: 1,
      title: "Stealthx Performance – Workshop Management System",
      slug: "stealthx-performance-management-system",
      summary:
        "Full-stack workshop management web application digitizing manual operations, service appointments, and automated stock tracking—reducing scheduling errors by 80% and staff workload by 90%.",
      description:
        "Architected and developed a full-stack workshop management web application using Next.js, TypeScript, Laravel, and MySQL to digitize manual workshop operations and service appointments. Engineered automated stock tracking and booking alert notifications, reducing appointment scheduling errors by 80% and cutting administrative staff workload by 90%.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      live_url: null,
      app_url: null,
      github_url: "https://github.com/ImTupperware",
      featured: false,
      status: "published",
      sort_order: 4,
      views_count: 0,
      tags: ["Next.js", "TypeScript", "Laravel", "MySQL", "RESTful APIs"],
      created_at: "2026-10-24T19:16:14.000000Z",
      updated_at: "2026-10-24T19:16:14.000000Z",
    },
    {
      id: 1044639,
      user_id: 1,
      title: "Traffic Congestion Detection & Hotspot Analysis (FYP)",
      slug: "traffic-hotspot-analysis-yolov5s",
      summary:
        "Computer vision and deep learning pipeline to detect and analyze traffic congestion and hotspots from video streams using Python, YOLOv5s, and OpenCV.",
      description:
        "Final Year Project at UMPSA implementing real-time vehicle detection, traffic congestion analysis, and hotspot identification from CCTV footage using Python, YOLOv5s, and OpenCV.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
      live_url: null,
      app_url: null,
      github_url: "https://github.com/ImTupperware",
      featured: false,
      status: "published",
      sort_order: 5,
      views_count: 0,
      tags: ["Python", "YOLOv5s", "OpenCV", "Deep Learning"],
      created_at: "2026-10-24T19:16:15.000000Z",
      updated_at: "2026-10-24T19:16:15.000000Z",
    },
  ],
  links: {
    first: "/api/v1/projects?page=1",
    last: "/api/v1/projects?page=1",
    prev: null,
    next: null,
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    per_page: 12,
    to: 5,
    total: 5,
  },
};
