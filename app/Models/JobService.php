<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobService extends Model
{
    use HasFactory;
   protected $fillable =[
    'job_id',
    'name',
    'job_hour',
    'freq_name',
    'cycle',
    'period',
    'total',
    'heb_name',
    'service_id',
    'pay_status',
    'order_status'
   ];
}
