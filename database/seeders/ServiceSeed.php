<?php

namespace Database\Seeders;

use App\Models\Services;
use Illuminate\Database\Seeder;

class ServiceSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
       
        Services::create([
            'name'         => 'Office Cleaning',
            'heb_name'     => 'ניקיון משרד',  
            'template'     => 'office_cleaning',
            'status'       => 1                
        ]);
        Services::create([
            'name'         => 'Cleaning After Renovation', 
            'heb_name'     => 'ניקיון לאחר שיפוץ',  
            'template'     => 'after_renovation',
            'status'       => 1                 
        ]);
        Services::create([
            'name'         => 'Thorough Cleaning - Basic',     
            'heb_name'     => 'בייסיק',  
            'template'     => 'thorough_cleaning', 
            'status'       => 1           
        ]);
        Services::create([
            'name'         => '5 Star',
            'heb_name'     => '5 כוכבים',  
            'template'     => 'regular',
            'status'       => 1                  
        ]);
        Services::create([
            'name'         => '4 Star',
            'heb_name'     => '4 כוכבים',  
            'template'     => 'regular',
            'status'       => 1                  
        ]);
        Services::create([
            'name'         => '3 Star',
            'heb_name'     => '3 כוכבים',  
            'template'     => 'regular',
            'status'       => 1                  
        ]);
        Services::create([
            'name'         => '2 Star',
            'heb_name'     => '2 כוכבים',  
            'template'     => 'regular',
            'status'       => 1                  
        ]);
        Services::create([
            'name'         => 'window cleaning',
            'heb_name'     => 'ניקוי חלונות',  
            'template'     => 'window_cleaning',
            'status'       => 1                  
        ]);
        Services::create([
            'name'         => 'Floor Polishing',
            'heb_name'     => 'פוליש\ חידוש רצפות',  
            'template'     => 'polish',
            'status'       => 1                  
        ]);
        Services::create([
            'name'         => 'Others',
            'heb_name'     => 'אחרים',  
            'template'     => 'others',
            'status'       => 1                  
        ]);
        Services::create([
            'name'         => 'Thorough Cleaning - Standard',     
            'heb_name'     => 'סטנדרט',  
            'template'     => 'thorough_cleaning', 
            'status'       => 1           
        ]);
        Services::create([
            'name'         => 'Thorough Cleaning - Premium',     
            'heb_name'     => 'פרמיום',  
            'template'     => 'thorough_cleaning', 
            'status'       => 1           
        ]);
        Services::create([
            'name'         => 'General Cleaning',     
            'heb_name'     => 'ניקיון כללי',  
            'template'     => 'regular', 
            'status'       => 1           
        ]);
        

    }
}
