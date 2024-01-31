<?php

namespace App\Http\Controllers\Admin;

use App\Models\Offer;
use App\Models\Client;
use App\Models\Services;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\LeadStatus;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class OfferController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = $request->q;
        $result = Offer::query()->with('client');  
        
        $result->orWhere('status','like','%'.$q.'%');
        $result->orWhere('total', 'like','%'.$q.'%');

        $result = $result->orWhereHas('client',function ($qr) use ($q){
             $qr->where(function($qr) use ($q) {
                 $qr->where(DB::raw('firstname'), 'like','%'.$q.'%');
                 $qr->orWhere(DB::raw('lastname'), 'like','%'.$q.'%');
                 $qr->orWhere(DB::raw('email'), 'like','%'.$q.'%');
                 $qr->orWhere(DB::raw('city'), 'like','%'.$q.'%');
                 $qr->orWhere(DB::raw('street_n_no'), 'like','%'.$q.'%');
                 $qr->orWhere(DB::raw('zipcode'), 'like','%'.$q.'%');
                 $qr->orWhere(DB::raw('phone'), 'like','%'.$q.'%');
             });
         });
 
         $result = $result->orderBy('created_at', 'desc')->paginate(20);

         if(!empty($result)){
            foreach($result as $i => $res){
               if(!is_null($res->client) && $res->client->lastname == null){
                 $result[$i]->client->lastname = '';
               }
            }
         }
 
        return response()->json([
            'offers'=>$result
        ],200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
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
    
        $validator  = Validator::make($request->all(),[

            'client_id'    => ['required'],
            'status'       => ['required'],
            'services'     => ['required']
        ]);
        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()]);
        }
       
        $input = $request->except(['action']);
        $ofr = Offer::create($input);
        $offer = Offer::where('id',$ofr->id)->with('client','service')->get()->first();

        LeadStatus::updateOrCreate(
            [
              'client_id' => $offer->client_id,
            ],
            [
              'client_id' => $offer->client_id,
              'lead_status' =>  'Offer Sent'
            ]

          );
          
        if($request->action == 'Save and Send')
        $this->sendOfferMail($offer);
        return response()->json([
            'message' => 'Offer created successfully'
        ]);

    }

    public function sendOfferMail($offer)
    {
       
    if(isset($offer)):
        $offer = $offer->toArray();
        $services = ($offer['services'] != '')? json_decode($offer['services']) : [];
        if(isset($services)){
            $s_names  = '';
            foreach($services as $k=> $service){
                   
                    if($k != count($services)-1 && $service->service != 10)  
                    $s_names .= $service->name.", ";
                        else if($service->service == 10){
                            if($k != count($services)-1)
                            $s_names .= $service->other_title.", ";
                            else
                            $s_names .= $service->other_title;
                        }
                    else
                    $s_names .= $service->name;
                }
            }
          
          
            $offer['service_names'] = $s_names;
        
        App::setLocale($offer['client']['lng']);
        Mail::send('/Mails/OfferMail',$offer,function($messages) use ($offer){
            $messages->to($offer['client']['email']);
            ($offer['client']['lng'] == 'en') ?
            $sub = __('mail.offer.subject')." ".__('mail.offer.from')." ".__('mail.offer.company')." #".($offer['id'])
            : $sub = $offer['id']."# ". __('mail.offer.subject')." ".__('mail.offer.from')." ".__('mail.offer.company');
            $messages->subject($sub);
        });

    endif;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Offer  $offer
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $offer = Offer::where('id',$id)->with('client')->get()->first();
        if(isset($offer)){
            $perhour = false;
            $services = json_decode($offer->services);
            if(isset($services)){
                foreach($services as $service){
                    if($service->type == 'hourly'){
                        $perhour = true;
                    }
                }
            }
            ($perhour == true) ? $offer->perhour = 1 : $offer->perhour = 0;
        }
        if($offer['client']['lastname'] == null){
            $offer['client']['lastname'] = "";
        }
      
        return response()->json([
            'offer' => $offer
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Offer  $offer
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $offer = Offer::where('id',$id)->get();
        return response()->json([
            'offer' => $offer
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Offer  $offer
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,$id)
    {
       // dd($request->all());
        $validator  = Validator::make($request->all(),[

            'client_id'    => ['required'],
            'status'       => ['required'],
        ]);
        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()]);
        }
       
       // $input = $request->input(); 
        $input = $request->except(['action']);
        Offer::where('id',$id)->update($input);
        $offer =  Offer::where('id',$id)->with('client','service')->get()->first();
        if($request->action == 'Save and Send')
        $this->sendOfferMail($offer);
        return response()->json([
            'message' => 'Offer updated successfully'
        ]);
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Offer  $offer
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Offer::where('id',$id)->delete();
        return response()->json([
            'message'=>'Offer has been deleted successfully'
        ],200);
    }

    public function ClientOffers(Request $request){
         
        $offers = Offer::with('client')->where('client_id',$request->id)->orderBy('created_at','desc')->get();
        return response()->json([
            'offers' => $offers
        ]);
    }
    public function getLatestClientOffer(Request $request){
        $latestOffer = Offer::where('client_id',$request->id)->get()->last();
        return response()->json([
            'latestOffer'=>$latestOffer
        ]); 
    }

}
