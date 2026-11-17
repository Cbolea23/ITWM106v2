@extends('layouts.app')

@section('title', 'Edit Issue #' . $report->id . ' — CampusFix')

@section('content')
    <div class="card">
        <h2>Edit Issue Report #{{ $report->id }}</h2>
        <p class="issue-meta">Update issue details, workflow status, or maintenance resolution notes.</p>

        <form method="POST" action="{{ route('reports.update', $report) }}">
            @csrf
            @method('PUT')

            <div class="form-grid">
                <div class="form-group">
                    <label for="title">Issue Title *</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value="{{ old('title', $report->title) }}"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="location">Location *</label>
                    <input
                        id="location"
                        type="text"
                        name="location"
                        value="{{ old('location', $report->location) }}"
                        required
                    >
                </div>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label for="category">Category *</label>
                    <select id="category" name="category" required>
                        @foreach ($categories as $category)
                            <option value="{{ $category }}" @selected(old('category', $report->category) === $category)>
                                {{ $category }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label for="severity">Severity Level *</label>
                    <select id="severity" name="severity" required>
                        @foreach ($severities as $severity)
                            <option value="{{ $severity }}" @selected(old('severity', $report->severity) === $severity)>
                                {{ $severity }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label for="status">Workflow Status *</label>
                    <select id="status" name="status" required>
                        @foreach ($statuses as $status)
                            <option value="{{ $status }}" @selected(old('status', $report->status) === $status)>
                                {{ $status }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label for="reporter_name">Reporter Name *</label>
                    <input
                        id="reporter_name"
                        type="text"
                        name="reporter_name"
                        value="{{ old('reporter_name', $report->reporter_name) }}"
                        required
                    >
                </div>
            </div>

            <div class="form-group">
                <label for="description">Detailed Description *</label>
                <textarea id="description" name="description" rows="4" required>{{ old('description', $report->description) }}</textarea>
            </div>

            <div class="form-group">
                <label for="resolution_notes">Resolution / Maintenance Notes (Optional)</label>
                <textarea
                    id="resolution_notes"
                    name="resolution_notes"
                    rows="3"
                    placeholder="Technician notes or action taken..."
                >{{ old('resolution_notes', $report->resolution_notes) }}</textarea>
            </div>

            <div class="issue-actions">
                <a href="{{ route('reports.show', $report) }}" class="btn btn-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
        </form>
    </div>
@endsection
