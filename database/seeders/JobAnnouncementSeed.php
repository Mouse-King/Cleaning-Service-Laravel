<?php

namespace Database\Seeders;

use App\Models\JobAnnouncement;
use Illuminate\Database\Seeder;

class JobAnnouncementSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        JobAnnouncement::create([
            'announcement' => "I am looking candidate for myself.",
            'status'       => 1
        ]);

        JobAnnouncement::create([
            'announcement' => "I am looking candidate for someone else.",
            'status'       => 1
        ]);
    }
}
