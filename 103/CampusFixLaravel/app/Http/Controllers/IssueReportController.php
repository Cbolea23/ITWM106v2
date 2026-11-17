<?php

namespace App\Http\Controllers;

use App\Models\IssueReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class IssueReportController extends Controller
{
    /**
     * READ: Display searchable, filterable, priority-sorted issue dashboard.
     */
    public function index(Request $request): View
    {
        $filters = $request->only(['search', 'status', 'severity', 'category']);

        $reports = IssueReport::query()
            ->filter($filters)
            ->orderByPriority()
            ->get();

        $allReports = IssueReport::all();
        $totalCount = $allReports->count();
        $resolvedCount = $allReports->where('status', 'Resolved')->count();

        $stats = [
            'total' => $totalCount,
            'reported' => $allReports->where('status', 'Reported')->count(),
            'in_progress' => $allReports->where('status', 'In Progress')->count(),
            'resolved' => $resolvedCount,
            'critical_open' => $allReports
                ->where('status', '!=', 'Resolved')
                ->whereIn('severity', ['Critical', 'High'])
                ->count(),
            'resolution_rate' => $totalCount > 0
                ? (int) round(($resolvedCount / $totalCount) * 100)
                : 0,
        ];

        return view('reports.index', [
            'reports' => $reports,
            'stats' => $stats,
            'filters' => $filters,
            'categories' => IssueReport::CATEGORIES,
            'severities' => IssueReport::SEVERITIES,
            'statuses' => IssueReport::STATUSES,
        ]);
    }

    /**
     * CREATE (Form): Show the form to submit a new facility issue report.
     */
    public function create(): View
    {
        return view('reports.create', [
            'categories' => IssueReport::CATEGORIES,
            'severities' => IssueReport::SEVERITIES,
        ]);
    }

    /**
     * CREATE (Store): Validate and insert a new issue report into MySQL.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'location' => ['required', 'string', 'max:120'],
            'category' => ['required', Rule::in(IssueReport::CATEGORIES)],
            'severity' => ['required', Rule::in(IssueReport::SEVERITIES)],
            'reporter_name' => ['required', 'string', 'max:80'],
            'description' => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        $report = IssueReport::create([
            ...$validated,
            'status' => 'Reported',
            'upvotes' => 1,
        ]);

        return redirect()
            ->route('reports.show', $report)
            ->with('success', "Issue \"{$report->title}\" reported successfully!");
    }

    /**
     * READ (Single): Display full details of a specific facility issue.
     */
    public function show(IssueReport $report): View
    {
        return view('reports.show', [
            'report' => $report,
        ]);
    }

    /**
     * UPDATE (Form): Show the edit form for an existing issue report.
     */
    public function edit(IssueReport $report): View
    {
        return view('reports.edit', [
            'report' => $report,
            'categories' => IssueReport::CATEGORIES,
            'severities' => IssueReport::SEVERITIES,
            'statuses' => IssueReport::STATUSES,
        ]);
    }

    /**
     * UPDATE (Save): Validate and update the issue report in MySQL.
     */
    public function update(Request $request, IssueReport $report): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'location' => ['required', 'string', 'max:120'],
            'category' => ['required', Rule::in(IssueReport::CATEGORIES)],
            'severity' => ['required', Rule::in(IssueReport::SEVERITIES)],
            'status' => ['required', Rule::in(IssueReport::STATUSES)],
            'reporter_name' => ['required', 'string', 'max:80'],
            'description' => ['required', 'string', 'min:10', 'max:1000'],
            'resolution_notes' => ['nullable', 'string', 'max:500'],
        ]);

        $resolvedAt = $validated['status'] === 'Resolved'
            ? ($report->resolved_at ?? now())
            : null;

        $report->update([
            ...$validated,
            'resolved_at' => $resolvedAt,
        ]);

        return redirect()
            ->route('reports.show', $report)
            ->with('success', "Issue \"{$report->title}\" updated successfully!");
    }

    /**
     * UPDATE (Workflow): Advance status Reported -> In Progress -> Resolved.
     */
    public function advanceStatus(IssueReport $report): RedirectResponse
    {
        $next = $report->nextStatus();
        if ($next === null) {
            return redirect()
                ->back()
                ->with('info', 'This issue is already marked as Resolved.');
        }

        $report->update([
            'status' => $next,
            'resolved_at' => $next === 'Resolved' ? now() : null,
        ]);

        return redirect()
            ->back()
            ->with('success', "Status updated to \"{$next}\" for \"{$report->title}\".");
    }

    /**
     * UPDATE (Upvote): Increment community confirmation upvote count.
     */
    public function upvote(IssueReport $report): RedirectResponse
    {
        $report->increment('upvotes');

        return redirect()
            ->back()
            ->with('success', "Confirmed \"{$report->title}\" ({$report->upvotes} upvotes).");
    }

    /**
     * DELETE: Remove an issue report from MySQL.
     */
    public function destroy(IssueReport $report): RedirectResponse
    {
        $title = $report->title;
        $report->delete();

        return redirect()
            ->route('reports.index')
            ->with('success', "Deleted issue \"{$title}\" from database.");
    }
}
