<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->string('summary', 500);
            $table->longText('description');
            $table->string('thumbnail_url', 1024)->nullable();
            $table->string('live_url', 1024)->nullable();
            $table->string('github_url', 1024)->nullable();
            $table->boolean('featured')->default(false)->index();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft')->index();
            $table->integer('sort_order')->default(0)->index();
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamps();

            // Explicit Composite B-Tree Indexes for High-Performance Queries & Anti-IDOR Scopes
            $table->index(['user_id', 'status'], 'idx_projects_user_status');
            $table->index(['status', 'featured', 'sort_order'], 'idx_projects_status_featured_sort');
            $table->index(['status', 'created_at'], 'idx_projects_status_created');
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('slug', 100)->unique();
            $table->timestamps();
        });

        Schema::create('project_tag', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained('tags')->cascadeOnDelete();
            $table->primary(['project_id', 'tag_id']);
            $table->index('tag_id', 'idx_project_tag_tag_id');
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('category', 50)->index();
            $table->unsignedTinyInteger('proficiency')->default(80);
            $table->string('icon', 255)->nullable();
            $table->integer('sort_order')->default(0)->index();
            $table->timestamps();

            $table->index(['user_id', 'category'], 'idx_skills_user_category');
        });

        Schema::create('contact_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('email', 255)->index();
            $table->string('subject', 255);
            $table->text('message');
            $table->string('ip_address', 45)->nullable();
            $table->enum('status', ['unread', 'read', 'archived', 'replied'])->default('unread')->index();
            $table->timestamps();

            $table->index('created_at', 'idx_contact_inquiries_created');
            $table->index(['status', 'created_at'], 'idx_contact_status_created');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_inquiries');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('project_tag');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('projects');
    }
};
