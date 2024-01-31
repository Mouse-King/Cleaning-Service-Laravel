<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LeadStatus;
use App\Models\Schedule;
use App\Models\Offer;
use App\Models\Services;
use App\Models\notifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Mail;
class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $q = $request->q;
        $result = Schedule::query()->with('client','team');
        $result->orWhere('booking_status','like','%'.$q.'%');
        $result->orWhere('end_time',       'like','%'.$q.'%');
        $result->orWhere('start_date',     'like','%'.$q.'%');
        $result->orWhere('start_time', 'like','%'.$q.'%');

        $result = $result->orWhereHas('client',function ($qr) use ($q){
             $qr->where(function($qr) use ($q) {
                 $qr->where(DB::raw('firstname'), 'like','%'.$q.'%');
                 $qr->orWhere(DB::raw('lastname'), 'like','%'.$q.'%');
                 $qr->orWhere(DB::raw('city'), 'like','%'.$q.'%');
                 $qr->orWhere(DB::raw('street_n_no'), 'like','%'.$q.'%');
                 $qr->orWhere(DB::raw('zipcode'), 'like','%'.$q.'%');
                 $qr->orWhere(DB::raw('phone'), 'like','%'.$q.'%');
             });
         });

         $result = $result->orWhereHas('team',function ($qr) use ($q){
            $qr->where(function($qr) use ($q) {
                $qr->where(DB::raw('name'), 'like','%'.$q.'%');
            });
        });
         
         $result = $result->orderBy('created_at', 'desc')->paginate(20);

         if(!empty($result)){
            foreach($result as $i => $res){
               if($res->client->lastname == null){
                 $result[$i]->client->lastname = '';
               }
            }
         }
 
         return response()->json([
             'schedules' => $result
         ]);   
    }


    public function GetAccessTokenRefresh($client_id,$client_secret, $rcode)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL,"https://accounts.google.com/o/oauth2/token");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,
        http_build_query(
        array(

            'client_id'     => $client_id,
            'client_secret' => $client_secret,
            'refresh_token' => $rcode,
            'grant_type'    => 'refresh_token',

        )));         
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $token_op = curl_exec($ch);
        $data = json_decode($token_op);
        return $data;
    }

   public function GetUserCalendarTimezone($access_token)
   {
        $url_settings = 'https://www.googleapis.com/calendar/v3/users/me/settings/timezone';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url_settings);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $access_token));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        $data = json_decode(curl_exec($ch), true);
      
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($http_code != 200)
            throw new Exception('Error : Failed to get timezone');

        return $data['value'];
   }
    
   public function CreateCalendarEvent($calendar_id, $summary, $all_day, $event_time, $event_timezone, $access_token,$description)
    {
        $url_events = 'https://www.googleapis.com/calendar/v3/calendars/' . $calendar_id . '/events';
      
        $curlPost = array('summary' => $summary);
    
        if ($all_day == 1) {
            $curlPost['start'] = array('date' => $event_time['event_date']);
            $curlPost['end'] = array('date' => $event_time['event_date']);
            $curlPost['description'] = $description;

        } else {
            $curlPost['start'] = array('dateTime' => $event_time['start_time'], 'timeZone' => $event_timezone);
            $curlPost['end'] = array('dateTime' => $event_time['end_time'], 'timeZone' => $event_timezone);
            $curlPost['description'] = $description;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url_events);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $access_token, 'Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($curlPost));
        $data = json_decode(curl_exec($ch), true);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if ($http_code != 200)
            throw new Exception('Error : Failed to create event');

        return $data['id'];
    }
    public function PushEvent($event_title,$event_date,$time_bw,$c_email,$cnct)
    {
       
        $description = "Between ".$time_bw." <br>".$c_email." <br> ".$cnct;
        $date=date($event_date);
        $str = str_replace('/', '-', $date);
        $dt =  date('Y-m-d', strtotime($str));

        $application_id = env('GAPP_ID');
        $application_secret = env('GSEC');
        $rcode = env('RTOKEN');
        $calendar_id = env('CAL_ID');
      

        $data = $this->GetAccessTokenRefresh($application_id , $application_secret, $rcode);
        $access_token = $data->access_token;
     
        $user_timezone = $this->GetUserCalendarTimezone($access_token);
        
        $full_day_event = 1;
        $event_time = ['event_date' => $dt];
        
        $event_id = $this->CreateCalendarEvent($calendar_id, $event_title, $full_day_event, $event_time, $user_timezone, $access_token,$description);
       
        if($event_id != ""){

            //success event create
        }
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator  = Validator::make($request->all(),[

            'client_id'      => ['required'],
            'start_date'     => ['required'],
            'start_time'     => ['required'],
            'end_time'       => ['required'],
            'booking_status' => ['required'],
        ]);
        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()]);
        }
    
        $input  = $request->input(); 
        $sch = Schedule::create($input);

        
        LeadStatus::updateOrCreate(
            [
              'client_id' => $request->client_id,
            ],
            [
              'client_id' => $request->client_id,
              'lead_status' =>  'Meeting pending'
            ]

          );

        notifications::create([
            'user_id'=>$request->client_id,
            'type'=>'sent-meeting',
            'meet_id'=>$sch->id,
            'status' => $request->booking_status
        ]);
        $schedule = Schedule::where('id',$sch->id)->with('client','team')->get()->first();
        $event_title = "Meeting with ".$schedule->client->firstname." ".$schedule->client->lastname;
        $event_date  = $request->start_date;
        $time_bw     = $request->start_time. " - ".$request->end_time;
        $c_email     = $schedule->client->email;
        $cnct        = (!empty($schedule->client->phone)) ? $schedule->client->phone : 'phone N/A';
        $this->PushEvent($event_title,$event_date,$time_bw,$c_email,$cnct);
        $this->sendMeetingMail($schedule);
        return response()->json([
            'message' => 'Metting scheduled  successfully'
        ]);
    }

    public function sendMeetingMail($sch){
      
       $sch = $sch->toArray();
       $services = Offer::where('client_id',$sch['client']['id'])->get()->last();
       $str = '';
      
       if(!empty($services->services)){

         $allServices = json_decode($services->services);
         foreach($allServices as $k=> $serv){
           
            if($k != count($allServices)-1 && $serv->service != 10)
            $str .= $serv->name.", ";
                else if($serv->service == 10){
                    if($k != count($allServices)-1)
                    $str .= $serv->other_title.", ";
                    else 
                    $str .= $serv->other_title;
                }
            else
            $str .= $serv->name;
         }
 
       } 
        
        $sch['service_names'] = $str; 
        \App::setLocale($sch['client']['lng']);
        
        Mail::send('/Mails/MeetingMail',$sch,function($messages) use ($sch){
            $messages->to($sch['client']['email']);
            $sch['client']['lng'] == 'en' ?
            $sub = __('mail.meeting.subject')." ".__('mail.meeting.from')." ".__('mail.meeting.company')." #".$sch['id']
            :  $sub = $sch['id']."# ".__('mail.meeting.subject')." ".__('mail.meeting.from')." ".__('mail.meeting.company');
            $messages->subject($sub);
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $schedule = Schedule::where('id',$id)->with('client','team')->get()->first();
        if(!empty($schedule)){
               if($schedule->client->lastname == null){
                $schedule->client->lastname = '';
            }
         }
        return response()->json([
            'schedule' => $schedule
        ]);
    }

    public function getEvents(Request $request){
        $events = Schedule::where('team_id',$request->tid)->where('booking_status','!=','declined')->get();
        $evn = [];
        if(isset($events)):
        foreach($events as $event):
          
            $ar = [];
            $sd               = Carbon::parse($event['start_date'])->format('Y-m-d');
            $ar["id"]         = $event['id'];
            $ar["title"]      = 'Busy';
            $ar["start"]      = date_format(date_create($sd.$event['start_time']) ,'Y-m-d H:i:s');
            $ar["end"]        = date_format(date_create($sd.$event['end_time']) ,'Y-m-d H:i:s');
            $ar["start_time"] = $event['start_time'];
        
            array_push($evn,$ar);

        endforeach;
        endif;

        return response()->json([
            'events' => $evn
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function edit(Schedule $schedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,$id)
    {
        $change  = '';
        if($request->name == 'start_date'){
            Schedule::where('id',$id)->update([
                'booking_status' => 'pending',
                'start_date'     => $request->value,
                'start_time'     => '',
                'end_time'       => ''
            ]);
            $change = 'date';
        } else {

            Schedule::where('id',$id)->update([
                $request->name => $request->value
            ]);
            $change = "other";
        }
        return response()->json([
            'message' => str_replace('_',' ',$request->name)." has been updated",
            'change'  =>$change
        ]);
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $sch = Schedule::with('client')->where('id',$id)->get()->first()->toArray();
        \App::setLocale($sch['client']['lng']);
        Mail::send('/Mails/DeleteMeetingMail',$sch,function($messages) use ($sch){
            $messages->to($sch['client']['email']);
            $sub = __('mail.cancel_meeting.subject')." ".__('mail.cancel_meeting.from')." ".__('mail.cancel_meeting.company')." #".$sch['id'];
            $messages->subject($sub);
        });

        Schedule::where('id',$id)->delete();
        return response()->json([
            'message'=> 'Meeting has been deleted'
        ]);
    }
    public function ClientSchedules(Request $request){
        
        $schedules = Schedule::with('team')->where('client_id',$request->id)->orderBy('created_at','desc')->get();
        return response()->json([
            'schedules'=>$schedules
        ]); 
    }
    public function getLatestClientSchedule(Request $request){
        $latestSchedule = Schedule::where('client_id',$request->id)->get()->last();
        return response()->json([
            'latestSchedule'=>$latestSchedule
        ]); 
    }
}
