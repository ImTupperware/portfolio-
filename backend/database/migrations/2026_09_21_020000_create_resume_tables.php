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
        Schema::create('work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('company', 150);
            $table->string('role', 150);
            $table->string('employment_type', 50)->default('Full-time');
            $table->string('location', 100)->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(false)->index();
            $table->text('summary');
            $table->json('highlights'); // Array of impact/achievement bullet points
            $table->json('technologies'); // Array of technology/tool tags
            $table->integer('sort_order')->default(0)->index();
            $table->timestamps();

            // Explicit Composite B-Tree Indexes
            $table->index(['user_id', 'is_current', 'sort_order'], 'idx_exp_user_current_sort');
            $table->index(['user_id', 'start_date'], 'idx_exp_user_start_date');
        });

        Schema::create('certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name', 200);
            $table->string('issuer', 150)->index();
            $table->date('issue_date');
            $table->date('expiry_date')->nullable();
            $table->string('credential_id', 150)->nullable();
            $table->string('credential_url', 1024)->nullable();
            $table->integer('sort_order')->default(0)->index();
            $table->timestamps();

            $table->index(['user_id', 'sort_order'], 'idx_cert_user_sort');
        });

        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('institution', 200);
            $table->string('degree', 150);
            $table->string('field_of_study', 150);
            $table->year('start_year');
            $table->year('end_year')->nullable();
            $table->string('grade', 50)->nullable();
            $table->integer('sort_order')->default(0)->index();
            $table->timestamps();

            $table->index(['user_id', 'sort_order'], 'idx_edu_user_sort');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educations');
        Schema::dropIfExists('certifications');
        Schema::dropIfExists('work_experiences');
    }
};
