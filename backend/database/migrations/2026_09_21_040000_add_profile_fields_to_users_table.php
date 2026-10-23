<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('title')->nullable()->after('name');
            $table->text('summary')->nullable()->after('title');
            $table->string('location')->nullable()->after('summary');
            $table->string('availability')->nullable()->after('location');
            $table->string('phone')->nullable()->after('availability');
            $table->string('github_url')->nullable()->after('phone');
            $table->string('linkedin_url')->nullable()->after('github_url');
            $table->string('website_url')->nullable()->after('linkedin_url');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'title',
                'summary',
                'location',
                'availability',
                'phone',
                'github_url',
                'linkedin_url',
                'website_url',
            ]);
        });
    }
};
