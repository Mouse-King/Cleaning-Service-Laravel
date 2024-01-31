<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\ClientCard;
use App\Models\Files;
use App\Models\Note;
use App\Models\Offer;
use App\Models\serviceSchedules;
use App\Models\Services;
use App\Models\Contract;
use App\Models\Job;
use App\Models\JobHours;
use App\Models\JobService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Image;
use File;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $q = $request->q;
      
        $result = Client::where('status',2);

        
         if( !is_null($q) ){

        // $result->where('email',      'like', '%' . $q . '%');
        // $result->orwhere('firstname',    'like', '%' . $ex[0] . '%');
        // $result->orWhere('lastname',   'like', '%' . $q2 . '%');
        // $result->orWhere('geo_address',   'like', '%' . $q . '%');
        // $result->orWhere('phone',   'like', '%' . $q . '%');

        // $result->orWhere('phone',      'like', '%' . $q . '%');
        // $result->orWhere('city',       'like', '%' . $q . '%');
        // $result->orWhere('street_n_no', 'like', '%' . $q . '%');
        // $result->orWhere('zipcode',    'like', '%' . $q . '%');
        // $result->orWhere('email',      'like', '%' . $q . '%');
        // $result->where('status','2');

        $result->where(function ($query) use ($q) {
            $ex = explode(' ',$q);
            $q2 = isset( $ex[1] ) ? $ex[1] : $q;
            $query->where('email',       'like', '%' . $q . '%')
                ->orWhere('firstname',       'like', '%' . $ex[0] . '%')
                ->orWhere('lastname',       'like', '%' . $q2 . '%')
                ->orWhere('phone',       'like', '%' . $q . '%')
                ->orWhere('geo_address',   'like', '%' . $q . '%');
                
        });


        }

        if (isset($request->action)) {

            $result = '';

            $ac = $request->action;

            if ($ac == 'booked')

                $result = Client::with('jobs')->has('jobs');

            if ($ac == 'notbooked')

                $result = Client::with('jobs')->whereDoesntHave('jobs');
        }

        $result = $result->where('status',2)->orderBy('id', 'desc')->paginate(20);

        if (isset($result)) {
            foreach ($result as $k => $res) {
                $contract = Contract::where('client_id', $res->id)->where('status', 'verified')->get()->last();
                if ($contract != null) {
                    $result[$k]->latest_contract = $contract->id;
                } else {
                    $result[$k]->latest_contract = 0;
                }
            }
        }

        return response()->json([
            'clients'       => $result,
        ], 200);
    }

    public function AllClients()
    {

        $clients = Client::all();

        if (!empty($clients)) {
            foreach ($clients as $i => $res) {
                if ($res->lastname == null) {
                    $clients[$i]->lastname = '';
                }
            }
        }

        return response()->json([
            'clients'       => $clients,
        ], 200);
    }

    public function latestClients()
    {

        $clients = Client::latest()->paginate(5);

        if (!empty($clients)) {
            foreach ($clients as $i => $res) {
                if ($res->lastname == null) {
                    $clients[$i]->lastname = '';
                }
            }
        }

        return response()->json([
            'clients'       => $clients,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->data, [
            'firstname' => ['required', 'string', 'max:255'],
            'phone'     => ['required'],
            'status'    => ['required'],
            'passcode'  => ['required', 'string', 'min:6',],
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:clients'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }

        $input                  = $request->data;

        $input['password']      = Hash::make($input['passcode']);

        $client                 = Client::create($input);

        if (!empty($request->jobdata)) {

            $offer = Offer::create([
                'client_id' => $client->id,
                'services' => $request->jobdata['services'],
                'subtotal' => $request->jobdata['subtotal'],
                'total' => $request->jobdata['total'],
                'status' => 'accepted'
            ]);

            $contract = Contract::create([
                'offer_id' => $offer->id,
                'client_id' => $client->id,
                'unique_hash' => md5($client->email . $offer->id),
                'status' => 'verified',
            ]);

            /* Create job */

            $allServices = json_decode($request->jobdata['services'], true);

            $jds = [];

            foreach ($allServices as $service) {

                $service_schedules = serviceSchedules::where('id', '=', $service['frequency'])->first();
                $ser = Services::where('id', '=', $service['service'])->first();

                $repeat_value = $service_schedules->period;
                if ($service['service'] == 10) {
                    $s_name = $service['other_title'];
                    $s_heb_name = $service['other_title'];
                } else {
                    $s_name = $ser->name;
                    $s_heb_name = $ser->heb_name;
                }
                $s_hour = $service['jobHours'];
                $s_freq   = $service['freq_name'];
                $s_cycle  = $service['cycle'];
                $s_period = $service['period'];
                $s_total = $service['totalamount'];
                $s_id = $service['service'];


                $client_mail = array();
                $client_email = '';

                // // foreach($request->workers as $worker){
                $count = 1;
                if ($repeat_value == 'w') {
                    $count = 3;
                }
                $worker = $service['worker'];
                $shift =  $service['shift'];

                for ($i = 0; $i < $count; $i++) {

                    if (isset($service['days'])) :
                        foreach ($service['days'] as $sd) : (!empty($service['days'])) ?
                                $date = Carbon::today()->next($sd)
                                : $date = Carbon::today();

                            $j = 0;
                            if ($i == 1) {
                                $j = 7;
                            }
                            if ($i == 2) {
                                $j = 14;
                            }
                            $job_date = $date->addDays($j)->toDateString();

                            $status = 'scheduled';
                            if (Job::where('start_date', $job_date)->where('worker_id', $worker)->exists()) {
                                $status = 'unscheduled';
                            }

                            $jds[] = [

                                'job' => [

                                    'worker'      => $worker,
                                    'client_id'   => $client->id,
                                    'offer_id'    => $offer->id,
                                    'contract_id' => $contract->id,
                                    'schedule_id' => $s_id,
                                    'start_date'  => $job_date,
                                    'shifts'      => $shift,
                                    'schedule'    => $repeat_value,
                                    'status'      => $status,
                                ],

                                'service' => [

                                    'service_id' => $s_id,
                                    'name'       => $s_name,
                                    'heb_name'   => $s_heb_name,
                                    'job_hour'   => $s_hour,
                                    'freq_name'  => $s_freq,
                                    'cycle'      => $s_cycle,
                                    'period'     => $s_period,
                                    'total'      => $s_total,

                                ]

                            ];


                        endforeach;
                    endif;
                }
            }

            if (!empty($jds)) {
                foreach ($jds as $jd) {

                    $jdata = $jd['job'];
                    $sdata = $jd['service'];

                    $new = new Job;
                    $new->worker_id     = $jdata['worker'];

                    $new->client_id     = $jdata['client_id'];
                    $new->offer_id      = $jdata['offer_id'];
                    $new->contract_id   = $jdata['contract_id'];

                    $new->schedule_id       = $jdata['schedule_id'];

                    $new->start_date    = $jdata['start_date'];
                    $new->shifts        = $jdata['shifts'];
                    $new->schedule      = $jdata['schedule'];
                    $new->status        = $jdata['status'];

                    $new->save();

                    $service             = new JobService;
                    $service->job_id     = $new->id;
                    $service->service_id = $sdata['service_id'];
                    $service->name       = $sdata['name'];
                    $service->heb_name   = $sdata['heb_name'];
                    $service->job_hour   = $sdata['job_hour'];
                    $service->freq_name  = $sdata['freq_name'];
                    $service->cycle      = $sdata['cycle'];
                    $service->period     = $sdata['period'];
                    $service->total      = $sdata['total'];

                    $service->save();
                }
            }
        }
        /*End create job */

        return response()->json([
            'message'       => 'Client created successfully',
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $client               = Client::find($id);
        if (isset($client)) {

            $contract = Contract::where('client_id', $client->id)->where('status', 'verified')->get()->last();
            if ($contract != null) {
                $client->latest_contract = $contract->id;
            } else {
                $client->latest_contract = 0;
            }
        }
        return response()->json([
            'client'        => $client,
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
        $client                = Client::find($id);
        return response()->json([
            'client'        => $client,
        ], 200);
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

        $validator = Validator::make($request->data, [
            'firstname' => ['required', 'string', 'max:255'],
           // 'passcode'  => ['required', 'string', 'min:6'],
            'phone'     => ['required'],
            'status'    => ['required'],
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:clients,email,' . $id],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }
        $client = Client::where('id', $id)->get()->first();

       
        $input                  = $request->data;
        if ((isset($input['passcode']) && $input['passcode'] != null)){
            $input['password']      = Hash::make($input['passcode']);
        } else{
            $input['password'] = $client->password;
        }

        Client::where('id', $id)->update($input);

       

        if (!empty($request->jobdata)) {

            $offer = Offer::create([
                'client_id' => $client->id,
                'services' => $request->jobdata['services'],
                'subtotal' => $request->jobdata['subtotal'],
                'total' => $request->jobdata['total'],
                'status' => 'accepted'
            ]);

            $contract = Contract::create([
                'offer_id' => $offer->id,
                'client_id' => $client->id,
                'unique_hash' => md5($client->email . $offer->id),
                'status' => 'verified',
            ]);

            /* Create job */

            $allServices = json_decode($request->jobdata['services'], true);

            $jds = [];

            foreach ($allServices as $service) {

                $service_schedules = serviceSchedules::where('id', '=', $service['frequency'])->first();
                $ser = Services::where('id', '=', $service['service'])->first();

                $repeat_value = $service_schedules->period;
                if ($service['service'] == 10) {
                    $s_name = $service['other_title'];
                    $s_heb_name = $service['other_title'];
                } else {
                    $s_name = $ser->name;
                    $s_heb_name = $ser->heb_name;
                }
                $s_hour = $service['jobHours'];
                $s_freq   = $service['freq_name'];
                $s_cycle  = $service['cycle'];
                $s_period = $service['period'];
                $s_total = $service['totalamount'];
                $s_id = $service['service'];


                $client_mail = array();
                $client_email = '';

                // // foreach($request->workers as $worker){
                $count = 1;
                if ($repeat_value == 'w') {
                    $count = 3;
                }
                $worker = $service['worker'];
                $shift =  $service['shift'];
                
                for ($i = 0; $i < $count; $i++) {

                    if (isset($service['days'])) :
                        foreach ($service['days'] as $sd) : 
                           
                            (!empty($service['days'])) ?
                                $date = Carbon::today()->next($sd)
                                : $date = Carbon::today();

                            $j = 0;
                            if ($i == 1) {
                                $j = 7;
                            }
                            if ($i == 2) {
                                $j = 14;
                            }
                            $job_date = $date->addDays($j)->toDateString();

                            $status = 'scheduled';
                            if (Job::where('start_date', $job_date)->where('worker_id', $worker)->exists()) {
                                $status = 'unscheduled';
                            }

                            $jds[] = [

                                'job' => [

                                    'worker'      => $worker,
                                    'client_id'   => $client->id,
                                    'offer_id'    => $offer->id,
                                    'contract_id' => $contract->id,
                                    'schedule_id' => $s_id,
                                    'start_date'  => $job_date,
                                    'shifts'      => $shift,
                                    'schedule'    => $repeat_value,
                                    'status'      => $status,
                                ],

                                'service' => [

                                    'service_id' => $s_id,
                                    'name'       => $s_name,
                                    'heb_name'   => $s_heb_name,
                                    'job_hour'   => $s_hour,
                                    'freq_name'  => $s_freq,
                                    'cycle'      => $s_cycle,
                                    'period'     => $s_period,
                                    'total'      => $s_total,

                                ]

                            ];


                        endforeach;
                    endif;
                }
            }
           
            if (!empty($jds)) {
                foreach ($jds as $jd) {

                    $jdata = $jd['job'];
                    $sdata = $jd['service'];

                    $new = new Job;
                    $new->worker_id     = $jdata['worker'];

                    $new->client_id     = $jdata['client_id'];
                    $new->offer_id      = $jdata['offer_id'];
                    $new->contract_id   = $jdata['contract_id'];

                    $new->schedule_id       = $jdata['schedule_id'];

                    $new->start_date    = $jdata['start_date'];
                    $new->shifts        = $jdata['shifts'];
                    $new->schedule      = $jdata['schedule'];
                    $new->status        = $jdata['status'];

                    $new->save();

                    $service             = new JobService;
                    $service->job_id     = $new->id;
                    $service->service_id = $sdata['service_id'];
                    $service->name       = $sdata['name'];
                    $service->heb_name   = $sdata['heb_name'];
                    $service->job_hour   = $sdata['job_hour'];
                    $service->freq_name  = $sdata['freq_name'];
                    $service->cycle      = $sdata['cycle'];
                    $service->period     = $sdata['period'];
                    $service->total      = $sdata['total'];

                    $service->save();
                }
            }
        }


        /*End create job */

        return response()->json([
            'message'       => 'Client updated successfully',
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Client::find($id)->delete();
        return response()->json([
            'message'     => "Client has been deleted"
        ], 200);
    }

    public function addfile(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'role'   => 'required',
            'user_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()]);
        }

        $file_nm = '';
        if ($request->type == 'video') {

            $video = $request->file('file');
            $vname = $request->user_id . "_" . date('s') . "_" . $video->getClientOriginalName();
            $path = storage_path() . '/app/public/uploads/ClientFiles';
            $video->move($path, $vname);
            $file_nm = $vname;
        } else {

            if ($request->hasfile('file')) {

                $image = $request->file('file');
                $name = $image->getClientOriginalName();
                $img = Image::make($image)->resize(350, 227);
                $destinationPath = storage_path() . '/app/public/uploads/ClientFiles/';
                $fname = 'file_' . $request->user_id . '_' . date('s') . '_' . $name;
                $path = storage_path() . '/app/public/uploads/ClientFiles/' . $fname;
                File::exists($destinationPath) or File::makeDirectory($destinationPath, 0777, true, true);
                $img->save($path, 90);
                $file_nm  = $fname;
            }
        }

        Files::create([
            'user_id'   => $request->user_id,
            'meeting'   => $request->meeting,
            'note'      => $request->note,
            'role'      => 'client',
            'type'      => $request->type,
            'file'      => $file_nm

        ]);

        return response()->json([
            'message' => 'File uploaded',
        ], 200);
    }
    public function getfiles(Request $request)
    {
        $files = Files::where('user_id', $request->id)->get();
        if (isset($files)) {
            foreach ($files as $k => $file) {

                $files[$k]->path =  asset('storage/uploads/ClientFiles') . "/" . $file->file;
            }
        }
        return response()->json([
            'files' => $files
        ], 200);
    }
    public function deletefile(Request $request)
    {
        Files::where('id', $request->id)->delete();
        return response()->json([
            'message' => 'File deleted',
        ], 200);
    }

    public function addNote(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'note'     => 'required',
            'team_id'  => 'required',
            'user_id'  => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }
        Note::create([
            'note'   => $request->note,
            'user_id' => $request->user_id,
            'team_id' => $request->team_id,
            'important' => $request->important
        ]);
        return response()->json(['message' => 'Note added']);
    }

    public function getNotes(Request $request)
    {
        $notes = Note::where(['user_id' => $request->id, 'role' => 'client'])->with('team')->get();
        return response()->json(['notes' => $notes]);
    }

    public function deleteNote(Request $request)
    {
        Note::where(['id' => $request->id])->delete();
        return response()->json(['message' => 'Note deleted']);
    }

    public function cardToken($id)
    {

        $card = ClientCard::where('client_id', $id)->get()->first();
        $cvv  = Contract::where('client_id', $id)->where('cvv', '!=', 'null')->get('cvv')->last();

        return response()->json([

            'status_code'  => (!empty($card)) ? 200 : 0,
            'card'         => (!empty($card)) ? $card->card_number : 0,
            'expiry'       => (!empty($card)) ? $card->valid : 0,
            'token'        => (!empty($card)) ? $card->card_token : 0,
            'ctype'        => (!empty($card)) ? $card->card_type : 0,
            'holder'       => (!empty($card)) ? $card->card_holder : 0,
            'cvv'          => (!empty($cvv)) ? $cvv : 0,

        ]);
    }

    public function export(Request $request)
    {



        if (isset($request->f) &&  $request->f != "null")

            $clients = Client::where('status', $request->f)->get();

        if (!is_null($request->action)) {

            $ac = $request->action;

            if ($ac == 'booked')

                $clients = Client::with('jobs')->has('jobs')->get();

            if ($ac == 'notbooked')

                $clients = Client::with('jobs')->whereDoesntHave('jobs')->get();
        }

        if ($request->f == 'null')

            $clients = Client::get();

        foreach ($clients as $i => $c) {

            if ($c->status == 0) {
                $clients[$i]['status'] = 'Lead';
            }
            if ($c->status == 1) {
                $clients[$i]['status'] = 'Potential Customer';
            }
            if ($c->status == 2) {
                $clients[$i]['status'] = 'Customer';
            }
        }
        return response()->json([
            'clients' => $clients
        ]);
    }
}
