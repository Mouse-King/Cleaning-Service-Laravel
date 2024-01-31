<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadStatus extends Model
{
    use HasFactory;

    protected $table = "leadstatus";

    protected $fillable = [

        'client_id',
        'lead_status'
    ];
}
