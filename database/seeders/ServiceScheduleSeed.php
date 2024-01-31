<?php

namespace Database\Seeders;

use App\Models\serviceSchedules;
use Illuminate\Database\Seeder;

class ServiceScheduleSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        serviceSchedules::create([
            'name'         => 'One Time', 
            'name_heb'     => 'חד פעמי',
            'cycle'        => 1,
            'period'       =>'na',  
            'status'       => 1             
        ]);
        serviceSchedules::create([
            'name'         => 'On demand',  
            'name_heb'     => 'לפי דרישה',
            'cycle'        => 0,
            'period'       =>'bdm',
            'status'       => 1                
        ]);
        serviceSchedules::create([
            'name'         => 'Once Time week', 
            'name_heb'     => 'פעם בשבוע',
            'cycle'        => 1,
            'period'       =>'w',
            'status'       => 1                 
        ]);
        serviceSchedules::create([
            'name'         => 'Twice in week',
            'name_heb'     => 'פעמיים בשבוע',
            'cycle'        => 2,
            'period'       =>'w',
            'status'       => 1                  
        ]);
        serviceSchedules::create([
            'name'         => '3 times a week',
            'name_heb'     => '3 פעמים בשבוע',
            'cycle'        => 3,
            'period'       =>'w',      
            'status'       => 1            
        ]);
        serviceSchedules::create([
            'name'         => '4 times a week', 
            'name_heb'     => '4 פעמים בשבוע',
            'cycle'        => 4,
            'period'       =>'w',     
            'status'       => 1            
        ]);
        serviceSchedules::create([
            'name'         => '5 times a week',  
            'name_heb'     => '5 פעמים בשבוע',
            'cycle'        => 5,
            'period'       =>'w',    
            'status'       => 1            
        ]);
        serviceSchedules::create([
            'name'         => '6 times a week',  
            'name_heb'     => '6 פעמים בשבוע',
            'cycle'        => 6,
            'period'       =>'w',    
            'status'       => 1            
        ]);

        serviceSchedules::create([
            'name'         => 'Once in every two weeks',
            'name_heb'     => 'פעם בשבועיים',
            'cycle'        => 1,
            'period'       =>'2w',      
            'status'       => 1            
        ]);
        serviceSchedules::create([
            'name'         => 'Once in every three weeks', 
            'name_heb'     => 'פעם בשלושה שבועות',
            'cycle'        => 1,
            'period'       =>'3w',     
            'status'       => 1            
        ]);
        serviceSchedules::create([
            'name'         => 'Once a month',  
            'name_heb'     => 'פעם בחודש',
            'cycle'        => 1,
            'period'       =>'m',    
            'status'       => 1            
        ]);
        serviceSchedules::create([
            'name'         => 'Once every 2 Months',
            'name_heb'     => 'פעם בחודשיים',
            'cycle'        => 1,
            'period'       =>'2m',      
            'status'       => 1            
        ]);
        serviceSchedules::create([
            'name'         => 'Once every 3 Months', 
            'name_heb'     => 'פעם ב3 חודשים',
            'cycle'        => 1,
            'period'       =>'3m',     
            'status'       => 1            
        ]);

    }
}
