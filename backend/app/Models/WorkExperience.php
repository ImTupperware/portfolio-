<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkExperience extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company',
        'role',
        'employment_type',
        'location',
        'start_date',
        'end_date',
        'is_current',
        'summary',
        'highlights',
        'technologies',
        'sort_order',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'is_current' => 'boolean',
            'is_visible' => 'boolean',
            'highlights' => 'array',
            'technologies' => 'array',
            'start_date' => 'date',
            'end_date' => 'date',
            'sort_order' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
