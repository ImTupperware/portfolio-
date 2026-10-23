<?php

namespace App\Http\Resources\Api\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'status' => $this->status,
            'total_amount' => (float)$this->total_amount,
            'currency' => $this->currency,
            'items_count' => (int)$this->items_count,
            'payment_method' => $this->payment_method,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
