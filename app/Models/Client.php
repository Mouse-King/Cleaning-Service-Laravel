<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class Client extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table="clients";
    
    protected $fillable = [
        'firstname',
        'lastname',
        'invoicename',
        'city',
        'street_n_no',
        'floor',
        'apt_no',
        'entrence_code',
        'zipcode',
        'dob',
        'passcode',
        'geo_address',
        'lng',
        'latitude',
        'longitude',
        'color',
        'address',
        'phone',
        'email',
        'status',
        'password',
        'extra',
        'avatar',

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    
    public function jobs()
    {
        return $this->hasMany(Job::class);
    }

    public function meetings()
    {
        return $this->hasMany(Schedule::class,'client_id','id');
    }

    public function offers()
    {
        return $this->hasMany(Offer::class,'client_id','id');
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }

    public function contract(){
        return $this->hasMany(Contract::class,'client_id');
    }

    public function lead_status(){
        return $this->hasOne(LeadStatus::class,'client_id','id');
    }


    public function ScopeReply( $query ){

        return WhatsappLastReply::where('message','=','0')
        ->join('clients','whatsapp_last_replies.phone','like',\DB::raw( "CONCAT('%', clients.phone, '%')"))
        ->orWhere('message','=','2_no')
        ->orWhere('message','=','2')
        ->where('clients.phone','!=','')
        ->where('clients.phone','!=',0)
        ->where('clients.phone','!=',NULL);

    }

    public static function boot() {
        parent::boot();
        static::deleting(function($Client) { 
             Schedule::where('client_id',$Client->id)->delete();
             Offer::where('client_id',$Client->id)->delete();
             Contract::where('client_id',$Client->id)->delete();
             notifications::where('user_id',$Client->id)->delete();
             Job::where('client_id',$Client->id)->delete();
             Order::where('client_id',$Client->id)->delete();
        });
    }

}
