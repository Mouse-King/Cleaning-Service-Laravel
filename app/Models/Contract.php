<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;
    protected $fillable = [
        'offer_id',        
        'client_id',
        'additional_address',
        'name_on_card',
        'cvv',
        'unique_hash',
        'signature',
        'card_sign',
        'status',
    ];

    public function client(){
        return $this->belongsTo(Client::class,'client_id');
    }
    public function offer(){
        return $this->belongsTo(Offer::class,'offer_id');
    }
  
   
}
