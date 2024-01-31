<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class notifications extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'type',
        'status',
        'offer_id',
        'job_id',
        'contract_id',
        'meet_id',
    ];

    public function client(){
       return $this->belongsTo(Client::class,'user_id');
    }

   
}
