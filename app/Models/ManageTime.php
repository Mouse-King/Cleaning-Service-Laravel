<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManageTime extends Model
{
    use HasFactory;
    protected $table = 'manage_time';
    protected $fillable = [
        'start_time',
        'end_time',
        'days',
    ];
   
}
