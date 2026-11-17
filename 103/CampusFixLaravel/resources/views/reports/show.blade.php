@extends('layouts.app')

@section('title', $report->title . ' — CampusFix')

@section('content')
    <div class="card">
        <div class="issue-top">
            <div>
                <h2>#{{ $report->id }} — {{ $report->title }}</h2>
                <p class="issue-meta">
                    Reported by <strong>{{ $report->reporter_name }}</strong> &bull;
                    Location: <strong>{{ $report->location }}</strong> &bull;
                    Category: <strong>{{ $report->category }}</strong>
                </p>
            </div>
            <div class="badges">
                <span class="badge badge-{{ $report->severity }}">{{ $report->severity }}</span>
                <span class="badge badge-{{ str_replace(' ', '', $report->status) }}">{{ $report->status }}</span>
            </div>
        </div>

        <div class="form-group">
            <label>Issue Description</label>
            <p>{{ $report->description }}</p>
        </div>

        @if ($report->resolution_notes)
            <div class="form-group">
                <label>Resolution / Maintenance Notes</label>
                <p>{{ $report->resolution_notes }}</p>
            </div>
        @endif

        <p class="issue-meta">
            Community Confirmations: <strong>{{ $report->upvotes }}</strong> &bull;
            Created: {{ $report->created_at?->format('M d, Y h:i A') }}
            @if ($report->resolved_at)
                &bull; Resolved: {{ $report->resolved_at->format('M d, Y h:i A') }}
            @endif
        </p>

        <div class="issue-actions">
            <a href="{{ route('reports.index') }}" class="btn btn-secondary">← Back to Dashboard</a>
            <a href="{{ route('reports.edit', $report) }}" class="btn btn-outline">Edit Report</a>

            @if ($report->nextStatus())
                <form method="POST" action="{{ route('reports.advance-status', $report) }}" class="inline-form">
                    @csrf
                    @method('PATCH')
                    <button type="submit" class="btn btn-primary">Mark {{ $report->nextStatus() }}</button>
                </form>
            @endif

            <form
                method="POST"
                action="{{ route('reports.destroy', $report) }}"
                class="inline-form"
                onsubmit="return confirm('Permanently delete this issue report?');"
            >
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-danger">Delete Report</button>
            </form>
        </div>
    </div>
@endsection
