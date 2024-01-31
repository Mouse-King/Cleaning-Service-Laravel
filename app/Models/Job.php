<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',        
        'offer_id',
        'contract_id',
        'worker_id',
        'start_date',
        'end_date',
        'schedule_id',
        'schedule',
        'comment',
        'instruction',
        'address',
        'start_time',
        'shifts',
        'end_time',
        'rate',
        'invoice_no',
        'invoice_url',
        'status'
    ];

    public function worker()
    {
        return $this->belongsTo(User::class, 'worker_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
    public function service()
    {
        return $this->belongsTo(Services::class, 'job_id');
    }
    public function offer(){
        return $this->belongsTo(Offer::class, 'offer_id');
    }
    public function contract(){
        return $this->belongsTo(Contract::class,'contract_id');
    }
    public function jobservice(){
        return $this->hasMany(JobService::class,'job_id');
    }
    public function hours(){
        return $this->hasMany(JobHours::class,'job_id');
    }
    public function order(){
        return $this->hasMany(Order::class,'job_id');
    }
    public function invoice(){
        return $this->hasMany(Invoices::class,'job_id');
    }

    public static function boot() {
        parent::boot();
        static::deleting(function($job) { 
            
             Invoices::where('job_id',$job->id)->delete();
             JobService::where('job_id',$job->id)->delete();
             JobHours::where('job_id',$job->id)->delete();
             JobComments::where('job_id',$job->id)->delete();
           
        });
    }


}
