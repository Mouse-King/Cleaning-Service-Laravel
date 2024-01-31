<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Job;
use App\Models\User;
use App\Models\Contract;
use App\Models\Services;
use App\Models\serviceSchedules;
use App\Models\JobHours;
use App\Models\JobService;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Mail;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail as FacadesMail;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {   
       
        $q =  $request->q;
        $w = $request->filter_week;
        $jobs = Job::with('worker', 'client','offer','jobservice','order','invoice');

        if($q != ''){
            
            $jobs = $jobs->orWhereHas('worker',function ($qr) use ($q){
                     $qr->where(function($qr) use ($q) {
                     $qr->where(DB::raw('firstname'), 'like','%'.$q.'%');
                     $qr->orWhere(DB::raw('lastname'), 'like','%'.$q.'%');
                 });
             });
            $jobs = $jobs->orWhereHas('client',function ($qr) use ($q){
                     $qr->where(function($qr) use ($q) {
                     $qr->where(DB::raw('firstname'), 'like','%'.$q.'%');
                     $qr->orWhere(DB::raw('lastname'), 'like','%'.$q.'%');
                 });
             });
            $jobs = $jobs->orWhereHas('jobservice',function ($qr) use ($q){
                     $qr->where(function($qr) use ($q) {
                     $qr->where(DB::raw('name'), 'like','%'.$q.'%');
                     $qr->orWhere(DB::raw('heb_name'), 'like','%'.$q.'%');
                 });
             });
             $jobs = $jobs->orWhere('status', 'like','%'.$q.'%');
        }
         // if($w != ''){
           if( (is_null($w) || $w == 'current') && $w != 'all'){
              $startDate = Carbon::now()->toDateString();
              $endDate = Carbon::now()->startOfWeek(Carbon::SUNDAY)->addDays(5)->toDateString(); 
           }
           if($w == 'next'){
              $startDate = Carbon::now()->startOfWeek(Carbon::SUNDAY)->addDays(6)->toDateString();
              $endDate = Carbon::now()->startOfWeek(Carbon::SUNDAY)->addDays(12)->toDateString(); 
             
          }
           if($w == 'nextnext'){
              $startDate = Carbon::now()->startOfWeek(Carbon::SUNDAY)->addDays(13)->toDateString();
              $endDate = Carbon::now()->startOfWeek(Carbon::SUNDAY)->addDays(19)->toDateString();
          }
          if($w == 'today'){
            $startDate = Carbon::today()->toDateString();
            $endDate = Carbon::today()->toDateString();
            
        }
      
      
        if($w == 'all' ){
            $jobs = $jobs->orderBy('created_at', 'desc')->paginate(20);
        } else if($request->p == 1){
            $jobs = $jobs->whereDate('start_date','>=',$startDate);
            $jobs = $jobs->whereDate('start_date','<=',$endDate);
            $jobs = $jobs->orderBy('created_at', 'desc')->paginate(5);
        } else{
            $jobs = $jobs->whereDate('start_date','>=',$startDate);
            $jobs = $jobs->whereDate('start_date','<=',$endDate);
            $pcount = Job::count();
            $jobs = $jobs->orderBy('created_at', 'desc')->paginate($pcount);
        }
     
        if(isset($jobs)):
        endif;
        
        return response()->json([
            'jobs'       => $jobs,        
        ], 200);


    }
    public function AvlWorker($id){
      $job = Job::where('id',$id)->get()->first();
      $serv = $job->jobservice;
      $ava_worker = array();
      foreach($serv as $sk => $js){
      $ava_workers = User::with('availabilities','jobs')->where('skill',  'like','%'.$js->service_id.'%');
           $ava_workers = $ava_workers->whereHas('availabilities', function ($query) use ($job) {
                    $query->where('date', '=',$job->start_date);
                });
           $ava_workers = $ava_workers->where('status',1)->get()->toArray();
          
           foreach($ava_workers as $w){
                $check_worker_job =  Job::where('worker_id',$w['id'])->where('start_date',$job->start_date)->get()->toArray();
                if(!$check_worker_job){
                   $ava_worker[]=$w;
                }
           }
        }
           //$job->avl_worker=$ava_worker;
        return response()->json([
            'aworker'       => $ava_worker,        
        ], 200);

     
    }

    public function getAllJob(){
        $jobs = Job::get();
        return response()->json([
            'jobs'       => $jobs,        
        ], 200);
    }

    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $validator = Validator::make($request->all(),[
            'client_id' =>['required'],
            'worker_id' =>['required'],
            'start_date'=>['required']
        ]);
        if($validator->fails()){
            return response()->json(['error'=>$validator->messages()]);
        }
        Job::create($request->input());
        return response()->json([
            'message' => 'Job has been created successfully'
        ],200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $job                = Job::with('client','worker','service','offer','jobservice','order')->find($id);
        
        return response()->json([
            'job'        => $job,            
        ], 200);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $job = Job::with('client','worker','service','offer','jobservice')->find($id);
        return response()->json([
            'job'=>$job
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(),[
            'workers' =>['required'], 
        ]);
        if($validator->fails()){
            return response()->json(['error'=>$validator->messages()]);
        }
        $worker=$request->workers[0];
        $job = Job::find($id);
        $job->worker_id     = $worker['worker_id'];
        $job->start_date    = $worker['date'];
        $job->start_time    = $worker['start'];
        $job->end_time      = $worker['end'];
        $job->status        = 'scheduled';
        $job->save();

        $this->sendWorkerEmail($id);
        
        return response()->json([
            'message'=>'Job has been updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Job::find($id)->delete();
        return response()->json([
            'message'     => "Job has been deleted"         
        ], 200);
    }

    public function getJobByClient(Request $request){

       if(($request->f) == 'all')
       $jobs = Job::with('offer','worker','jobservice','order','invoice')->where('client_id',$request->cid)->orderBy('start_date', 'desc');
       if(isset($request->status))
       $jobs = Job::with('offer','worker','jobservice','order','invoice')->where('status',$request->status)->where('client_id',$request->cid)->orderBy('start_date', 'desc');

       if(isset($request->q)){
          $q = $request->q;
          if($q == 'ordered')
          $jobs = Job::with('offer','worker','jobservice','order','invoice')->has('order')->where('client_id',$request->cid)->orderBy('start_date', 'desc');
          if($q == 'unordered')
          $jobs = Job::with('offer','worker','jobservice','order','invoice')->whereDoesntHave('order')->where('client_id',$request->cid)->orderBy('start_date', 'desc');
          if($q == 'invoiced')
          $jobs = Job::with('offer','worker','jobservice','order','invoice')->has('invoice')->where('client_id',$request->cid)->orderBy('start_date', 'desc');
          if($q == 'uninvoiced')
          $jobs = Job::with('offer','worker','jobservice','order','invoice')->whereDoesntHave('invoice')->where('client_id',$request->cid)->orderBy('start_date', 'desc');
       }

       $sch        =  Job::where('status','scheduled')->where('client_id',$request->cid)->count();
       $un_sch     =  Job::where('status','unscheduled')->where('client_id',$request->cid)->count();
       $cancel     =  Job::where('status','canceled')->where('client_id',$request->cid)->count();
       $progress   =  Job::where('status','progress')->where('client_id',$request->cid)->count();
       $completed  =  Job::where('status','completed')->where('client_id',$request->cid)->count();
       $ordered    =  Job::with('order')->has('order')->where('client_id',$request->cid)->count();
       $unordered  =  Job::with('order')->whereDoesntHave('order')->where('client_id',$request->cid)->count();
       $invoiced   =  Job::with('invoice')->has('invoice')->where('client_id',$request->cid)->count();
       $unordered  =  Job::with('invoice')->whereDoesntHave('invoice')->where('client_id',$request->cid)->count();

       $jobs = $jobs->paginate(20);

       $all = Job::where('client_id',$request->cid)->count();
       
       return response()->json([
        
        'all'         => $all,
        'jobs'        => $jobs,
        'scheduled'   => $sch,
        'unscheduled' => $un_sch,
        'canceled'    => $cancel,
        'progress'    => $progress,
        'completed'   => $completed,
        'ordered'     => $ordered,
        'unordered'   => $unordered,
        'invoiced'    => $invoiced,
        'uninvoiced'   => $unordered

    ]);
    }
    public function getJobWorker(Request $request){
        $filter              = [];
        $filter['status']    = $request->status;
        $jobs = Job::with('client', 'worker','service','jobservice')->where('worker_id',$request->wid);
        
          if(isset($filter['status']) && $filter['status']){
            $jobs            = $jobs->where('status', 'completed');
          }else{
            $jobs            = $jobs->where('status', '!=','completed');
          }

        $jobs = $jobs->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'jobs' => $jobs
        ]);

    }
    public function updateJob(Request $request, $id)
    {
        //
        $job = Job::find($id);
        if($request->date != ''){
            $job->start_date=$request->date;
        }
        if($request->worker != ''){
            $job->worker_id=$request->worker;
        }
        if($request->shifts != ''){
            $job->shifts=$request->shifts;
        }
        if($request->comment != ''){
            $job->comment=$request->comment;
        }
        $job->save();
        if($request->worker != ''){
          $this->sendWorkerEmail($id);
        }
        return response()->json([
            'message'=>'Job has been updated successfully'
        ],200);
    }
    public function createJob(Request $request,$id){
         $repeat_value='';
         $s_name='';
         $s_heb_name='';
         $s_hour='';
         $s_total='';
         $s_id=0;
         $contract_id=0;
         foreach($request->services as $service){
                 // dd($service);
                  $service_schedules = serviceSchedules::where('id','=',$service['frequency'])->first();
                  $ser = Services::where('id','=',$service['service'])->first();

                      $repeat_value=$service_schedules->period;
                      if($service['service'] == 10){
                         $s_name=$service['other_title'];
                         $s_heb_name=$service['other_title'];
                      }else{
                         $s_name=$ser->name;
                         $s_heb_name=$ser->heb_name;
                      }
                      $s_hour=$service['jobHours'];
                      $s_freq   = $service['freq_name'];
                      $s_cycle  = $service['cycle'];
                      $s_period = $service['period'];
                      $s_total  =$service['totalamount'];
                      $s_id     =$service['service'];
                      if(isset($request->client_page) && $request->client_page)
                      $contract_id=$service['c_id'];

         }
         if(isset($request->client_page) && $request->client_page){
              $job = Contract::with('offer')->find($contract_id);
         }else{
             $job = Contract::with('offer')->find($id);
         }
         $client_mail=array();
         $client_email='';
        foreach($request->workers as $worker){
           $count=1;
           if($repeat_value=='w'){
              $count=3;
           }
           for($i=0;$i<$count;$i++){
                $date = Carbon::createFromDate($worker['date']);
                $j=0;
                if($i==1){
                  $j=7;  
                }
               if($i==2){
                  $j=14;  
                }
                $job_date=$date->addDays($j)->toDateString();
                $status='scheduled';
                if(Job::where('start_date',$job_date)->where('worker_id',$worker['worker_id'])->exists()){
                    $status='unscheduled';
                }
                $new = new Job;
                $new->worker_id     = $worker['worker_id'];
                if(isset($request->client_page) && $request->client_page){
                    $new->client_id     = $id;
                    $new->contract_id   = $contract_id;
                }else{
                    $new->client_id     = $job->client_id;
                    $new->contract_id   = $id;
                }
                $new->offer_id      = $job->offer_id;
                $new->start_date    = $job_date;
                $new->shifts        = $worker['shifts'];
                $new->schedule      = $repeat_value;
                $new->schedule_id   = $s_id;
                $new->status        = $status;
                $new->save();

                $service           = new JobService;
                $service->job_id   = $new->id;
                $service->service_id=$s_id;
                $service->name     = $s_name;
                $service->heb_name = $s_heb_name;
                $service->job_hour = $s_hour;
                $service->freq_name = $s_freq;
                $service->cycle     = $s_cycle;
                $service->period    = $s_period;
                $service->total     = $s_total;
                $service->save();
            
            if($i == 0){
                 $job = Job::with('client','worker','jobservice')->where('id',$new->id)->first();
                  $_timeShift = $worker['shifts'];
                 if($_timeShift != ''){
                    $_timeShift1 = explode('-',$_timeShift)[1];
                    
                    $_ts = preg_replace('/[^0-9]/','', $_timeShift1).":00"; 
                    $ttime = strtotime($_ts) + 60*90;
                    $atime = date('H:i', $ttime);
                    $_timeShift = $_ts." - ".$atime;
                    
                }


                 $data = array(
                    'email'=> $job['worker']['email'],
                    'job'  => $job->toArray(),
                    'start_time'=>$_timeShift
                 );
                \App::setLocale($job->worker->lng);

                if(!is_null($job['worker']['email']) && $job['worker']['email'] != 'Null'){
                Mail::send('/Mails/NewJobMail',$data,function($messages) use ($data){
                    $messages->to($data['email']);
                    $sub = __('mail.worker_new_job.subject')."  ".__('mail.worker_new_job.company');
                    $messages->subject($sub);
                });
                }

                $data['job']['shifts']=$this->getShifts($worker['shifts'],$job['client']['lng']);
                $client_mail[] = $data;
                $client_email  =  $job['client']['email'];
                $client_name  =  $job['client']['firstname'].' '.$job['client']['lastname'];
                $client_lng    = $job['client']['lng'];
             } 

           }
        }
      
       
        \App::setLocale($client_lng);
        $client_data = array(
            'email'=>$client_email,
            'name' => $client_name,
            'jobs' => $client_mail,
            'lng' => $client_lng,
            'start_time'=>$_timeShift
        );
        
          if(!is_null($client_email) && $client_email != 'Null'){
           
        //  Mail::send('/Mails/NewJobClient',$client_data,function($messages) use ($client_data){
        //         $messages->to($client_data['email']);
        //         $id = $client_data['jobs'][0]['job']['id'];
        //         ($client_data['lng'] == 'en') ?
        //         $sub = __('mail.client_new_job.subject')."  ".__('mail.client_new_job.company')." #".$id:
        //         $sub = $id."# ".__('mail.client_new_job.subject')."  ".__('mail.client_new_job.company');
        //         $messages->subject($sub);
        //     });
        }


        return response()->json([
            'message'=>'Job has been created successfully'
        ],200);

    }
    public function getShifts($shift,$lng='en'){
    $show_shift = array(
        "Full Day",
        "Morning",
        'Afternoon',
        'Evening',
        'Night',
    );
    $shifts = explode(',', $shift);
    $check='';
    $new_shift='';
    foreach($show_shift as $s_s){
         if($s_s == 'Afternoon'){
            $check ='noon';
         }else{
            $check =$s_s;
         }
         foreach($shifts as $shift){
               if(str_contains($shift, strtolower($check))){
                   if($new_shift==''){
                           $new_shift=$s_s;
                        
                    }else{
                        if(!str_contains($new_shift, $s_s)){
                            $new_shift=$new_shift.' | '.$s_s;
                         }
                    }
               }
         }
    }
    if($lng=='heb'){
       $new_shift=str_replace("Full Day","יום שלם",$new_shift);
       $new_shift=str_replace("Morning","בוקר",$new_shift);
       $new_shift=str_replace("Noon","צהריים",$new_shift);
       $new_shift=str_replace("Afternoon","אחהצ",$new_shift);
       $new_shift=str_replace("Evening","ערב",$new_shift);
       $new_shift=str_replace("Night","לילה",$new_shift);
    }
     return $new_shift;

 }

    public function getJobTime(Request $request){
         $time = JobHours::where('job_id',$request->job_id)->get();
         $total=0;
         foreach($time as $t){
                if($t->time_diff){
                  $total = $total+(int)$t->time_diff;
                }
          }
          return response()->json([
            'time'     => $time,
            'total'    => $total         
            ], 200);
    }
    public function addJobTime(Request $request){
        $validator = Validator::make($request->all(),[
            'start_time' =>['required'],
            'end_time'  =>['required']
        ]);
        if($validator->fails()){
            return response()->json(['error'=>$validator->messages()]);
        }
        $time = new JobHours();
        $time->job_id=$request->job_id;
        $time->worker_id=$request->worker_id;
        $time->start_time=$request->start_time;
        $time->end_time=$request->end_time;
        $time->time_diff=$request->timeDiff;
        $time->save();
         return response()->json([
            'time'     => $time,        
            ], 200);
    }
    public function updateJobTime(Request $request){
         $validator = Validator::make($request->all(),[
            'start_time' =>['required'],
            'end_time'  =>['required']
        ]);
        if($validator->fails()){
            return response()->json(['error'=>$validator->messages()]);
        }
        $time = JobHours::find($request->id);
        $time->start_time=$request->start_time;
        $time->end_time=$request->end_time;
        $time->time_diff=$request->timeDiff;
        $time->save();
        return response()->json([
            'time'     => $time,        
            ], 200);
    }
    public function cancelJob(Request $request){ 
        $job = Job::with('worker','client','jobservice')->find($request->id); 
        Job::where('id',$request->id)->update(['status'=>'cancel']);

        $admin = Admin::find(1)->first();
        \App::setLocale('en');
        $data = array(
           'by'         =>'admin',
           'email'      =>$admin->email,
           'admin'      =>$admin->toArray(),
           'job'        => $job->toArray(),
        );

        FacadesMail::send('/ClientPanelMail/JobStatusNotification',$data,function($messages) use ($data){
           $messages->to($data['job']['client']['email']);
           $ln = $data['job']['client']['lng'];
           
           ($data['by'] == 'admin') ?
           $sub = ($ln == 'en') ? ('Job has been cancelled')." #".$data['job']['id']:
           $data['job']['id']."# ".('העבודה בוטלה')
           :
           $sub = __('mail.client_job_status.subject')." #".$data['job']['id'];

           $messages->subject($sub);
         });

        return response()->json([
            'msg'=>'Job cancelled succesfully!'
        ]);

    }
    public function deleteJobTime($id){
         JobHours::find($id)->delete();
          return response()->json([
            'message'     => 'Job Time Deleted Successfully',   
            ], 200);
    }

    public function exportReport(Request $request){
      
    if($request->type =='single'){
      $jobs = JobHours::where('job_id',$request->id)->with('worker')->get();
      $fileName = 'job_report_'.$request->id.'.csv';
    }
    else{
      $jobs = JobHours::whereDate('created_at','>=',$request->from)
              ->whereDate('created_at','<=',$request->to)->get();
      $fileName = 'AllJob_report.csv';
    }

      if(empty($jobs)){
        return response()->json([
            'status_code'=>404,
            'msg' => 'No work log is found!'
        ]);
      }
      
      $report = [];
      $total=0;
      foreach($jobs as $job){

        $row['worker_name']      = $job->worker->firstname." ".$job->worker->lastname;
        $row['worker_id']        = $job->worker->worker_id;
        $row['start_time']       = $job->start_time;
        $row['end_time']         = $job->end_time;
        $row['time_diffrence']   = $job->time_diff;
        $row['job_id']           = $job->job_id;
        $row['time_total']       = (int)$job->time_diff;
        
        array_push($report,$row);
      }
      
      
      return response()->json([
        'status_code'=> 200,
        'filename'=>$fileName,
        'report'=>$report
      ]);

    }
    public function sendWorkerEmail($job_id){
            $job = Job::with('client','worker','jobservice')->where('id',$job_id)->first();

             $data = array(
                'email'=> $job['worker']['email'],
                'job'  => $job->toArray(),
             );
             if( isset($job['worker']['email']) && $job['worker']['email'] != null && $job['worker']['email'] != 'Null'):
            \App::setLocale($job->worker->lng);
            Mail::send('/Mails/NewJobMail',$data,function($messages) use ($data){
                $messages->to($data['email']);
                $sub = __('mail.worker_new_job.subject')."  ".__('mail.worker_new_job.company');
                $messages->subject($sub);
            });
        endif;
            return true;

    }
    

}
