<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $table = 'order';
    protected $fillable = [
        'order_id',
        'job_id',
        'client_id',
        'doc_url',
        'contract_id',
        'response',
        'items',
        'status',
        'invoice_status'
    ];

    public function job(){
        return $this->belongsTo(Job::class,'job_id');
    }
    public function client(){
        return $this->belongsTo(Client::class,'client_id');
    }
   
}
