<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fblead extends Model
{
    use HasFactory;
    protected $table = 'fb_leads';
    protected $fillable = [
        'challenge'
    ];
}
