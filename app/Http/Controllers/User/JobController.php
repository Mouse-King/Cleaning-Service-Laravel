<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Admin;
use App\Models\ClientCard;
use App\Models\User;
use App\Models\Contract;
use App\Models\serviceSchedules;
use App\Models\WorkerAvialibilty;
use App\Models\JobHours;
use App\Models\JobService;
use App\Models\Order;
use App\Models\Invoices;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Mail;
use Helper;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {   

        
        $w = $request->filter_week;
       
        $jobs = Job::with('worker', 'client','offer','jobservice')->where('worker_id',$request->id);

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
       
        } else{
            $jobs = $jobs->whereDate('start_date','>=',$startDate);
            $jobs = $jobs->whereDate('start_date','<=',$endDate);
            $pcount = Job::count();
            $jobs = $jobs->orderBy('created_at', 'desc')->paginate($pcount);
        }

        
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
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $job                = Job::with('client','worker','service','offer','jobservice')->find($id);

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
         $job = Job::with('client','worker','jobservice')->find($id);
         //$this->invoice($id);
         $job->status ='completed';
         $job->save();
          $admin = Admin::find(1)->first();
             \App::setLocale('en');
             $data = array(
                'email'      =>$admin->email,
                'admin'      =>$admin->toArray(),
                'job'        => $job->toArray(),

             );

             Mail::send('/WorkerPanelMail/JobStatusNotification',$data,function($messages) use ($data){
                $messages->to($data['email']);
                $sub = __('mail.job_status.subject');
                $messages->subject($sub);
              });

        return response()->json([
            'message'        => 'job completed',            
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
       
    }
    public function getWorkerAvailability($id){
         $worker_availabilities = WorkerAvialibilty::where('user_id',$id)
                             ->orderBy('id', 'asc')
                             ->get();
            $new_array=array();
            foreach($worker_availabilities as $w_a){
                 $new_array[$w_a->date]=$w_a->working;
            }

           return response()->json([
            'availability'     => $new_array,         
           ], 200);
    }
    public function updateAvailability(Request $request,$id){
        WorkerAvialibilty::where('user_id',$id)->delete();
        foreach($request->data as $key=>$availabilty){
           $avl = new WorkerAvialibilty;
           $avl->user_id=$id;
           $avl->date=trim($key);
           $avl->working=$availabilty;
           $avl->status='1';
           $avl->save();
        }
        return response()->json([
            'message'     => 'Updated Successfully',         
        ], 200);
    }
    public function JobStartTime(Request $request){
        $job = Job::find($request->job_id);
        if($job->status != 'progress'){
            $job->status = 'progress';
            $job->save();
        }
        $time = new JobHours();
        $time->job_id=$request->job_id;
        $time->worker_id=$request->worker_id;
        $time->start_time=$request->start_time;
        $time->save();
        return response()->json([
            'message'     => 'Updated Successfully',         
        ], 200);
    }
    public function JobEndTime(Request $request){
        $time = JobHours::find($request->id);
        $time->end_time=$request->end_time;
        $time->time_diff=$request->time_diff;
        $time->save();
        return response()->json([
            'message'     => 'Updated Successfully',         
        ], 200);
    }
    public function getJobTime(Request $request){
         $time = JobHours::where('job_id',$request->job_id)->where('worker_id',$request->worker_id);
         $total=0;
         if($request->filter_end_time){
            $time = $time->where('end_time',NULL)->first();
         }else{
            $time = $time->get();
            foreach($time as $t){
                if($t->time_diff){
                  $total = $total+(int)$t->time_diff;
                }
            }
         }
          return response()->json([
            'time'     => $time,
            'total'    => $total         
            ], 200);
    }


    public function jobOrderGenerate(){
      
        $jobs = Job::where(['start_date'=>Carbon::today()->format('Y-m-d'),'isOrdered'=>0])->get();
    
        $_shifts = [
            'fullday-8am-16pm'   => '08:30:00-16:00:00',
            'morning'            => '08:30:00-10:00:10',
            'morning1-8am-10am'  => '08:30:00-10:00:00',
            'morning2-10am-12pm' => '10:30:00-12:00:00',
            'morning-8am-12pm'   => '08:30:00-12:00:00',
            'noon'               => '12:30:00-14:00:00',
            'noon1-12pm-14pm'    => '12:30:00-14:00:00',
            'noon2-14pm-16pm'    => '14:30:00-16:00:00',
            'noon-12pm-16pm'     => '12:30:00-16:00:00',
            'evening'            => '16:30:00-18:00:00',
            'evening1-16pm-18pm' => '16:30:00-18:00:00',
            'evening2-18pm-20pm' => '18:30:00-20:00:00',
            'evening-16pm-20pm'  => '16:30:00-20:00:00',
            'night'              => '20:30:00-22:00:00',
            'night1-20pm-22pm'   => '20:30:00-22:00:00',
            'night2-22pm-24pm'   => '22:30:00-00:00:00',
            'night-20pm-24pm'    => '20:30:00-00:00:00',
        ];
       
        if(!empty($jobs)){
            foreach($jobs as $job){

                $t     = $_shifts[ str_replace(' ','',$job->shifts) ];
                $et    = explode('-',$t);
               
                $_start = Carbon::today()->format('Y-m-d '.$et[0]);
                $_end   = Carbon::today()->format('Y-m-d '.$et[1]);
                $_now   = Carbon::now()->format('Y-m-d H:i:s');
                
                $start  =  Carbon::createFromFormat('Y-m-d H:i:s', $_start);
                $end    =  Carbon::createFromFormat('Y-m-d H:i:s',  $_end);
                $now    =  Carbon::createFromFormat('Y-m-d H:i:s',  $_now);
                
                if( ($start->lt($now) ) && ($end->gt($now))  ){
                    $this->order($job->id);
                }
    
            }
        }

    }

   

    public function order($id){
    
        $job = Job::where('id',$id)->with('jobservice','client')->get()->first();
        $services = json_decode($job->jobservice);
        $items = []; 
        if(isset($services)){
            foreach($services as $service){
                
              $itm = [
                "description" => $service->name." - ".\Carbon\Carbon::today()->format('d, M Y'),
                "unitprice"   => $service->total,
                "quantity"    => 1,
              ];
              array_push($items,$itm);
            }
            JobService::where('id',$service->id)->update(['order_status'=>1]);
        }
     
        $invoice  = 1;
        if( str_contains($job->schedule,'w') ){ 
            $invoice = 0;
        }
        $name     =  ($job->client->invoicename != null) ? $job->client->invoicename : $job->client->firstname." ".$job->client->lastname;
        $url = "https://api.icount.co.il/api/v3.php/doc/create";
        $params = Array(

        "cid"  => env('ICOUNT_COMPANYID'),
        "user" => env('ICOUNT_USERNAME'),
        "pass" => env('ICOUNT_PASS'),
        "doctype" => "order",
        "client_name" => $name, 
        "client_address" => $job->client->geo_address,
        "email" => $job->client->email, 
        "lang" => $job->client->lng,
        "currency_code" => "ILS",
        
        "items" => $items,
    

        "send_email" => 0, 
        "email_to_client" => 0, 
        "email_to" => $job->client->email, 
        );
       

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params, null, '&'));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $response = curl_exec($ch);
            $info = curl_getinfo($ch);
         
            //if(!$info["http_code"] || $info["http_code"]!=200) die("HTTP Error");
            $json = json_decode($response, true);
           
           //if(!$json["status"]) die($json["reason"]);
           
            Order::create([
                'order_id'=>$json['docnum'],
                'doc_url' =>$json['doc_url'],
                'job_id'=>$id,
                'contract_id'=>$job->contract_id,
                'client_id'=>$job->client->id,
                'response' => $response,
                'items' => json_encode($items),
                'status' => 'Open',
                'invoice_status'=>( $invoice == 1) ? 1 : 0,
            ]);   
            Job::where('id',$id)->update(['isOrdered'=>1]);        
    }

    public function commitPayment( $services , $id, $token){

        $job = Job::where('id',$id)->with('jobservice','client','contract','order')->get()->first();
        $pitems = [];
        $subtotal = (int)$services[0]->unitprice;
        $tax = (17/100) * $subtotal;
        $total = $tax+$subtotal;

        if(!empty($services)){
            foreach($services as $service){
                $pitems[] = [
                    'ItemDescription' => $service->description,
                    'ItemQuantity'    => $service->quantity,
                    'ItemPrice'       => $total,
                    'IsTaxFree'       => "false"
                ];
               
            }
        }
        $pay_items = json_encode($pitems);

      $curl = curl_init();

      $pdata = '{
        "TerminalNumber": "'.env("ZCREDIT_TERMINALNUMBER").'",
        "Password": "'.env("ZCREDIT_TERMINALPASSWORD").'",
        "Track2": "",
        "CardNumber": "'.$token.'",
        "CVV": "",
        "ExpDate_MMYY": "",
        "TransactionSum": "'.$total.'",
        "NumberOfPayments": "1",
        "FirstPaymentSum": "0",
        "OtherPaymentsSum": "0",
        "TransactionType": "01",
        "CurrencyType": "1",
        "CreditType": "1",
        "J": "0",
        "IsCustomerPresent": "true",
        "AuthNum": "",
        "HolderID": "",
        "ExtraData": "",
        "CustomerName":"'.$job->client->firstname." ".$job->client->lastname.'",
        "CustomerAddress": "'.$job->client->geo_address.'",
        "CustomerEmail": "",
        "PhoneNumber": "",
        "ItemDescription": "",
        "ObeligoAction": "",
        "OriginalZCreditReferenceNumber": "",
        "TransactionUniqueIdForQuery": "",
        "TransactionUniqueID": "",
        "UseAdvancedDuplicatesCheck": "",
        "ZCreditInvoiceReceipt": {
          "Type": "0",
          "RecepientName": "",
          "RecepientCompanyID": "",
          "Address": "",
          "City": "",
          "ZipCode": "",
          "PhoneNum": "",
          "FaxNum": "",
          "TaxRate": "17",
          "Comment": "",
          "ReceipientEmail": "",
          "EmailDocumentToReceipient": "",
          "ReturnDocumentInResponse": "",
          "Items": '.$pay_items.'
        }
      }';
    
      curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://pci.zcredit.co.il/ZCreditWS/api/Transaction/CommitFullTransaction',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS =>$pdata,
        CURLOPT_HTTPHEADER => array(
          'Content-Type: application/json'
        ),
      ));
     
      $pre = curl_exec($curl);
      $pres = json_decode($pre);
      curl_close($curl);
      return $pres;

    }

    public function closeDoc($docnum,$type){

        $url = "https://api.icount.co.il/api/v3.php/doc/close";
        $params = Array(
    
        "cid"  => env('ICOUNT_COMPANYID'),
        "user" => env('ICOUNT_USERNAME'),
        "pass" => env('ICOUNT_PASS'),
        "doctype" => $type,
        "docnum"  => $docnum,
        "based_on"=> $docnum
        );
    
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params, null, '&'));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_exec($ch);

    }

    public function jobInvoiceGenerate(){
       
         $orders = Order::where('invoice_status',1)->orWhere('invoice_status',0)->get();
         if(!empty($orders)){
            foreach($orders as $od){
                $this->invoice($od->job_id,$od->id);
            }
         }   
           
    }

    public function invoice($id, $oid){
        
        $job = Job::where(['id'=>$id])->with('jobservice','client','contract','order')->get()->first();
        $services = json_decode($job->order->items);
        $total = 0;
          
        $p_method = $job->client->payment_method;
        $contract = $job->contract; 
        $card = ClientCard::where('client_id',$job->client_id)->get()->first();
        $doctype  = ($card != null && $card->card_token != null && $p_method == 'cc') ? "invrec" : "invoice"; 
    

        if( str_contains($job->schedule,'w') == false ) {
        
        $subtotal = (int)$services[0]->unitprice;
        $tax = (17/100) * $subtotal;
        $total = $tax+$subtotal;
      
        $order = Order::where('job_id',$id)->get()->first();
        $o_res = json_decode($order->response);
     
        $due      = \Carbon\Carbon::now()->endOfMonth()->toDateString();
        $name     =  ($job->client->invoicename != null) ? $job->client->invoicename : $job->client->firstname." ".$job->client->lastname;
        $url = "https://api.icount.co.il/api/v3.php/doc/create";
        $params = Array(

                "cid"            => env('ICOUNT_COMPANYID'),
                "user"           => env('ICOUNT_USERNAME'),
                "pass"           => env('ICOUNT_PASS'),

                "doctype"        => $doctype,
                "client_id"      => $o_res->client_id,
                "client_name"    => $name, 
                "client_address" => $job->client->geo_address,
                "email"          => $job->client->email, 
                "lang"           => $job->client->lng,
                "currency_code"  => "ILS",
                "doc_lang"       => $job->client->lng,
                "items"          => $services,
                "duedate"        => $due,
                "based_on"       =>['docnum'=>$order->order_id,'doctype'=>'order'],
                
                "send_email"      => 1, 
                "email_to_client" => 1, 
                "email_to"        => $job->client->email, 
                
        );
        if($doctype == "invrec"){

            $ex = explode('-',$card->valid);
            $cc = ['cc'=>[
                "sum" => $total,
                "card_type" => $card->card_type,
                "card_number" => substr($card->card_number,12), 
                "exp_year" => $ex[0],
                "exp_month" => $ex[1],
                "holder_id" => "",
                "holder_name" => $contract->name_on_card,
                "confirmation_code" => ""
            ]];

            $_params = array_merge($params,$cc);

        } else {
            $_params = $params;
        }
      
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($_params, null, '&'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        
        //if(!$info["http_code"] || $info["http_code"]!=200) die("HTTP Error");
        $json = json_decode($response, true);
      
       // if(!$json["status"]) die($json["reason"]);
      
       // Helper::sendInvoicePayToClient($id, $json["doc_url"], $json["docnum"],$inv->id);

    
    /* Auto payment */
        if( $doctype == 'invrec'){
          $pres = $this->commitPayment($services, $id, $card->card_token);
          $pre = json_encode($pres);
        }

    /*Close Order */
        $this->closeDoc($job->order->order_id,'order');
    
        job::where('id',$id)->update([
            'invoice_no'    =>$json["docnum"],
            'invoice_url'   =>$json["doc_url"],
            'isOrdered'     => 2
        ]);
        $invoice = [
            'invoice_id' => $json['docnum'],
            'job_id'     => $id,
            'amount'     => $total,
            'paid_amount'=> $total,
            'pay_method' => ( (isset($pres)) && $pres->HasError == false && $doctype == 'invrec' ) ? 'Credit Card' : 'NA',
            'customer'   => $job->client->id,
            'doc_url'    => $json['doc_url'],
            'type'       => $doctype,
            'due_date'   => $due,
            'invoice_icount_status' => 'Open',
            'txn_id'     => ( (isset($pres)) && $pres->HasError == false && $doctype == 'invrec' ) ? $pres->ReferenceNumber : '',
            'callback'   => ( (isset($pres)) && $pres->HasError == false && $doctype == 'invrec') ? $pre : '',
            'status'     => ( (isset($pres))  && $pres->HasError == false && $doctype == 'invrec') ? 'Paid' : ( (isset($pres)) ? $pres->ReturnMessage : 'Unpaid'),
        ];
        
        $inv = Invoices::create($invoice);
        if((isset($pres))  && $pres->HasError == false && $doctype == 'invrec' ){
            //close invoice
            $this->closeDoc($json['docnum'],'invrec');
            Invoices::where('id',$inv->id)->update(['invoice_icount_status'=>'Closed']);

        }
        Order::where('id',$job->order->id)->update(['status'=>'Closed']);
        JobService::where('id',$job->jobservice[0]->id)->update(['order_status'=>2]);
        Order::where('id',$oid)->update(['invoice_status'=>2]);

    } 

    }

    public function commitRegularInvoicePayment($service , $total, $token, $client){

   
        $pitems[] = [
            'ItemDescription' => $service[0]->description,
            'ItemQuantity'    => $service[0]->quantity,
            'ItemPrice'       => $total,
            'IsTaxFree'       => "false"
        ];
               

      $pay_items = json_encode($pitems);

      $curl = curl_init();

      $pdata = '{
        "TerminalNumber": "'.env("ZCREDIT_TERMINALNUMBER").'",
        "Password": "'.env("ZCREDIT_TERMINALPASSWORD").'",
        "Track2": "",
        "CardNumber": "'.$token.'",
        "CVV": "",
        "ExpDate_MMYY": "",
        "TransactionSum": "'.$total.'",
        "NumberOfPayments": "1",
        "FirstPaymentSum": "0",
        "OtherPaymentsSum": "0",
        "TransactionType": "01",
        "CurrencyType": "1",
        "CreditType": "1",
        "J": "0",
        "IsCustomerPresent": "true",
        "AuthNum": "",
        "HolderID": "",
        "ExtraData": "",
        "CustomerName":"'.$client->firstname." ".$client->lastname.'",
        "CustomerAddress": "'.$client->geo_address.'",
        "CustomerEmail": "",
        "PhoneNumber": "",
        "ItemDescription": "",
        "ObeligoAction": "",
        "OriginalZCreditReferenceNumber": "",
        "TransactionUniqueIdForQuery": "",
        "TransactionUniqueID": "",
        "UseAdvancedDuplicatesCheck": "",
        "ZCreditInvoiceReceipt": {
          "Type": "0",
          "RecepientName": "",
          "RecepientCompanyID": "",
          "Address": "",
          "City": "",
          "ZipCode": "",
          "PhoneNum": "",
          "FaxNum": "",
          "TaxRate": "17",
          "Comment": "",
          "ReceipientEmail": "",
          "EmailDocumentToReceipient": "",
          "ReturnDocumentInResponse": "",
          "Items": '.$pay_items.'
        }
      }';
    
      curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://pci.zcredit.co.il/ZCreditWS/api/Transaction/CommitFullTransaction',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS =>$pdata,
        CURLOPT_HTTPHEADER => array(
          'Content-Type: application/json'
        ),
      ));
     
      $pre = curl_exec($curl);
      $pres = json_decode($pre);
      curl_close($curl);
      return $pres;

    }

    public function regularInvoice(){
        $orders = Order::Where('invoice_status',0)->get()->groupBy('contract_id');
        if(!empty($orders)){
           foreach($orders as $c => $od){
               $this->scheduledInvoice($c);
           }
        } 
    }

    public function scheduledInvoice($cnid){
        
        $contract = Contract::where('id',$cnid)->with('client')->get()->first();
        $client   = $contract->client;
      
        $orders = Order::where('contract_id',$cnid)->Where('invoice_status',0)->get();
        
        $st = 0;
        $based_on = [];
        $services = [];
        $jids = [];
        $makeInvoice = false;

        if(!empty($orders)){
            foreach($orders as $o){
              
              $bo = ['docnum'=>$o->order_id,'doctype'=>'order'];
              $based_on[] = $bo;

              $s = json_decode($o->items);
              $st += (int)$s[0]->unitprice;
              $services[] = $s[0];
              
              $job = Job::where('id',$o->job_id)->get()->first();

            if($job->schedule == 'w'){
                $date = Carbon::parse($job->start_date);
                $newDate = $date->addDays(7);
            }
            if($job->schedule == '2w'){
                $date = Carbon::parse($job->start_date);
                $newDate = $date->addDays(14);
            }
            if($job->schedule == '3w'){
                $date = Carbon::parse($job->start_date);
                $newDate = $date->addDays(21);
            }
            if($job->schedule == 'm'){
                $date = Carbon::parse($job->start_date);
                $newDate = $date->addMonths(1);
            }
            if($job->schedule == '2m'){
                $date = Carbon::parse($job->start_date);
                $newDate = $date->addMonths(2);
            }
            if($job->schedule == '3m'){
                $date = Carbon::parse($job->start_date);
                $newDate = $date->addMonths(3);
            }
        
            $today = Carbon::today()->format('Y-m-d');
            
            if( $today !== $newDate->format('Y-m-d') ){
              $jids[] = $job->id;
              $makeInvoice = true;
            }

            }
        }
        
        
       if( $makeInvoice == true ):
       
        $total = 0;
        
        $card = ClientCard::where('client_id',$client->id)->get()->first();
        $p_method = $client->payment_method;
        
        $doctype  = ($card != null && $card->card_token != null && $p_method == 'cc') ? "invrec" : "invoice"; 
       
        $subtotal = (int)$st;
        $tax = (17/100) * $subtotal;
        $total = $tax+$subtotal;
        
      
        $o_res = json_decode($orders[0]->response);
     
        $due      = \Carbon\Carbon::now()->endOfMonth()->toDateString();
        $name     =  ($job->client->invoicename != null) ? $job->client->invoicename : $job->client->firstname." ".$job->client->lastname;
        $url = "https://api.icount.co.il/api/v3.php/doc/create";
        $params = Array(

                "cid"            => env('ICOUNT_COMPANYID'),
                "user"           => env('ICOUNT_USERNAME'),
                "pass"           => env('ICOUNT_PASS'),

                "doctype"        => $doctype,
                "client_id"      => $o_res->client_id,
                "client_name"    => $name, 
                "client_address" => $job->client->geo_address,
                "email"          => $job->client->email, 
                "lang"           => $job->client->lng,
                "currency_code"  => "ILS",
                "doc_lang"       => $job->client->lng,
                "items"          => $services,
                "duedate"        => $due,
                "based_on"       =>$based_on,
                
                "send_email"      => 1, 
                "email_to_client" => 1, 
                "email_to"        => $job->client->email, 
                
        );
        if($doctype == "invrec"){

            $ex = explode('-',$card->valid);
            $cc = ['cc'=>[
                "sum" => $total,
                "card_type" => $card->card_type,
                "card_number" => substr($card->card_number,12), 
                "exp_year" => $ex[0],
                "exp_month" => $ex[1],
                "holder_id" => "",
                "holder_name" => $contract->name_on_card,
                "confirmation_code" => ""
            ]];

            $_params = array_merge($params,$cc);

        } else {
            $_params = $params;
        }
        
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($_params, null, '&'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        
        //if(!$info["http_code"] || $info["http_code"]!=200) die("HTTP Error");
        $json = json_decode($response, true);
      
        //if(!$json["status"]) die($json["reason"]);

        /* Auto payment */
        if( $doctype == 'invrec'){
            $pres = $this->commitRegularInvoicePayment($services, $total, $card->card_token, $client);
            $pre = json_encode($pres);
        }
  
        foreach($jids as $j):
          job::where('id',$j)->update([
              'invoice_no'    =>$json["docnum"],
              'invoice_url'   =>$json["doc_url"],
              'isOrdered'     => 2
          ]);
        endforeach;

          $invoice = [
              'invoice_id' => $json['docnum'],
              'job_id'     => end($jids),
              'amount'     => $total,
              'paid_amount'=> $total,
              'pay_method' => ( (isset($pres)) && $pres->HasError == false && $doctype == 'invrec' ) ? 'Credit Card' : 'NA',
              'customer'   => $job->client->id,
              'doc_url'    => $json['doc_url'],
              'type'       => $doctype,
              'invoice_icount_status' => 'Open',
              'due_date'   => $due,
              'txn_id'     => ( (isset($pres)) && $pres->HasError == false && $doctype == 'invrec' ) ? $pres->ReferenceNumber : '',
              'callback'   => ( (isset($pres)) && $pres->HasError == false && $doctype == 'invrec') ? $pre : '',
              'status'     => ( (isset($pres))  && $pres->HasError == false && $doctype == 'invrec') ? 'Paid' : ( (isset($pres)) ? $pres->ReturnMessage : 'Unpaid'),
          ];
          
          $inv = Invoices::create($invoice);
           if((isset($pres))  && $pres->HasError == false && $doctype == 'invrec' ){
            //close invoice
            $this->closeDoc($json['docnum'],'invrec');
            Invoices::where('id',$inv->id)->update(['invoice_icount_status'=>'Closed']);

        }
          
      /*Close Order */

      if(!empty($orders)){
        foreach($orders as $o){
          $this->closeDoc($o->order_id,'order');
            Order::where('id',$o->id)->update(['status'=>'Closed','invoice_status'=>2]);
            }
    }

    endif;
    
 }

}
