<?php

namespace Database\Seeders;

use App\Models\Admin;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Faker\Generator;
use Illuminate\Support\Facades\Hash;

class AdminSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = app(Generator::class);
        Admin::create([
            'name'              => 'superadmin',
            'email'             => 'admin@admin.com',
            'phone'             => $faker->numerify('9#########'),
            'address'           => $faker->address(), 
            'color'             => '#fff',
            'status'            => 1,
            'role'              => 'superadmin',
            'avatar'            => 'admin.png',
            'email_verified_at' => Carbon::now(),
            'password'          => Hash::make('password')
        ]);
        /*for ($i = 1; $i <= 10; $i++) {
        Admin::create([
            'name'              => $i == 1 ? 'superadmin' : $faker->name(),
            'email'             => $i == 1 ? 'admin@admin.com' : $faker->unique()->safeEmail(),
            'phone'             => $faker->numerify('9#########'),
            'address'           => $faker->address(), 
            'color'             => '#00FF00',
            'status'            => 1,
            'role'              => $i == 1 ? ('superadmin') : ('admin'),
            'avatar'            => 'admin.png',
            'email_verified_at' => Carbon::now(),
            'password'          => Hash::make('password')
        ]);
    }*/
    }
}
