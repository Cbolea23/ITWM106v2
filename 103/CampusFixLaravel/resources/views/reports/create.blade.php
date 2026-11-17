@extends('layouts.app')

@section('title', 'Report Facility Issue — CampusFix')

@section('content')
    <div class="card">
        <h2>Report a Facility Issue</h2>
        <p class="issue-meta">Submit a new hazard or maintenance issue to the MySQL database.</p>

        <form method="POST" action="{{ route('reports.store') }}">
            @csrf

            <div class="form-grid">
                <div class="form-group">
                    <label for="title">Issue Title *</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value="{{ old('title') }}"
                        placeholder="e.g., Flickering Light in Room 302"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="location">Location / Building / Room *</label>
                    <input
                        id="location"
                        type="text"
                        name="location"
                        value="{{ old('location') }}"
                        placeholder="e.g., Main Building, 3F Room 302"
                        required
                    >
                </div>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label for="category">Category *</label>
                    <select id="category" name="category" required>
                        @foreach ($categories as $category)
                            <option value="{{ $category }}" @selected(old('category') === $category)>
                                {{ $category }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label for="severity">Severity Level *</label>
                    <select id="severity" name="severity" required>
                        @foreach ($severities as $severity)
                            <option value="{{ $severity }}" @selected(old('severity', 'Medium') === $severity)>
                                {{ $severity }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="reporter_name">Reporter Name *</label>
                <input
                    id="reporter_name"
                    type="text"
                    name="reporter_name"
                    value="{{ old('reporter_name') }}"
                    placeholder="e.g., Wayne Nagares"
                    required
                >
            </div>

            <div class="form-group">
                <label for="description">Detailed Description *</label>
                <textarea
                    id="description"
                    name="description"
                    rows="4"
                    placeholder="Describe the exact problem and any safety impact (min. 10 characters)..."
                    required
                >{{ old('description') }}</textarea>
            </div>

            <div class="issue-actions">
                <a href="{{ route('reports.index') }}" class="btn btn-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary">Submit Report</button>
            </div>
        </form>
    </div>
@endsection
