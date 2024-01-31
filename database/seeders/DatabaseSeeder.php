<?php

namespace Database\Seeders;

use App\Models\JobAnnouncement;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(AdminSeed::class);
        $this->call(ServiceSeed::class);
        $this->call(ServiceScheduleSeed::class);
        $this->call(CountrySeeder::class);
        $this->call(TimeSeed::class);
        //$this->call(LanguageSeed::class);
        
    }
}
