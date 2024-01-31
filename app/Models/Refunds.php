<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refunds extends Model
{
    use HasFactory;
    protected $table = 'refunds';
    protected $fillable = [
        'invoice_id',
        'invoice_icount_id',
        'refrence',
        'message',
    ];
}
