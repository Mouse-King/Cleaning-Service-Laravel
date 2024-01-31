<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientCard extends Model
{
    use HasFactory;
    protected $table = 'client_card';
    protected $fillable = [
        'client_id',
        'card_number',
        'card_type',
        'cvv',
        'cc_charge',
        'card_holder',
        'valid',
        'card_token',
    ];
}
