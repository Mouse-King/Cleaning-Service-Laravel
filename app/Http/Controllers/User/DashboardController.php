<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\User;
use App\Models\ManageTime;
use App\Models\WorkerNotAvailbleDate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $id              = $request->id;
        $total_jobs      = Job::where('worker_id',$id)->count();
        $latest_jobs     = Job::where('worker_id',$id)->with('client','offer','worker','jobservice')->orderBy('id', 'desc')->take(10)->get();

        return response()->json([
            'total_jobs'         => $total_jobs,
            'latest_jobs'        => $latest_jobs
        ], 200);
    }
     public function getTime(){
       $time  = ManageTime::where('id',1)->get();
       return response()->json([
        'time' => $time
       ]);
    }
    public function addNotAvailableDates(Request $request){
        $validator = Validator::make($request->all(),[
            'date'     =>'required',
            'worker_id'  =>'required',
        ]);
        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()]);
        }
        $date          = new WorkerNotAvailbleDate;
        $date->user_id = $request->worker_id;
        $date->date    = $request->date;
        $date->status  = $request->status;
        $date->save();
        return response()->json(['message'=>'Date added']);
    }

    public function getNotAvailableDates(Request $request){
        $dates = WorkerNotAvailbleDate::where(['user_id'=>$request->id])->get();
        return response()->json(['dates'=>$dates]);
    }

    public function deleteNotAvailableDates(Request $request){
        WorkerNotAvailbleDate::find($request->id)->delete();
        return response()->json(['message'=>'date deleted']);
    }
   
}
