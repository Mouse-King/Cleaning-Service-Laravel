<?php

namespace Database\Seeders;

use App\Models\ManageTime;
use Illuminate\Database\Seeder;

class TimeSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ManageTime::create([
            'start_time'         => '08:00',
            'end_time'           => '17:00',
            'days'               => '["0","1","2","3","4"]'                
        ]);
       
    }
}
