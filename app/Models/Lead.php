<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    public static function boot() {
        parent::boot();
        static::deleting(function($lead) { 
             Schedule::where('client_id',$lead->id)->delete();
             Offer::where('client_id',$lead->id)->delete();
             Contract::where('client_id',$lead->id)->delete();
             notifications::where('user_id',$lead->id)->delete();
             Job::where('client_id',$lead->id)->delete();
             Order::where('client_id',$lead->id)->delete();
             WhatsappLastReply::where('phone','like','%'.$lead->phone.'%')->delete();
        });
    }


}
