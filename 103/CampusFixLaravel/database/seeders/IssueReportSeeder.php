<?php

namespace Database\Seeders;

use App\Models\IssueReport;
use Illuminate\Database\Seeder;

class IssueReportSeeder extends Seeder
{
    public function run(): void
    {
        $samples = [
            [
                'title' => 'Exposed Electrical Outlet Sparking',
                'location' => 'Engineering Bldg, Room 304',
                'category' => 'Safety Hazard',
                'severity' => 'Critical',
                'status' => 'Reported',
                'reporter_name' => 'Christian Bolea',
                'description' => 'Wall outlet near the front projector sparked when a laptop charger was plugged in. Needs immediate breaker check.',
                'upvotes' => 14,
            ],
            [
                'title' => 'Leaking Pipe Under 2nd Floor Sink',
                'location' => 'Main Building, 2F Men\'s Restroom',
                'category' => 'Plumbing & Restroom',
                'severity' => 'High',
                'status' => 'In Progress',
                'reporter_name' => 'Joshua Pornias',
                'description' => 'Water steadily dripping from the P-trap onto the tiled floor, creating a slip hazard during break hours.',
                'upvotes' => 9,
                'resolution_notes' => 'Maintenance team shut off valve; replacement gasket ordered.',
            ],
            [
                'title' => 'No Wi-Fi Signal in Study Area',
                'location' => 'University Library, 3F East Wing',
                'category' => 'Network & Wi-Fi',
                'severity' => 'High',
                'status' => 'Reported',
                'reporter_name' => 'Wayne Nagares',
                'description' => 'Access point AP-LIB-04 shows a blinking red LED and drops student connections every 2 minutes.',
                'upvotes' => 18,
            ],
            [
                'title' => 'Broken Ceiling Fan Blade Wobbling',
                'location' => 'IT Lab 202',
                'category' => 'Electrical & Lighting',
                'severity' => 'Medium',
                'status' => 'Reported',
                'reporter_name' => 'Darryl Ingente',
                'description' => 'Center ceiling fan vibrates loudly at medium speed and flickers the adjacent fluorescent tube.',
                'upvotes' => 5,
            ],
            [
                'title' => 'Projector HDMI Port Loose',
                'location' => 'Lecture Hall B',
                'category' => 'Classroom Equipment',
                'severity' => 'Medium',
                'status' => 'In Progress',
                'reporter_name' => 'Allen Seares',
                'description' => 'Mounted ceiling projector loses display signal unless the HDMI cable is held at an angle.',
                'upvotes' => 7,
                'resolution_notes' => 'IT support scheduled cable coupler replacement.',
            ],
            [
                'title' => 'Aircon Unit Not Cooling',
                'location' => 'Computer Lab 101',
                'category' => 'Air Conditioning',
                'severity' => 'Low',
                'status' => 'Resolved',
                'reporter_name' => 'Christian Bolea',
                'description' => 'Split-type AC unit blowing warm air during afternoon lab classes.',
                'upvotes' => 11,
                'resolution_notes' => 'Cleaned clogged filter and topped up refrigerant.',
                'resolved_at' => now()->subDay(),
            ],
        ];

        foreach ($samples as $sample) {
            IssueReport::create($sample);
        }
    }
}
