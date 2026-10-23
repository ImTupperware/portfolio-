<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();
        $statuses = ['completed', 'processing', 'pending', 'cancelled'];
        $customers = [
            ['Alice Johnson', 'alice@enterprise.com'],
            ['Bob Smith', 'bob@cybercorp.io'],
            ['Catherine Miller', 'catherine@fintech.co'],
            ['David Chen', 'david@cloudsecurity.net'],
            ['Elena Rostova', 'elena@defenseops.gov'],
            ['Frank Wright', 'frank@scaleinfra.com'],
            ['Grace Hopper', 'grace@computing.org'],
            ['Hassan Al-Mansoor', 'hassan@gulftech.ae'],
        ];

        // Seed 65 realistic orders
        for ($i = 1; $i <= 65; $i++) {
            $customer = $customers[($i - 1) % count($customers)];
            $status = $statuses[($i - 1) % count($statuses)];
            $amount = round(49.99 + ($i * 17.35) % 1200, 2);
            $items = ($i % 5) + 1;

            Order::updateOrCreate(
                ['order_number' => sprintf('ORD-2026-%04d', 1000 + $i)],
                [
                    'user_id' => $admin?->id,
                    'customer_name' => $customer[0],
                    'customer_email' => $customer[1],
                    'status' => $status,
                    'total_amount' => $amount,
                    'currency' => 'USD',
                    'items_count' => $items,
                    'payment_method' => ($i % 2 === 0) ? 'Stripe Card' : 'Wire Transfer',
                    'created_at' => now()->subDays(65 - $i)->subHours($i % 24),
                ]
            );
        }
    }
}
