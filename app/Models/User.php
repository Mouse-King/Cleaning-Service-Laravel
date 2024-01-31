<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'phone',
        'address',
        'renewal_visa',
        'gender',
        'payment_per_hour',
        'worker_id',
        'lng',
        'skill',
        'status',
        'password'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    public function setSkillAttribute($value)
    {
        $this->attributes['skill'] = json_encode($value);
    }
    public function getSkillAttribute($value)
    {
        return $this->attributes['skill'] = $value;
    }

    public function jobs()
    {
        return $this->hasMany(Job::class,'worker_id');
    }

    public function availabilities()
    {
        return $this->hasMany(WorkerAvialibilty::class);
    }

}
