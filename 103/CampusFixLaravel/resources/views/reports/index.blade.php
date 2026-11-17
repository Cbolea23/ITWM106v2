@extends('layouts.app')

@section('title', 'Dashboard — CampusFix')

@section('content')
    <section class="kpi-grid">
        <div class="kpi-card">
            <div class="kpi-value">{{ $stats['total'] }}</div>
            <div class="kpi-label">Total Reports</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">{{ $stats['critical_open'] }}</div>
            <div class="kpi-label">Urgent Open (High / Critical)</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">{{ $stats['in_progress'] }}</div>
            <div class="kpi-label">In Progress</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">{{ $stats['resolution_rate'] }}%</div>
            <div class="kpi-label">Resolution Rate ({{ $stats['resolved'] }}/{{ $stats['total'] }})</div>
        </div>
    </section>

    <section class="card">
        <form method="GET" action="{{ route('reports.index') }}" class="filter-bar">
            <input
                type="text"
                name="search"
                value="{{ $filters['search'] ?? '' }}"
                placeholder="Search title, location, reporter, or description..."
            >

            <select name="status">
                <option value="All">All Statuses</option>
                @foreach ($statuses as $status)
                    <option value="{{ $status }}" @selected(($filters['status'] ?? '') === $status)>
                        {{ $status }}
                    </option>
                @endforeach
            </select>

            <select name="severity">
                <option value="All">All Severities</option>
                @foreach ($severities as $severity)
                    <option value="{{ $severity }}" @selected(($filters['severity'] ?? '') === $severity)>
                        {{ $severity }}
                    </option>
                @endforeach
            </select>

            <select name="category">
                <option value="All">All Categories</option>
                @foreach ($categories as $category)
                    <option value="{{ $category }}" @selected(($filters['category'] ?? '') === $category)>
                        {{ $category }}
                    </option>
                @endforeach
            </select>

            <button type="submit" class="btn btn-primary">Filter</button>
        </form>
    </section>

    @forelse ($reports as $report)
        <article class="issue-card severity-{{ $report->severity }}">
            <div class="issue-top">
                <a href="{{ route('reports.show', $report) }}" class="issue-title">
                    #{{ $report->id }} — {{ $report->title }}
                </a>
                <div class="badges">
                    <span class="badge badge-{{ $report->severity }}">{{ $report->severity }}</span>
                    <span class="badge badge-{{ str_replace(' ', '', $report->status) }}">{{ $report->status }}</span>
                </div>
            </div>

            <div class="issue-meta">
                <strong>Location:</strong> {{ $report->location }} &bull;
                <strong>Category:</strong> {{ $report->category }} &bull;
                <strong>Reporter:</strong> {{ $report->reporter_name }}
            </div>

            <p>{{ \Illuminate\Support\Str::limit($report->description, 150) }}</p>

            <div class="issue-actions">
                <form method="POST" action="{{ route('reports.upvote', $report) }}" class="inline-form">
                    @csrf
                    <button type="submit" class="btn btn-outline">▲ Confirm ({{ $report->upvotes }})</button>
                </form>

                @if ($report->nextStatus())
                    <form method="POST" action="{{ route('reports.advance-status', $report) }}" class="inline-form">
                        @csrf
                        @method('PATCH')
                        <button type="submit" class="btn btn-primary">
                            Mark {{ $report->nextStatus() }}
                        </button>
                    </form>
                @endif

                <a href="{{ route('reports.show', $report) }}" class="btn btn-secondary">View</a>
                <a href="{{ route('reports.edit', $report) }}" class="btn btn-outline">Edit</a>

                <form
                    method="POST"
                    action="{{ route('reports.destroy', $report) }}"
                    class="inline-form"
                    onsubmit="return confirm('Delete report #{{ $report->id }} ({{ addslashes($report->title) }})?');"
                >
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger">Delete</button>
                </form>
            </div>
        </article>
    @empty
        <div class="card">
            <h3>No facility reports found</h3>
            <p>Try clearing your filters or submit a new issue report.</p>
        </div>
    @endforelse
@endsection
