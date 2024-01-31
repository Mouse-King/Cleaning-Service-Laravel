<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;
    protected $fillable = [
        'note',
        'user_id',
        'role',
        'team_id',
        'important'
    ];

    public function team(){
        return $this->belongsTo(Admin::class,'team_id');
    }
   
}
