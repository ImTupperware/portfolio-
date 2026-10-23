<?php

namespace App\Domains\Inquiry\Actions;

use App\Models\ContactInquiry;
use Illuminate\Support\Facades\DB;

class SubmitInquiryAction
{
    public function execute(array $validatedData, ?string $ipAddress): ContactInquiry
    {
        return DB::transaction(function () use ($validatedData, $ipAddress) {
            return ContactInquiry::create([
                'name' => htmlspecialchars(strip_tags($validatedData['name']), ENT_QUOTES, 'UTF-8'),
                'email' => filter_var($validatedData['email'], FILTER_SANITIZE_EMAIL),
                'subject' => htmlspecialchars(strip_tags($validatedData['subject']), ENT_QUOTES, 'UTF-8'),
                'message' => htmlspecialchars(strip_tags($validatedData['message']), ENT_QUOTES, 'UTF-8'),
                'ip_address' => $ipAddress,
                'status' => 'unread',
            ]);
        });
    }
}
