<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TextResponse extends Model
{
    use HasFactory;

    protected $table = 'text_response';

    protected $fillable = [
        'keyword',
        'heb',
        'eng',
        'status'
    ];
}
