<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    /** 
     * Login api 
     * 
     * @return \Illuminate\Http\Response 
     */
    public function login(Request $request)
    
    {
        $validator      = Validator::make($request->all(), [
            'email'     => ['required', 'string', 'email', 'max:255'],
            'password'  => ['required', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }
        if (Auth::guard('admin')->attempt([
            'email'     => $request->email,
            'password'  => $request->password
        ])) {
            $admin        = Admin::find(auth()->guard('admin')->user()->id);
            $admin->token = $admin->createToken('Admin', ['admin'])->accessToken;

            return response()->json($admin, 200);

        } else {
            return response()->json(['errors' => ['email' => 'These credentials do not match our records.']]);
        }
    }
    /** 
     * Register api 
     * 
     * @return \Illuminate\Http\Response 
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstname' => ['required', 'string', 'max:255'],
            'address'   => ['required', 'string'],
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:admins'],
            'password'  => ['required', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }

        $input                  = $request->all();
        $input['password']      = bcrypt($input['password']);
        $admin                  = Admin::create($input);
        $admin->token           = $admin->createToken('Admin', ['admin'])->accessToken;

        return response()->json($admin, 200);
    }
    /** 
     * details api 
     * 
     * @return \Illuminate\Http\Response 
     */
    public function details()
    {
        $admin = Auth::user();
        return response()->json(['success' => $admin], 200);
    }

    public function logout()
    {
        $user = Auth::user()->token();
        $user->revoke();
        return response()->json(['success' => 'Logged Out Successfully!'], 200);
    }
}
