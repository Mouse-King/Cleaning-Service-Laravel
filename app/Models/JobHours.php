<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobHours extends Model
{
    use HasFactory;

    public function worker(){
        return $this->belongsTo(User::class,'worker_id');
    }
}
