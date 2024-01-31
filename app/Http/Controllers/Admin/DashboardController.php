<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\User;
use App\Models\Client;
use App\Models\Offer;
use App\Models\Schedule;
use App\Models\Contract;
use App\Models\notifications;
use App\Models\Admin;
use App\Models\Fblead;
use App\Models\Services;
use App\Models\JobService;
use App\Models\LeadStatus;
use App\Models\serviceSchedules;
use App\Models\ManageTime;
use App\Models\WebhookResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Helper;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
  public function dashboard()
  {

    $total_workers   = User::all()->count();
    $total_clients   = Client::all()->count();
    $total_jobs      = Job::count();
    $total_offers    = Offer::count();
    $total_schedules  = Schedule::count();
    $total_contracts  = Contract::count();
    $latest_jobs     = Job::with('client', 'service', 'worker', 'jobservice')->where('status', 'completed')->orderBy('created_at', 'desc')->paginate(5);

    return response()->json([
      'total_workers'      => $total_workers,
      'total_clients'      => $total_clients,
      'total_jobs'         => $total_jobs,
      'total_offers'       => $total_offers,
      'total_schedules'    => $total_schedules,
      'total_contracts'    => $total_contracts,
      'latest_jobs'        => $latest_jobs
    ], 200);
  }

  public function updateTime(Request $request)
  {

    $validator = Validator::make($request->all(), [
      'start_time' => 'required',
      'end_time'  => 'required',
    ]);
    if ($validator->fails()) {
      return response()->json(['errors' => $validator->messages()]);
    }
    ManageTime::where('id', 1)->update([
      'start_time' => $request->start_time,
      'end_time'   => $request->end_time,
      'days'       => $request->days
    ]);
    return response()->json(['message' => 'Time update successfully']);
  }

  public function getTime()
  {
    $time  = ManageTime::where('id', 1)->get();
    return response()->json([
      'time' => $time
    ]);
  }


  public function Notice(Request $request)
  {

    $count = notifications::count();
    $seenCount = notifications::where('seen', 0)->count();
    if ($count > 0) :

      if ($request->head)
        $noticeAll = notifications::with('client')->orderBy('id', 'desc')->take(5)->get();
      if ($request->all)
        $noticeAll = notifications::with('client')->orderBy('id', 'desc')->paginate(15);

      if (isset($noticeAll)) {
        foreach ($noticeAll as $k => $notice) {

          if ($notice->type == 'sent-meeting') {

            $sch = Schedule::with('client')->where('id', $notice->meet_id)->get()->first();
            if (isset($sch))
              $noticeAll[$k]->data = "<a href='/admin/view-schedule/" . $sch->client->id . "?sid=" . $sch->id . "'> Meeting </a> scheduled with <a href='/admin/view-client/" . $sch->client->id . "'>" . $sch->client->firstname . " " . $sch->client->lastname .
                "</a> on " . Carbon::parse($sch->start_date)->format('d-m-Y') . " at " . ($sch->start_time);
          }
          if ($notice->type == 'accept-meeting') {

            $sch = Schedule::with('client')->where('id', $notice->meet_id)->get()->first();
            if (isset($sch))
              $noticeAll[$k]->data = "<a href='/admin/view-schedule/" . $notice->client->id . "?sid=" . $sch->id . "'> Meeting </a> with <a href='/admin/view-client/" . $sch->client->id . "'>" . $sch->client->firstname . " " . $sch->client->lastname .
                "</a> has been confirmed now on " . Carbon::parse($sch->start_date)->format('d-m-Y')  . " at " . ($sch->start_time);
          }
          if ($notice->type == 'reject-meeting') {

            $sch = Schedule::with('client')->where('id', $notice->meet_id)->get()->first();
            if (isset($sch))
              $noticeAll[$k]->data = "<a href='/admin/view-schedule/" . $notice->meet_id . "?sid=" . $sch->id . "'> Meeting </a> with <a href='/admin/view-client/" . $sch->client->id . "'>" . $sch->client->firstname . " " . $sch->client->lastname .
                "</a> which on " . Carbon::parse($sch->start_date)->format('d-m-Y')  . " at " . ($sch->start_time) . " has cancelled now.";
          }

          if ($notice->type == 'accept-offer') {

            $ofr = Offer::with('client')->where('id', $notice->offer_id)->get()->first();
            if (isset($ofr))
              $noticeAll[$k]->data = "<a href='/admin/view-client/" . $ofr->client->id . "'>" . $ofr->client->firstname . " " . $ofr->client->lastname .
                "</a> has accepted the <a href='/admin/view-offer/" . $notice->offer_id . "'> price offer </a>";
          }

          if ($notice->type == 'reject-offer') {

            $ofr = Offer::with('client')->where('id', $notice->offer_id)->get()->first();
            if (isset($ofr))
              $noticeAll[$k]->data = "<a href='/admin/view-client/" . $ofr->client->id . "'>" . $ofr->client->firstname . " " . $ofr->client->lastname .
                "</a> has rejected <a href='/admin/view-offer/" . $notice->offer_id . "'>the price offer </a>";
          }

          if ($notice->type == 'contract-accept') {

            $contract = Contract::with('offer', 'client')->where('id', $notice->contract_id)->get()->first();
            if (isset($contract)) :
              $noticeAll[$k]->data = "<a href='/admin/view-client/" . $contract->client->id . "'>" . $contract->client->firstname . " " . $contract->client->lastname .
                "</a> has approved the <a href='/admin/view-contract/" . $contract->id . "'> contract </a>";
              if ($contract->offer) {
                $noticeAll[$k]->data .= "for <a href='/admin/view-offer/" . $contract->offer->id . "'> offer</a>";
              }
            endif;
          }

          if ($notice->type == 'contract-reject') {

            $contract = Contract::with('offer', 'client')->where('id', $notice->contract_id)->get()->first();
            if (isset($contract)) :
              $noticeAll[$k]->data = "<a href='/admin/view-client/" . $contract->client->id . "'>" . $contract->client->firstname . " " . $contract->client->lastname .
                "</a> has rejected the <a href='/admin/view-contract/" . $contract->id . "'> contract </a>";
              if ($contract->offer) {
                $noticeAll[$k]->data .= "for <a href='/admin/view-offer/" . $contract->offer->id . "'> offer</a>";
              }
            endif;
          }
          if ($notice->type == 'client-cancel-job') {

            $job = Job::with('offer', 'client')->where('id', $notice->job_id)->get()->first();
            if (isset($job)) :
              $noticeAll[$k]->data = "<a href='/admin/view-client/" . $job->client->id . "'>" . $job->client->firstname . " " . $job->client->lastname .
                "</a> has cancelled the  <a href='/admin/view-job/" . $job->id . "'> job </a>";
              if ($job->offer) {
                $noticeAll[$k]->data .= "for <a href='/admin/view-offer/" . $job->offer->id . "'> offer </a> ";
              }
            endif;
          }

          if ($notice->type == 'worker-reschedule') {

            $job = Job::with('offer', 'worker')->where('id', $notice->job_id)->get()->first();
            if (isset($job)) :
              $noticeAll[$k]->data = "<a href='/admin/view-worker/" . $job->worker->id . "'>" . $job->worker->firstname . " " . $job->worker->lastname .
                "</a> request for reschedule the  <a href='/admin/view-job/" . $job->id . "'> job </a>";
            endif;
          }
        }
      }
      return response()->json([
        'notice' => $noticeAll,
        'count' => $seenCount
      ]);

    else :

      return response()->json([
        'notice' => []
      ]);

    endif;
  }
  public function viewPass(Request $request)
  {
    $user = Admin::where('id', $request->id)->get()->first();
    $response = Hash::check($request->pass, $user->password);
    return response()->json([
      'response' => $response
    ]);
  }
  public function seen()
  {
    notifications::where('seen', 0)->update(['seen' => 1]);
  }
  public function clearNotices()
  {
    notifications::truncate();
  }
  public function income(Request $request)
  {

    $tasks = Job::with('client', 'worker', 'offer', 'hours')->where('status', 'completed');
    if (empty($request->duration) || $request->duration == 'all')
      $tasks = $tasks->get();

    if ($request->duration == 'day')
      $tasks = $tasks->whereDate('created_at', Carbon::today())->get();

    if ($request->duration == 'month')
      $tasks = $tasks->whereMonth('created_at', Carbon::now()->month)->get();

    if ($request->duration == 'week')
      $tasks = $tasks->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->get();

    $inc = 0;
    if (isset($tasks)) {
      foreach ($tasks as $t1 => $task) {

        if (isset($task->hours)) {
          $tsec = 0;
          foreach ($task->hours as $t => $hour) {
            $tsec += $hour->time_diff;
          }
          $tasks[$t1]->total_sec = $tsec;
        }

        if (isset($task->offer)) {

          $inc += $task->offer->subtotal;
        }
      }
    }
    return response()->json([
      'tasks' => $tasks,
      'total_tasks' => $tasks->count(),
      'income' => $inc,
    ]);
  }

  public function pendingData($for)
  {

    if ($for == 'meetings') {
      $meetings = Schedule::where('booking_status', 'pending')->with('client', 'team')->paginate(5);
      return response()->json([
        'data' => $meetings,
      ]);
    }

    if ($for == 'offers') {
      $offers = Offer::where('status', 'sent')->with('client', 'service')->paginate(5);
      return response()->json([
        'data' => $offers,
      ]);
    }

    if ($for == 'contracts') {
      $contracts = Contract::where('status', 'un-verified')->orWhere('status', 'not-signed')->with('client', 'offer')->paginate(5);
      return response()->json([
        'data' => $contracts,
      ]);
    }
  }

  public function import()
  {
    die('DIE Apply');
    $csvFile = fopen(storage_path() . '/app/public/Broom Service - jobs.csv', 'r');
    fgetcsv($csvFile);
    $csv = [];
    while (($csvData = fgetcsv($csvFile)) !== FALSE) {
      $row = array_map("utf8_encode", $csvData);
      $csv[$row[0]][$row[2]][] = $row;
    }

    if (!empty($csv)) {
      foreach ($csv as $cid => $csr) {

        $total = 0;
        $servAr = [];
        $oid = [];
        $coid = [];

        $client  = Client::where('id', $cid)->get()->first();
        foreach ($csr as $k => $sep) :

          $cs = $csr[$k][0];
          $serv = Services::where('id', $k)->get()->toarray();
          $serv = (!empty($serv)) ? $serv[0] : null;

          if ($serv != null) :

            $period = (substr((string)$cs[3], 0, 1) == 1) ? substr((string)$cs[3], 1)  : $cs[3];
            $freq = serviceSchedules::where('period', $period)->get()->first();

            if (!is_null($freq)) :
              $freq = $freq->toArray();
              $total += (int)$cs[5];
              $service = [
                "service" => $cs[2],
                "name" => $serv['name'],
                "type" => "fixed",
                "freq_name" => $freq['name'],
                "frequency" => $freq['id'],
                "fixed_price" => $cs[5],
                "jobHours" => $cs[6],
                "rateperhour" => "",
                "other_title" => "",
                "totalamount" => $cs[5],
                "template" => $serv['template'],
                "cycle" => $freq['cycle'],
                "period" => $cs[3]
              ];
              $servAr[] = $service;

            endif;
          endif;

        endforeach;

        $tax = (17 / 100) * $total;
        $ofr = [

          'client_id' => $cid,
          'services' => json_encode($servAr),
          'subtotal' => $total,
          'total' => $total + $tax,
          'status' => 'accepted'

        ];

        $offer = Offer::create($ofr);
        $oid[] = $offer->id;
        $hash = md5($client->email . $offer->id);
        $cont = [
          'offer_id' => $offer->id,
          'client_id' => $cid,
          'unique_hash' => $hash,
          'status' => 'verified',
        ];

        $contract = Contract::create($cont);
        $coid[] = $contract->id;

        foreach ($csr as $i => $ncs1) :
          foreach ($ncs1 as $ncs) :

            $count = 1;
            if (str_contains($ncs[3], 'w')) {
              $count = 3;
            }
            for ($a = 1; $a <= $count; $a++) {

              $date = Carbon::createFromDate($ncs[4]);
              $j = 0;
              if ($a == 2) {
                $j = 7;
              }
              if ($a == 3) {
                $j = 14;
              }
              $job_date = $date->addDays($j)->toDateString();

              $d =
                $jobA = [

                  'client_id' => $cid,
                  'offer_id' => $oid[0],
                  'contract_id' => $coid[0],
                  'worker_id' => $ncs[1],
                  'start_date' => $job_date,
                  'schedule_id' => $ncs[2],
                  'schedule' => $ncs[3],
                  'shifts' => str_replace('/', ',', $ncs[7]),
                  'status' => 'scheduled'

                ];

              $job = Job::create($jobA);

              $period = (substr((string)$ncs[3], 0, 1) == 1) ? substr((string)$ncs[3], 1)  : $ncs[3];
              $freq = serviceSchedules::where('period', $period)->get()->first();
              if (!is_null($freq)) :
                $freq = $freq->toArray();
                $s = Services::where('id', $ncs[2])->get()->first();

                preg_match_all('!\d+!', $ncs[3], $cycle);

                $jh = new JobService();
                $jh->job_id = $job->id;
                $jh->name = $s->name;
                $jh->job_hour = $ncs[6];
                $jh->freq_name = $freq['name'];
                $jh->cycle = $freq['cycle'];
                $jh->period = $period;
                $jh->total = $ncs[5];
                $jh->heb_name = $s->heb_name;
                $jh->service_id = $ncs[2];

                $jh->save();
              endif;
            }

          endforeach;
        endforeach;
      }
      echo "Record Created";
    }
  }

  public function updateClients(Request $request)
  {
    $clients = Client::with('meetings', 'offers', 'contract', 'jobs')->get();
    $q = $request->q;

    //Meetings
    if (!is_null($q) && $q == 'meetings') {

      foreach ($clients as $c) {


        $meet  = Schedule::where('client_id', $c->id)->get()->last();
        if (isset($meet)) {

          $mstat =  $meet->booking_status;

          LeadStatus::updateOrCreate(
            [
              'client_id' => $c->id
            ],
            [
              'client_id' => $c->id,
              'lead_status' => ($mstat == 'confirmed') ? 'Meeting Set' : ($mstat == 'rescheduled' ? 'Meeting Rescheduled' : ($mstat == 'pending' ? 'Meeting pending' : 'Meeting Rejected'))
            ]

          );
        }
      }
      echo "Updated client metings lead status";
    }

    //Offers 
    if (!is_null($q) && $q == 'offers') {

      foreach ($clients as $c) {


        $_ofr  = Offer::where('client_id', $c->id)->get()->last();
        if (isset($_ofr)) {

          $ostat =  $_ofr->status;

          LeadStatus::updateOrCreate(
            [
              'client_id' => $c->id
            ],
            [
              'client_id' => $c->id,
              'lead_status' => ($ostat == 'sent') ? 'Offer Sent' : ($ostat == 'accepted' ? 'Offer Accepted' :  'Offer Rejected')
            ]

          );
        }
      }
      echo "Updated client offers lead status";
    }

    //Offers 
    if (!is_null($q) && $q == 'contracts') {

      foreach ($clients as $c) {


        $_cn  = Contract::where('client_id', $c->id)->get()->last();
        if (isset($_cn)) {

          $cstat =  $_cn->status;

          if ($cstat != 'not-signed') {

            LeadStatus::updateOrCreate(
              [
                'client_id' => $c->id
              ],
              [
                'client_id' => $c->id,
                'lead_status' => ($cstat == 'verified') ? 'Contract Verified' : ($cstat == 'un-verified' ? 'Contract Unverified' :  'Contract Rejected')
              ]

            );
          }
        }
      }
      echo "Updated client contracts lead status";
    }
  }
 
}
