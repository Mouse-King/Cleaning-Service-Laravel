<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Plan::create([            
                'name'              => 'Free',
                'description'       => 'This is Free plan perhaps the single biggest obstacle that all of, This is perhaps the single biggest us',
                'price'             => 0,
                'cycle'             => 'Monthly',
                'currency'          => 'eur',
                'profile_visit'     => '10',
                'access_contacts'   => '1',
                'allow_chat'        => '0',
                'status'            => '1'      
            ]);

            Plan::create([            
                'name'              => 'Basic',
                'description'       => 'This is Basic plan perhaps the single biggest obstacle that all of, This is perhaps the single biggest us',
                'price'             => 19,
                'cycle'             => 'Monthly',
                'currency'          => 'eur',
                'profile_visit'     => '100',
                'access_contacts'   => '1',
                'allow_chat'        => '0',
                'status'            => '1'      
            ]);

            Plan::create([            
                'name'              => 'Standard',
                'description'       => 'This is Standard plan perhaps the single biggest obstacle that all of, This is perhaps the single biggest us',
                'price'             => 39,
                'cycle'             => 'Quarterly',
                'currency'          => 'eur',
                'profile_visit'     => '150',
                'access_contacts'   => '1',
                'allow_chat'        => '1',
                'status'            => '1'      
            ]);

            Plan::create([            
                'name'              => 'Professional',
                'description'       => 'This is Professional plan perhaps the single biggest obstacle that all of, This is perhaps the single biggest us',
                'price'             => 69,
                'cycle'             => 'Half-yearly',
                'currency'          => 'eur',
                'profile_visit'     => '200',
                'access_contacts'   => '1',
                'allow_chat'        => '1',
                'status'            => '1'      
            ]);
    }
}
