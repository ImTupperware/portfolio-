<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'summary',
        'description',
        'thumbnail_url',
        'live_url',
        'app_url',
        'github_url',
        'featured',
        'status',
        'sort_order',
        'views_count',
    ];

    protected function casts(): array
    {
        return [
            'featured' => 'boolean',
            'sort_order' => 'integer',
            'views_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }

    /**
     * Resolve route binding by numeric ID or URL slug for resilience against database reseeds.
     */
    public function resolveRouteBinding($value, $field = null)
    {
        if (is_numeric($value)) {
            $item = $this->where('id', $value)->first();
            if ($item) {
                return $item;
            }
        }

        return $this->where('slug', $value)->first()
            ?? abort(404, 'The requested resource was not found.');
    }
}

