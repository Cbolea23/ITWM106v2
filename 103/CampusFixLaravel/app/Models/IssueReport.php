<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IssueReport extends Model
{
    use HasFactory;

    protected $table = 'issue_reports';

    public const CATEGORIES = [
        'Electrical & Lighting',
        'Plumbing & Restroom',
        'Air Conditioning',
        'Network & Wi-Fi',
        'Classroom Equipment',
        'Safety Hazard',
    ];

    public const SEVERITIES = [
        'Low',
        'Medium',
        'High',
        'Critical',
    ];

    public const STATUSES = [
        'Reported',
        'In Progress',
        'Resolved',
    ];

    protected $fillable = [
        'title',
        'location',
        'category',
        'severity',
        'status',
        'reporter_name',
        'description',
        'upvotes',
        'resolution_notes',
        'resolved_at',
    ];

    protected $casts = [
        'upvotes' => 'integer',
        'resolved_at' => 'datetime',
    ];

    /**
     * Filter reports by search term, status, severity, or category.
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        if (!empty($filters['search'])) {
            $term = '%' . trim($filters['search']) . '%';
            $query->where(function (Builder $q) use ($term) {
                $q->where('title', 'like', $term)
                    ->orWhere('location', 'like', $term)
                    ->orWhere('description', 'like', $term)
                    ->orWhere('reporter_name', 'like', $term);
            });
        }

        if (!empty($filters['status']) && $filters['status'] !== 'All') {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['severity']) && $filters['severity'] !== 'All') {
            $query->where('severity', $filters['severity']);
        }

        if (!empty($filters['category']) && $filters['category'] !== 'All') {
            $query->where('category', $filters['category']);
        }

        return $query;
    }

    /**
     * Order unresolved urgent issues first, then by community upvotes.
     */
    public function scopeOrderByPriority(Builder $query): Builder
    {
        return $query->orderByRaw("CASE status
                WHEN 'Reported' THEN 1
                WHEN 'In Progress' THEN 2
                WHEN 'Resolved' THEN 3
                ELSE 4
            END")
            ->orderByRaw("CASE severity
                WHEN 'Critical' THEN 1
                WHEN 'High' THEN 2
                WHEN 'Medium' THEN 3
                WHEN 'Low' THEN 4
                ELSE 5
            END")
            ->orderByDesc('upvotes')
            ->orderByDesc('created_at');
    }

    /**
     * Return the next workflow status for 1-click progression.
     */
    public function nextStatus(): ?string
    {
        return match ($this->status) {
            'Reported' => 'In Progress',
            'In Progress' => 'Resolved',
            default => null,
        };
    }
}
