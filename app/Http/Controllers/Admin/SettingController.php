<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\GeneralSetting;
use App\Models\Countries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    public function getGeneralSettings()
    {
        $setting = GeneralSetting::first();
        $setting->logo  = $setting->logo ? asset('storage/uploads/'.$setting->logo) : asset('images/Frontlogo.png');
        return response()->json([
            'setting'         => $setting,
        ], 200);
    }

    public function saveGeneralSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'         => ['required', 'string', 'max:255'],
            'facebook'      => ['required'],
            'twitter'       => ['required'],
            'instagram'     => ['required'],
            'linkedin'      => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }

        $setting = GeneralSetting::first();

        $input                  = $request->all();

        if ($request->hasfile('logo')) {
            $image              = $request->file('logo');
            $name               = $image->getClientOriginalName();
            $image->storeAs('uploads/', $name, 'public');

            $input['logo']      = $name;
        }

        GeneralSetting::where('id', $setting->id)->update($input);

        return response()->json([
            'message'       => 'General Setting updated successfully',
        ], 200);
    }

    public function getAccountDetails()
    {
        $account          = Auth::user();
        $account->avatar  = $account->avatar ? asset('storage/uploads/admin/'.$account->avatar) : asset('images/man.png');
        return response()->json([
            'account'         => $account,
        ], 200);
    }

    public function saveAccountDetails(Request $request)
    {
        $admin     = Auth::user();
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'address'   => ['required', 'string'],
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:admins,email,' . $admin->id],

        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }

        $input                  = $request->all();
        if ($request->hasfile('avatar')) {
            $image              = $request->file('avatar');
            $name               = $image->getClientOriginalName();
            $image->storeAs('uploads/admin/', $name, 'public');

            $input['avatar']      = $name;
        }
        $admin                  = Admin::where('id', $admin->id)->update($input);

        return response()->json([
            'message'       => 'Account details updated successfully',
        ], 200);
    }

    public function changePassword(Request $request)
    {

        $id = Auth::user()->id;

        $validator = Validator::make($request->all(), [
            'current_password' => ['required', 'min:6'],
            'password'   => ['required', 'min:6', 'confirmed']
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()]);
        }

        $admin = Admin::find($id);

        if (Hash::check($request->get('current_password'), $admin->password)) {

            $admin->password = Hash::make($request->password);
            $admin->save();

            return response()->json([
                'message'       => 'Password changed successfully',
            ], 200);
        } else {

            return response()->json(['errors' => ['current_password' => 'Current password is incorrect.']]);
        }

        return response()->json([
            'message'       => 'Password changed successfully',
        ], 200);
    }
    public function getCountries(){
        $countries=Countries::get();
        
        return response()->json([
            'countries'       => $countries
        ], 200);

    }
}
