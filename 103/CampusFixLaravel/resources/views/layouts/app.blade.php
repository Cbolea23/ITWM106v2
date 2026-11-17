<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'CampusFix — Smart Campus Issue Tracker')</title>
    <link rel="stylesheet" href="{{ asset('css/campusfix.css') }}">
</head>
<body>
    <header class="navbar">
        <div class="nav-inner">
            <a href="{{ route('reports.index') }}" class="brand">
                <h1>CampusFix</h1>
                <p>Laravel MVC + MySQL Facility Issue &amp; Resolution Tracker</p>
            </a>
            <a href="{{ route('reports.create') }}" class="btn btn-primary">+ Report Issue</a>
        </div>
    </header>

    <main class="container">
        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @if (session('info'))
            <div class="alert alert-success">{{ session('info') }}</div>
        @endif

        @if ($errors->any())
            <div class="alert alert-error">
                <strong>Please fix the following errors:</strong>
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @yield('content')
    </main>
</body>
</html>
