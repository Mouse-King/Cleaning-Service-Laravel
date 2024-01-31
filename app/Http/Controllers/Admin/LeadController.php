<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\Lead;
use App\Models\Client;
use App\Models\LeadComment;
use App\Models\LeadStatus;
use App\Models\Offer;
use App\Models\Schedule;
use App\Models\WebhookResponse;
use App\Models\WhatsappLastReply;
use Illuminate\Support\Facades\Hash;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public $fburl = 'https://graph.facebook.com/v17.0/';
    public $fbleads = [];
    public $pa_token;

    public function index(Request $request)
    {
        $q = $request->q;
        $c = $request->condition;

        $result = Client::with('meetings', 'offers')->with('lead_status');

        if (!is_null($q) &&  ($q !== 1 && $q !== 0 && $q != 'all') && $c != 'filter') {

            $result->where(function ($query) use ($q) {
                $ex = explode(' ', $q);
                $q2 = isset($ex[1]) ? $ex[1] : $q;
                $query->where('email',       'like', '%' . $q . '%')
                    ->orWhere('firstname',       'like', '%' . $ex[0] . '%')
                    ->orWhere('lastname',       'like', '%' . $q2 . '%')
                    ->orWhere('phone',       'like', '%' . $q . '%');
            });
        }


        if (!is_null($q) &&  ($q == 1 || $q == 0)) {

            $result->where('status', $q);
        } else if (is_null($q)) {

            $result->where('status', 0)->orWhere('status', 1);
        }

        if ($q == 'pending') {

            $result = $result->WhereHas('lead_status', function ($q) {
                $q->where(function ($q) {
                    $q->where('lead_status', 'Pending');
                });
            })->orWhereDoesntHave('lead_status');
        }

        if ($q == 'set') {

            $result = $result->WhereHas('lead_status', function ($q) {
                $q->where(function ($q) {
                    $q->where('lead_status', 'Meeting Set');
                });
            });
        }

        if ($q == 'offersend') {

            $result = $result->WhereHas('lead_status', function ($q) {
                $q->where(function ($q) {
                    $q->where('lead_status', 'Offer Sent');
                });
            });
        }

        if ($q == 'offerdecline') {

            $result = $result->WhereHas('lead_status', function ($q) {
                $q->where(function ($q) {
                    $q->where('lead_status', 'Offer Rejected');
                });
            });
        }

        $result = $result->where('status', '!=', 2);

        if ($q == 'uninterested') {

            $result = $result->WhereHas('lead_status', function ($q) {
                $q->where(function ($q) {
                    $q->where('lead_status', 'Uninterested');
                });
            });
        }
        $result = $result->orderBy('id', 'desc')->paginate(20);

        return response()->json([
            'leads'       => $result,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'phone'     => ['required'],
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:clients'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }

        $lead                = new Client;
        $lead->firstname     = $request->firstname;
        $lead->firstname     = $request->lastname;
        $lead->phone         = $request->phone;
        $lead->email         = $request->email;
        $lead->geo_address   = $request->address;
        $lead->status        = 0;
        $lead->password      = Hash::make($request->phone);
        $lead->extra         = $request->meta;
        $lead->save();

        LeadStatus::UpdateOrCreate(
            [
                'client_id' => $lead->id
            ],
            [
                'client_id' => $lead->id,
                'lead_status' => 'Pending'
            ]
        );

        return response()->json([
            'message'       => 'Lead created successfully',
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $lead                = Client::find($id);
        $lead->lead_status   = $request->lead_status;
        $lead->save();
        return response()->json([
            'message'        => 'status updated',
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
        $lead                = Client::with('offers', 'meetings', 'lead_status')->find($id);

        if (!empty($lead)) {

            $offer = Offer::where('client_id', $id)->get()->last();
            $lead->latest_offer = $offer;

            $meeting = Schedule::where('client_id', $id)->get()->last();
            $lead->latest_meeting = $meeting;

            $reply  = ($lead->phone != NULL && $lead->phone != '' && $lead->phone != 0) ?
                WhatsappLastReply::where('phone', 'like', '%' . $lead->phone . '%')

                ->get()->first() : null;

            $_first_contact  = ($lead->phone != NULL && $lead->phone != '' && $lead->phone != 0) ?
                WebhookResponse::where('number', 'like', '%' . $lead->phone . '%')->where('flex', 'C')

                ->get()->first() : null;

            if (!empty($reply)) {

                if ($reply->message < 2)
                    $reply->msg = WebhookResponse::getWhatsappMessage('message_' . $reply->message, 'heb', $lead);
                else
                    $reply->msg = $reply->message;
            }

            $lead->reply = $reply;
            $lead->first_contact = $_first_contact;
        }
        return response()->json([
            'lead'        => $lead,
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
        $validator = Validator::make($request->all(), [
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'phone'     => ['required'],
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:clients,email,' . $id],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }

        $lead                = Client::find($id);
        $lead->firstname     = $request->firstname;
        $lead->lastname      = $request->lastname;
        $lead->phone         = $request->phone;
        $lead->email         = $request->email;
        $lead->geo_address   = $request->address;
        $lead->status        = 0;
        $lead->password      = Hash::make($request->phone);
        $lead->extra         = $request->meta;
        $lead->save();

        return response()->json([
            'message'       => 'Lead updated successfully',
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
            'message'     => "Lead has been deleted"
        ], 200);
    }
    public function updateStatus(Request $request, $id)
    {

        return response()->json([
            'message'        => 'status updated',
        ], 200);
    }
    public function addComment(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'comment'     => 'required',
            'lead_id'  => 'required',
            'team_id'  => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }
        LeadComment::create([
            'comment'   => $request->comment,
            'lead_id' => $request->lead_id,
            'team_id' => $request->team_id
        ]);
        return response()->json(['message' => 'comment added']);
    }

    public function getComments(Request $request)
    {
        $comments = LeadComment::where('lead_id', $request->id)->with('team')->get();
        return response()->json(['comments' => $comments]);
    }

    public function deleteComment(Request $request)
    {
        LeadComment::where(['id' => $request->id])->delete();
        return response()->json(['message' => 'comment deleted']);
    }

    public function uninterested($id)
    {

        LeadStatus::UpdateOrCreate(
            [
                'client_id' => $id
            ],
            [
                'client_id'   => $id,
                'lead_status' => 'Uninterested'
            ]
        );
        return response()->json(['message' => 'Marked Uninterested']);
    }

    /* FB ADS LEADS */


    public function longLivedToken()
    {
        $url = $this->fburl . 'oauth/access_token?grant_type=fb_exchange_token&client_id=' . env("FB_APP_ID") . '&client_secret=' . env("FB_APP_SECRET") . '&fb_exchange_token=' . env('FB_ACCESS_TOKEN');
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            return  'Error:' . curl_error($ch);
        }
        curl_close($ch);
        $result = json_decode($result);
        if (isset($result->error)) {
            return $result->error->message;
        }
        return $result->access_token;
    }


    public function pageAccessToken()
    {

        $url = $this->fburl . env('FB_APP_SCOPE_ID') . '/accounts?access_token=' .  env('FB_ACCESS_TOKEN');

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($ch);
        curl_close($ch);
        $result = json_decode($result);
        if (isset($result->error)) {
            return $result->error->message;
        }
        if (count($result->data) > 0) :
            foreach ($result->data as $r) :
                if ($r->id == env('FB_ACCOUNT_ID')) :
                    return $r->access_token;
                endif;
            endforeach;
        endif;
    }

    public function leadGenForms()
    {
        $pa_token =  $this->pageAccessToken();
        $this->pa_token =  $pa_token;
        $url = $this->fburl . env('FB_ACCOUNT_ID') . '/leadgen_forms?access_token=' . $pa_token . '&pretty=0&limit=2500';

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            return  'Error:' . curl_error($ch);
        }
      
        $result = json_decode($result);
 
        if (isset($result->error)) {
            return $result->error->message;
        }

        return $result;
    }

    public function leadData($id)
    {
        $ch = curl_init();
        $url = $this->fburl . $id . '/leads?access_token=' . $this->pa_token;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($ch);
        $result = json_decode($result);

        if (isset($result->error)) {
            return $result->error->message;
        }
        if( isset($result->data) && count($result->data) > 0 )
        {
           
          $_fd = $result->data[0]->field_data;
          foreach($_fd as $fd){
            echo "<pre>";
            print_r($fd);
          }

          dd(1);
         
        }
        return $result;
    }
    public function fbAdsLead()
    {
        $leadForms = $this->leadGenForms();
       
        if (count($leadForms->data) > 0) {
            foreach ($leadForms->data as $lf) {
                dd($this->leadData($lf->id));
            }
        }
    }
}
