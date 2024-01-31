<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class TeamMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        /*$team = Admin::query()->where('role','admin')->orWhere('role','member');
        $team = $team->orderBy('id','desc')->paginate(10);
        return response()->json([
            'team' => $team
        ]);*/
        $q = $request->q;
        $result =Admin::query();
       /* $result->where('name',    'like','%'.$q.'%');
        $result->orWhere('phone',      'like','%'.$q.'%');
        $result->orWhere('status',     'like','%'.$q.'%');
        $result->orWhere('email',      'like','%'.$q.'%');*/
        if(isset($request->q)){
            $q = $request->q;
        $result->orWhere(function($qry) use($q){
            $qry->where('name','like','%'.$q.'%')
                 ->orWhere('phone',   'like','%'.$q.'%')
                 ->orWhere('status', 'like','%'.$q.'%')
                 ->orWhere('email', 'like','%'.$q.'%')
                 ->where('name','!=','superadmin');
        });
    }
        
        $result = $result->orderBy('id', 'desc')->where('name' ,'!=','superadmin')->paginate(20);
       
        return response()->json([
            'team'       => $result,            
        ], 200);
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
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:admins'],
            'phone'=>['required'],
            'password'=>['required','min:6','required_with:confirmation','same:confirmation'],
            'status' =>['required'],
        ]);
        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()]);
        }
        $input = $request->input();
        $input['password'] = Hash::make($input['password']);

        Admin::create($input);
        return response()->json([
            'message'=>'Team member added successfully'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TeamMember  $teamMember
     * @return \Illuminate\Http\Response
     */
    public function show(TeamMember $teamMember)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TeamMember  $teamMember
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $member = Admin::where('id',$id)->get();
        return response()->json([
            'member'=>$member
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TeamMember  $teamMember
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
         $validator = Validator::make($request->all(),[
            'name' =>['required'],
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:admins,email,'.$id],
            'phone'=>['required'],
            'password'=>$request->password ? ['min:6','required_with:confirmation','same:confirmation'] : [],
            'status' =>['required'],
        ]);
        if($validator->fails()){
            return response()->json(['errors'=>$validator->messages()]);
        }
        
        $request = $request->except(['confirmation']);
        if($request['password'] != null)
        $request['password'] = Hash::make($request['password']);
        else 
        unset($request['password']);
        
        Admin::where('id',$id)->update($request);
        return response()->json([
            'message'=>'Team member updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TeamMember  $teamMember
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Admin::find($id)->delete();
        return response()->json([
            'message'=>'Team member deleted successfully'
        ]);
    }
}
