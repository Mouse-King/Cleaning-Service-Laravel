<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkerAvialibilty extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'day',
        'date',
        'working',
        'status',        
    ];
    protected $casts = [
        'working' => 'array',
    ];
     public function worker()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
