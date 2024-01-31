<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipts extends Model
{
    use HasFactory;
    protected $table = 'receipt';
    protected $fillable = [
        'invoice_id',
        'invoice_icount_id',
        'receipt_id',
        'docurl'
    ];
}
