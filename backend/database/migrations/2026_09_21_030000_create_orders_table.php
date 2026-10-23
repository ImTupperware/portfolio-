<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('order_number', 50)->unique();
            $table->string('customer_name', 150)->index();
            $table->string('customer_email', 255)->index();
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending')->index();
            $table->decimal('total_amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->integer('items_count')->default(1);
            $table->string('payment_method', 50)->default('Stripe');
            $table->timestamps();

            // Explicit B-Tree composite indexes
            $table->index(['status', 'created_at'], 'idx_orders_status_created');
            $table->index(['customer_name', 'status'], 'idx_orders_customer_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
