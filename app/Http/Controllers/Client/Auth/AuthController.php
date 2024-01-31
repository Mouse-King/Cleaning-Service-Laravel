<?php

namespace App\Http\Controllers\Client\Auth;

use App\Http\Controllers\Controller;
use App\Models\Client;
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
        
        if (Auth::guard('client')->attempt([
            'email'     => $request->email,
            'password'  => $request->password
        ])) {
            $client        = Client::find(auth()->guard('client')->user()->id);
            if($client->status == 2):

                $client->token = $client->createToken('Client', ['client'])->accessToken;
                return response()->json($client, 200);

            else:
                return response()->json(['errors' => ['email' => 'These credentials are not authorized to login for now. Please contact administrator.']]);
           
            endif;


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
            'role'   => ['required', 'string'],
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:Clients'],
            'password'  => ['required', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }

        $input                  = $request->all();
        $input['status']        = 0;
        $input['password']      = bcrypt($input['password']);
        $Client                   = Client::create($input);
        $Client->token            = $Client->createToken('Client', ['Client'])->accessToken;

        return response()->json($Client, 200);
    }
    /** 
     * Client Detail api 
     * 
     * @return \Illuminate\Http\Response 
     */
    public function details()
    {
        $Client = Auth::Client();
        return response()->json(['success' => $Client], 200);
    }
    public function logout()
    {
        $user = Auth::user()->token();
        $user->revoke();
        return response()->json(['success' => 'Logged Out Successfully!'], 200);
    }
}
