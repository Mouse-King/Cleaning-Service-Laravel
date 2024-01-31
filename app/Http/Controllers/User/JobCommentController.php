<?php

namespace App\Http\Controllers\User;

use App\Models\Job;
use App\Models\Admin;
use App\Models\JobComments;
use App\Models\notifications;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Mail;

class JobCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(request $request)
    {
        $comments = JobComments::where('job_id',$request->id)->where('role','worker')->orderBy('id', 'desc')->get();
         return response()->json([
            'comments'=>$comments
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
       
         $validator = Validator::make($request->all(),[
            'name' =>['required'],
            'job_id' =>['required'],
            'comment'=>['required']
        ]);
        if($validator->fails()){
            return response()->json(['error'=>$validator->messages()]);
        }
        $comment=new JobComments();
        $comment->name=$request->name;
        $comment->job_id=$request->job_id;
        $comment->role='worker';
        $comment->comment=$request->comment;
        
        if(isset($request->status) && $request->status != ''){
            $job = Job::with('client','worker','jobservice')->find($request->job_id);
            $job->status = $request->status;
            $job->save();
           

             $admin = Admin::find(1)->first();
             \App::setLocale('en');
             $data = array(
                'email'      =>$admin->email,
                'admin'      =>$admin->toArray(),
                'comment'    =>$request->comment,
                'worker_name'=>$request->name,
                'job'        => $job->toArray(),

             );

             notifications::create([
                'user_id'=>$job->worker->id,
                'type'=>'worker-reschedule',
                'job_id'=>$job->id,
                'status' => 'reschedule'
              ]);

             Mail::send('/WorkerPanelMail/JobStatusNotification',$data,function($messages) use ($data){
                $messages->to($data['email']);
                $sub = __('mail.job_status.subject');
                $messages->subject($sub);
              });

        }
        $comment->save();
       

        return response()->json([
            'message' => 'Comments has been created successfully'
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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        JobComments::find($id)->delete();
         return response()->json([
            'message' => 'Comments has been deleted successfully'
        ],200);
    }
}
