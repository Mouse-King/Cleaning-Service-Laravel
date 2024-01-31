<?php

namespace Database\Seeders;

use App\Models\GeneralSetting;
use Illuminate\Database\Seeder;

class GeneralSettingSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        GeneralSetting::create([
            'title'         => 'Yeliko - Book Your Consultant',
            'logo'          => 'logo.png',
            'facebook'      => 'www.facebook.com',
            'twitter'       => 'www.twitter.com',
            'instagram'     => 'www.instagram.com',
            'linkedin'      => 'www.linkedin.com',
        ]);
    }
}
