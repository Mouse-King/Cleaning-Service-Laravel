<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $services = Services::query();
        $services   = $services->orderBy('id', 'desc')->paginate(20);

        return response()->json([
            'services'       => $services,            
        ], 200);

    }

    public function AllServices(){

        $services = Services::where('status',1)->get();
        return response()->json([
            'services'       => $services,            
        ], 200);
    }

    public function AllServicesByLng(Request $request){
        $services = Services::where('status',1)->get();
        $result = [];
        if(isset($services)){
            foreach ($services as $service){
                
                $res['name'] = ($request->lng == 'en') ? $service->name : $service->heb_name;
                $res['id']  = $service->id;
                $res['template'] = $service->template;
                array_push($result,$res);
            }
        }
        return response()->json([
            'services'       => $result,            
        ], 200);
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $services = Services::query();
        $services = $services->where('status',1)->orderBy('id', 'desc')->get();

        return response()->json([
            'services'       => $services,            
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
        //
        $validator = Validator::make($request->input(),[
            'name'=>'required',
            'status' =>'required',
        ]);
        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()]);
        }
        
        Services::create($request->input());
        return response()->json([
            'message' => 'service has been create successfully'
        ],200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Services  $services
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
       
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Services  $services
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $service = Services::find($id);
        return response()->json([
            'service'=> $service
        ],200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Services  $services
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,$id)
    {
        // 
        $validator = Validator::make($request->input(),[
            'name'=>'required',
            'status' =>'required',
        ]);
        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()]);
        }
        
        Services::where('id',$id)->update($request->input());
        return response()->json([
            'message' => 'service has been updated successfully'
        ],200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Services  $services
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        Services::find($id)->delete();
        return response()->json([
            'message'     => "Applicant has been deleted"         
        ], 200);
    }
}
