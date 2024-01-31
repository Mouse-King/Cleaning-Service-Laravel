<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;
use Faker\Generator;
class SkillSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = app(Generator::class);

        for ($i = 1; $i < 21; $i++) {
            Skill::create([
                'skill'         => $faker->jobTitle(),                
            ]);
        }
    }
}
