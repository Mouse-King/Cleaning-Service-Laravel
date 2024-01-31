<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Faker\Generator;

class JobSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = app(Generator::class);

        $users = User::where('role', 'employer')->get(['id', 'firstname', 'lastname']);
        foreach ($users as $user) {
            for ($i = 1; $i < 11; $i++) {
                $applicant = User::where('role', 'applicant')->inRandomOrder()->first(['id', 'firstname', 'lastname']);
                Job::create([
                    'user_id'               => $user->id,
                    'job_profile_id'        => $faker->randomElement([1, 2, 3, 4]),
                    'job_announcement_id'   => $faker->randomElement([1, 2]),
                    'title'                 => 'Job ' . $i . ' by ' . $user->lastname,
                    'description'           => $faker->realText($maxNbChars = 200, $indexSize = 2),
                    'address'               => $faker->address(),
                    'phone'                 => $faker->numerify('9#########'),
                    'slots'                 => ['6 AM - 8 AM Day Sunday', '8 AM - 12 PM Day Monday', '12 PM - 2 PM Day Tuesday', '2 PM - 4 PM Day Wednesday', '4 PM - 8 PM Day Thursday', '8 PM - 12 AM Day Friday'],
                    'start_date'            => Carbon::now()->format('Y-m-d'),
                    'applicant_id'          => $applicant->id,
                    'rate'                  => $faker->numberBetween(1, 20),
                ]);
            }
        }
    }
}
