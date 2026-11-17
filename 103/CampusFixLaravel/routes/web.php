<?php

use App\Http\Controllers\IssueReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('reports.index'));

Route::resource('reports', IssueReportController::class);

Route::patch('/reports/{report}/advance-status', [IssueReportController::class, 'advanceStatus'])
    ->name('reports.advance-status');

Route::post('/reports/{report}/upvote', [IssueReportController::class, 'upvote'])
    ->name('reports.upvote');
