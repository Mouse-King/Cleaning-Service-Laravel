<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Faker\Generator;
class ReviewSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = app(Generator::class);

        $jobs = Job::get(['id']);

        foreach ($jobs as $job) {

            for ($i = 1; $i < 2; $i++) {  

                $user = User::inRandomOrder()->first(['id', 'firstname', 'lastname']);     

                Review::create([
                    'user_id'               => $user->id,
                    'author'                => $user->firstname.' '.$user->lastname,
                    'job_id'                => $job->id,
                    'review'                => $faker->realText($maxNbChars = 200, $indexSize = 2),
                    'rating'                => $faker->randomElement([1, 2, 3, 4, 5]),
                    'date'                  => Carbon::now()->format('Y-m-d'),
                    'status'                => $faker->randomElement(['0', '1']),                 
                ]);

            }

        }
    }
}
