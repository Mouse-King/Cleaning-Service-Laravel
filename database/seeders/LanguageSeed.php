<?php

namespace Database\Seeders;

use App\Models\language;
use Illuminate\Database\Seeder;

class LanguageSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        language::create([
            'name' => 'Hebrew',
            'code' => 'heb'
        ]);
        language::create([
            'name' => 'english',
            'code' => 'en'
        ]);
    }
}
