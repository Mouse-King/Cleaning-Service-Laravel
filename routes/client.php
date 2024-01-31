<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Client\Auth\AuthController;
use App\Http\Controllers\Client\ClientEmailController;
use App\Http\Controllers\Client\DashboardController;
use App\Http\Controllers\Client\JobCommentController;
/*
|--------------------------------------------------------------------------
| Admin API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'client', 'middleware' => ['auth:client-api', 'scopes:client']], function () {

    Route::post('logout', [AuthController::class, 'logout']);

   // Dashboard Routes
   Route::post('dashboard', [DashboardController::class, 'dashboard']);
   Route::post('schedule', [DashboardController::class, 'meetings'])->name('schedule');
   Route::post('offers', [DashboardController::class, 'offers'])->name('offers');
   Route::post('view-offer', [DashboardController::class, 'viewOffer'])->name('view-offer');
   Route::post('contracts', [DashboardController::class, 'contracts'])->name('contracts');
   Route::post('view-contract', [DashboardController::class, 'viewContract'])->name('view-contract');
   Route::post('get-contract', [DashboardController::class, 'getContract'])->name('get-contract');
   Route::post('add-file',[DashboardController::class,'addfile'])->name('add-file');
   Route::post('get-files',[DashboardController::class,'getfiles'])->name('get-files');
   Route::post('delete-file',[DashboardController::class,'deletefile'])->name('delete-file');

    
    //job APis
    Route::post('jobs',[DashboardController::class,'listJobs'])->name('jobs');
    Route::post('view-job',[DashboardController::class,'viewJob'])->name('view-job');
    Route::post('update-job-status/{id}',[DashboardController::class,'updateJobStatus'])->name('update-job');

    // My Account Api
    Route::get('my-account', [DashboardController::class, 'getAccountDetails']);
    Route::get('get-card', [DashboardController::class, 'getCard']);
    Route::post('my-account', [DashboardController::class, 'saveAccountDetails']);

    // Change Password Api
    Route::post('change-password', [DashboardController::class, 'changePassword']);

    Route::resource('job-comments', JobCommentController::class);
    Route::post('update-card',[DashboardController::class,'updateCard'])->name('update-card');
   
  
});

Route::group(['prefix' => 'client'], function () {

    Route::post('login', [AuthController::class, 'login']);

     // Emails Routes
     Route::post('get-client',[ClientEmailController::class,'getClient'])->name('get-client');
     Route::get('get-schedule/{id}',[ClientEmailController::class,'getSchedule'])->name('get-schedule');
     Route::post('add-meet',[ClientEmailController::class,'addMeet'])->name('add-meet');
     Route::post('meeting', [ClientEmailController::class, 'ShowMeeting'])->name('meeting');
     Route::post('get-offer',[ClientEmailController::class,'GetOffer'])->name('get-offer');
     Route::post('accept-offer',[ClientEmailController::class,'AcceptOffer'])->name('accept-offer');
     Route::post('reject-offer',[ClientEmailController::class,'RejectOffer'])->name('accept-offer');
     Route::post('accept-meeting',[ClientEmailController::class,'AcceptMeeting'])->name('accept-meeting');
     Route::post('get-offer-token',[ClientEmailController::class,'GetOfferFromHash'])->name('get-offer-token');
     Route::post('accept-contract',[ClientEmailController::class,'AcceptContract'])->name('accept-contract');
     Route::post('reject-contract',[ClientEmailController::class,'RejectContract'])->name('reject-contract');
     Route::post('get-service-template',[ClientEmailController::class,'serviceTemplate'])->name('get-service-template');
     Route::post('save-card',[ClientEmailController::class,'saveCard'])->name('save-card');
   
    
});





