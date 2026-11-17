<?php

namespace Tests\Feature;

use App\Models\IssueReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IssueReportCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_read_update_and_delete_issue_report(): void
    {
        // CREATE
        $createResponse = $this->post('/reports', [
            'title' => 'Broken Door Lock in Lab 3',
            'location' => 'IT Building, 3F Lab 3',
            'category' => 'Safety Hazard',
            'severity' => 'High',
            'reporter_name' => 'Wayne Nagares',
            'description' => 'Main lab door latch is jammed and cannot lock properly after class.',
        ]);

        $report = IssueReport::firstOrFail();
        $createResponse->assertRedirect("/reports/{$report->id}");
        $this->assertDatabaseHas('issue_reports', [
            'title' => 'Broken Door Lock in Lab 3',
            'status' => 'Reported',
        ]);

        // READ
        $this->get('/reports')->assertStatus(200)->assertSee('Broken Door Lock in Lab 3');

        // UPDATE (Workflow advance + Upvote + Full Edit)
        $this->patch("/reports/{$report->id}/advance-status")->assertRedirect();
        $this->assertDatabaseHas('issue_reports', [
            'id' => $report->id,
            'status' => 'In Progress',
        ]);

        $this->post("/reports/{$report->id}/upvote")->assertRedirect();
        $this->assertDatabaseHas('issue_reports', [
            'id' => $report->id,
            'upvotes' => 2,
        ]);

        // DELETE
        $this->delete("/reports/{$report->id}")->assertRedirect('/reports');
        $this->assertDatabaseMissing('issue_reports', ['id' => $report->id]);
    }
}
