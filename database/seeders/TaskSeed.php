<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Task::create([
            'task'         => 'Day and night care',                
        ]);
        Task::create([
            'task'         => 'Caring for a person with Alzheimer\'s disease',                
        ]);
        Task::create([
            'task'         => 'Help with taking medication',                
        ]);
        Task::create([
            'task'         => 'Assistance with meals',                
        ]);
        Task::create([
            'task'         => 'Help getting up and going to bed',                
        ]);
        Task::create([
            'task'         => 'Help with the toilet',                
        ]);
        Task::create([
            'task'         => 'Shopping/Pharmacy',                
        ]);
        Task::create([
            'task'         => 'Accompaniment on outings',                
        ]);
        Task::create([
            'task'         => 'Meal preparation',                
        ]);
        Task::create([
            'task'         => 'Laundry',                
        ]);
        Task::create([
            'task'         => 'To do the housework',                
        ]);
        Task::create([
            'task'         => 'Accompaniment during various activities',                
        ]);        

    }
}
