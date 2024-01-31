<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Lead;
use App\Models\Fblead;
use App\Models\Client;
use App\Models\Contract;
use App\Models\Job;
use App\Models\Offer;
use App\Models\TextResponse;
use App\Models\WebhookResponse;
use App\Models\WhatsappLastReply;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Helper;
use Illuminate\Support\Facades\Auth;
use Monolog\Processor\WebProcessor;

class LeadWebhookController extends Controller
{
    public function saveLead(Request $request)
    {
        $challenge = $request->hub_challenge;
        if (!empty($challenge)) {

            $verify_token = $request->hub_verify_token;
            if ($verify_token === env('FB_WEBHOOK_TOKEN')) {
                Fblead::create(["challenge" => $challenge]);
                return $challenge;
            }
        } else {

            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'phone'     => ['required'],
                'email'     => ['required'],
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->messages()]);
            }

            $lead_exists = Client::where('phone', $request->phone)->orWhere('email', $request->email)->exists();
            if (!$lead_exists) {
                $lead                = new Client;
            } else {
                $lead = Client::where('phone', 'like', '%' . $request->phone . '%')->first();
                if (empty($lead)) {
                    $lead = Client::where('email', $request->email)->first();
                }
                $lead                = Client::find($lead->id);
            }
            $nm = explode(' ', $request->name);

            $lead->firstname     = $nm[0];
            $lead->lastname     = (isset($nm[1])) ? $nm[1] : '';
            $lead->phone         = $request->phone;
            $lead->email         = $request->email;
            $lead->status        = 0;
            $lead->password      = Hash::make($request->phone);
            $lead->geo_address   = $request->has('address') ? $request->address : '';
            $lead->save();

            $result = Helper::sendWhatsappMessage($lead->phone, 'leads', array('name' => ucfirst($lead->firstname)));

            $_msg = TextResponse::where('status', '1')->where('keyword', 'main_menu')->get()->first();

            $response = WebhookResponse::create([
                'status'        => 1,
                'name'          => 'whatsapp',
                'message'       =>  $_msg->heb,
                'number'        =>  $request->phone,
                'read'          =>  1,
                'flex'          => 'A',
            ]);
        }
        return response()->json([
            'message'       => $lead,
        ], 200);
    }

    public function contain_phone($str)
    {

        $nums  = "";
        for ($i = 0; $i < strlen($str); $i++) {
            if (ctype_digit($str[$i])) {
                $nums .= $str[$i];
            }
        }
        return ($nums != "" && strlen($nums) > 8) ? true : false;
    }
    public function fbWebhook(Request $request)
    {

        $challenge = $request->hub_challenge;

        if (!empty($challenge)) {

            $verify_token = $request->hub_verify_token;

            if ($verify_token === env('FB_WEBHOOK_TOKEN')) {

                Fblead::create(["challenge" => $challenge]);
                return $challenge;
            }
        } else {
            $get_data = $request->getContent();

            Log::info($get_data);
            $get_data = json_decode($get_data, true);

            $data_returned = $get_data['entry'][0]['changes'][0]['value'];

            $message_data =  $data_returned['messages'];
            $from      = $message_data[0]['from'];

            $check_response = WebhookResponse::where('number', $from)->get()->first();

            $response = WebhookResponse::create([
                'status'        => 1,
                'name'          => 'whatsapp',
                'entry_id'      => (isset($get_data['entry'][0])) ? $get_data['entry'][0]['id'] : '',
                'message'       => $data_returned['messages'][0]['text']['body'],
                'number'        => $from,
                'read'          => 0,
                'flex'          => 'C',
                'data'          => json_encode($get_data)
            ]);

            $client_exist = Client::where('phone', '%' . $from . '%')->get()->first();

            if (is_null($client_exist) && is_null($check_response)) {

                $result = Helper::sendWhatsappMessage($from, 'leads', array('name' => ''));

                $_msg = TextResponse::where('status', '1')->where('keyword', 'main_menu')->get()->first();

                $response = WebhookResponse::create([
                    'status'        => 1,
                    'name'          => 'whatsapp',
                    'message'       =>  $_msg->heb,
                    'number'        =>  $from,
                    'read'          => 1,
                    'flex'          => 'A',
                ]);

                $lead                = new Client;
                $lead->firstname     = 'lead';
                $lead->lastname      = '';
                $lead->phone         =  $from;
                $lead->email         = $from.'@lead.com';
                $lead->status        = 3;
                $lead->password      = Hash::make($from);
                $lead->geo_address   = '';
                $lead->save();

                die('Template send to new client');
            }

            if (isset($data_returned) && isset($data_returned['messages']) && is_array($data_returned['messages'])) {


                $to      = $data_returned['metadata']['display_phone_number'];
                $to_name      = $data_returned['contacts'][0]['profile']['name'];
                $n_f = false;
                $message =  ($message_data[0]['type'] == 'text') ? $message_data[0]['text']['body'] : $message_data[0]['button']['text'];

                $result = DB::table('whatsapp_last_replies')->where('phone', '=', $from)->whereRaw('updated_at >= now() - interval 15 minute')->first();


                if ($message == '0') {

                    $last = WebhookResponse::where('number', $from)->where('message', '!=', '0')->orderBy('created_at', 'desc')->skip(1)->take(1)->get()->first();
                    $n_f = true;
                    $message = $last->message;
                }

                if (str_contains($message, 'yes') || str_contains($message, 'כן')) {

                    $last = WebhookResponse::where('number', $from)->where('message', '!=', '0')->orderBy('created_at', 'desc')->skip(1)->take(1)->get()->first();
                    $ch   = TextResponse::where('eng', $last->mesage)->where('heb', $last->message)->get()->first();
                    if ($last->message == '3') {
                        $message = 'yes_כן';
                    } else if (!is_null($ch)) {
                        $n_f = true;
                        $message = $last->message;
                    }
                }

                if ($message == '6') {

                    if (strlen($from) > 10) {
                        Client::where('phone', 'like', '%' . substr($from, 2) . '%')->update(['lng' => 'en']);
                    } else {
                        Client::where('phone', 'like', '%' . $from . '%')->update(['lng' => 'en']);
                    }
                }

                if ($message == '7') {

                    if (strlen($from) > 10) {
                        Client::where('phone', 'like', '%' . substr($from, 2) . '%')->update(['lng' => 'heb']);
                    } else {
                        Client::where('phone', 'like', '%' . $from . '%')->update(['lng' => 'heb']);
                    }
                    $result = Helper::sendWhatsappMessage($from, 'leads', array('name' => ''));

                    $_msg = TextResponse::where('status', '1')->where('keyword', 'main_menu')->get()->first();

                    $response = WebhookResponse::create([
                        'status'        => 1,
                        'name'          => 'whatsapp',
                        'message'       =>  $_msg->heb,
                        'number'        =>  $from,
                        'read'          => 1,
                        'flex'          => 'A',
                    ]);

                    die("Language switched to hebrew");
                }

                if (strlen($from) > 10)
                    $client  = Client::where('phone', 'like', '%' . substr($from, 2) . '%')->get()->first();
                else
                    $client  = Client::where('phone', 'like', '%' . $from . '%')->get()->first();



                if ($message == '' || $from == '') {
                    return 'Destination or Sender number and message value required';
                }

                $auth_id = null;
                $auth_check = false;
                if (str_contains($message, '@')) {

                    $auth = Client::where('email', $message)->get()->first();
                    $auth_id = (!is_null($auth)) ? $auth->id : '';
                    $auth_check = true;
                }
                if (is_numeric(str_replace('-', '', $message)) && strlen($message) > 5) {

                    $auth = Client::where('phone', 'like', '%' . $message . '%')->get()->first();
                    $auth_id = (!is_null($auth)) ? $auth->id : '';
                    $auth_check = true;
                }


                $link_for = '';
                $link_data = [];
                $last_reply = '';
                if (!empty($result)) {
                    $last_reply = $result->message;

                    if ((is_numeric(str_replace('-', '', $last_reply)) && strlen($last_reply) > 5) || str_contains($last_reply, '@')) {
                        $last_reply = 41;
                    }

                    if ($last_reply == 41 && $message == '1') {
                        $message = $last_reply . '_1';
                        $link_for = 'offer';
                        if (!is_null($client)) {
                            $ofrs = Offer::where('client_id', $client->id)->get();
                            if (count($ofrs) > 0) {
                                foreach ($ofrs as $ofr) {
                                    $link_data[] = base64_encode($ofr->id);
                                }
                            }
                        }
                    }
                    if ($last_reply == 41 && $message == '2') {
                        $message = $last_reply . '_2';
                        $link_for = 'contract';
                        if (!is_null($client)) {
                            $cncs = Contract::where('client_id', $client->id)->get();
                            if (count($cncs) > 0) {
                                foreach ($cncs as $cn) {
                                    $link_data[] = ($cn->unique_hash);
                                }
                            }
                        }
                    }
                    if ($last_reply == 41 && $message == '3') {
                        $message = $last_reply . '_3';
                        $link_for = 'jobs';
                        if (!is_null($client)) {
                            $jobs = Job::where('client_id', $client->id)->where('start_date', '>', Carbon::now())->get();
                            if (count($jobs) > 0) {
                                foreach ($jobs as $j) {
                                    $link_data[] = base64_encode($j->id);
                                }
                            }
                        }
                    }

                    if ($last_reply == 41 && $message == '4') {
                        $message = $last_reply . '_4';
                    }
                    if ($last_reply == 41 && $message == '5') {
                        $message = $last_reply . '_5';
                    }
                    if ($last_reply == 41 && $message == '6') {
                        $message = $last_reply . '_6';
                    }
                    $reply = WhatsappLastReply::find($result->id);
                    $reply->phone = $from;
                    $reply->message = $message;
                    $reply->updated_at = now();
                    $reply->save();
                    $message = $reply->message;
                } else {
                    DB::table('whatsapp_last_replies')->where('phone', '=', $from)->delete();
                    $reply = new WhatsappLastReply;
                    $reply->phone = $from;
                    $reply->message = $message;
                    $reply->save();
                }
          

                if (count($link_data) > 0) {
                    $message = '';
                    $n_f = true;
                    $prefix = ($link_for == 'offer') ? url('/') . '/price-offer/' : (($link_for == 'contract') ? url('/') . '/work-contract/' : url('/') . '/client/view-job/');
                    foreach ($link_data as $ld) {
                        $message .= $prefix . $ld . "\n";
                    }

                    $_merge = TextResponse::where('status', '1')->where('keyword', 'anything')->get()->first();
                    if (!is_null($_merge)) {

                        if (!is_null($client) && $client->lng == 'en') {
                            $merge =  $_merge->eng;
                        } else {
                            $merge =  $_merge->heb;
                        }
                    }
                    $message .= $merge;
                }


                if ($message == '41_1' || $message == '41_2' || $message == '41_3') {
                    $n_f = true;
                }


                $message = match ($message) {
                    '41_1' => !is_null($client) && $client->lng == 'en' ? "No quote found. \n press 9 for main menu 0 for back." : "לא נמצא ציטוט. \n הקש 9 לתפריט הראשי 0 לחזרה.",
                    '41_2' => !is_null($client) && $client->lng == 'en' ? "No contract found. \n press 9 for main menu 0 for back." : "לא נמצא חוזה. \n הקש 9 לתפריט הראשי 0 לחזרה.",
                    '41_3' => !is_null($client)  &&  $client->lng == 'en' ? "No next service found. \n press 9 for main menu 0 for back." : "לא נמצא השירות הבא. \n הקש 9 לתפריט הראשי 0 לחזרה.",
                    default => $message
                };

                if ($last_reply == '3' && !is_null($client) && $this->contain_phone($message)) {

                    $exm = explode(PHP_EOL, $message);
                    $nm = explode(' ', $exm[0]);

                    $lead                = Client::find($client->id);
                    $lead->firstname     =  $nm[0];
                    $lead->lastname      = (isset($nm[1])) ? $nm[1] : '';
                    $lead->phone         =  $from;
                    $lead->email         = 'NULL';
                    $lead->status        = 0;
                    $lead->password      = Hash::make($from);
                    $lead->geo_address   = isset($exm[2]) ? $exm[2] : '';
                    $lead->save();

                    $message = '3_r';
                }


                if ($auth_check == true && ($auth_id) != '') {


                    $_response = TextResponse::where('status', '1')->where('keyword', '4_r')->get()->first();
                    if (!is_null($_response)) {

                        if (!is_null($client) && $client->lng == 'en') {
                            $response =  $_response->eng;
                        } else {
                            $response =  $_response->heb;
                        }

                        WebhookResponse::create([
                            'status'        => 1,
                            'name'          => 'whatsapp',
                            'entry_id'      => (isset($get_data['entry'][0])) ? $get_data['entry'][0]['id'] : '',
                            'message'       => $response,
                            'number'        => $from,
                            'flex'          => 'A',
                            'read'          => 1,
                            'data'          => json_encode($get_data)
                        ]);


                        $result = Helper::sendWhatsappMessage($from, '', array('message' => $response));
                    }
                } else if ($auth_check == true && ($auth_id) == '') {

                    $_response = TextResponse::where('status', '1')->where('keyword', 'no_auth')->get()->first();

                    if (!is_null($_response)) {

                        if (!is_null($client) && $client->lng == 'en') {
                            $response =  $_response->eng;
                        } else {
                            $response =  $_response->heb;
                        }
                    }

                    WebhookResponse::create([
                        'status'        => 1,
                        'name'          => 'whatsapp',
                        'entry_id'      => (isset($get_data['entry'][0])) ? $get_data['entry'][0]['id'] : '',
                        'message'       => $response,
                        'number'        => $from,
                        'flex'          => 'A',
                        'read'          => 1,
                        'data'          => json_encode($get_data)
                    ]);


                    $result = Helper::sendWhatsappMessage($from, '', array('message' => $response));
                } else {


                    $_response = TextResponse::where('status', '1')->where('keyword', 'like', '%' . $message . '%')->get()->first();

                    if (!is_null($_response)) {

                        if (!is_null($client) && $client->lng == 'en') {
                            $response =  $_response->eng;
                        } else {
                            $response =  $_response->heb;
                        }

                        WebhookResponse::create([
                            'status'        => 1,
                            'name'          => 'whatsapp',
                            'entry_id'      => (isset($get_data['entry'][0])) ? $get_data['entry'][0]['id'] : '',
                            'message'       => $response,
                            'number'        => $from,
                            'flex'          => 'A',
                            'read'          => 1,
                            'data'          => json_encode($get_data)
                        ]);


                        $result = Helper::sendWhatsappMessage($from, '', array('message' => $response));
                    } else if ($n_f == true) {

                        $response = $message;

                        WebhookResponse::create([
                            'status'        => 1,
                            'name'          => 'whatsapp',
                            'entry_id'      => (isset($get_data['entry'][0])) ? $get_data['entry'][0]['id'] : '',
                            'message'       => $response,
                            'number'        => $from,
                            'flex'          => 'A',
                            'read'          => 1,
                            'data'          => json_encode($get_data)
                        ]);


                        $result = Helper::sendWhatsappMessage($from, '', array('message' => $response));
                    }
                }
            }



            die('sent');
        }
    }
}
