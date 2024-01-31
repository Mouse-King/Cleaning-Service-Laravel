<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SubscriptionSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::where('role', 'employer')->get(['id', 'firstname', 'lastname']);

        foreach ($users as $user) {
            $plan       = Plan::inRandomOrder()->first();
            $valid_from = Carbon::now()->format('Y-m-d');

            switch ($plan->cycle) {

                case 'Monthly':
                    $valid_to = Carbon::now()->addMonths(1)->format('Y-m-d');
                    break;

                case 'Quarterly':
                    $valid_to = Carbon::now()->addMonths(4)->format('Y-m-d');
                    break;
                        
                case 'Yearly':
                    $valid_to = Carbon::now()->addMonths(12)->format('Y-m-d');
                    break;

                case 'Half-yearly':
                    $valid_to = Carbon::now()->addMonths(6)->format('Y-m-d');
                    break;
                               
                
                default:
                    $valid_to = Carbon::now()->addMonths(1)->format('Y-m-d');
                    break;
            }

            Subscription::create([
                'user_id'       => $user->id,
                'plan_id'       => $plan->id,
                'valid_from'    => $valid_from,
                'valid_upto'    => $valid_to,
                'status'        => '1',       
            ]);
        }
    }
}
