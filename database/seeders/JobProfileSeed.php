<?php

namespace Database\Seeders;

use App\Models\JobProfile;
use Illuminate\Database\Seeder;

class JobProfileSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        JobProfile::create([
            'type' => "Life Assistant",
            'status'   => 1
        ]);

        JobProfile::create([
            'type' => "Paid Companion",
            'status'   => 1
        ]);

        JobProfile::create([
            'type' => "Cook",
            'status'   => 1
        ]);

        JobProfile::create([
            'type' => "Maid",
            'status'   => 1
        ]);

        JobProfile::create([
            'type' => "Domestic Help",
            'status'   => 1
        ]);
    }
}
