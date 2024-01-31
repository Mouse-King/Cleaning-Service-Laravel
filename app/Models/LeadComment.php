<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadComment extends Model
{
    use HasFactory;
    protected $fillable = [
        'comment',
        'team_id',
        'lead_id'
    ];
    
    public function team(){
        return $this->belongsTo(Admin::class,'team_id');
    }
}
