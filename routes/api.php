<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\Auth\AuthController;
use App\Http\Controllers\User\JobController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\JobCommentController;
/*
|--------------------------------------------------------------------------
| Employee API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Unauthenticated Routes
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::get('showPdf/{id}', [AuthController::class, 'showPdf']);
Route::post('worker-detail',[AuthController::class, 'getWorkerDetail']); 
Route::post('work-contract', [AuthController::class, 'WorkContract']);
Route::post('form101',[AuthController::class, 'form101']); 
Route::get('get101/{id}',[AuthController::class, 'get101']); 

Route::get('order_generate',[JobController::class, 'jobOrderGenerate']); 
Route::get('invoice_every1630',[JobController::class, 'jobInvoiceGenerate']); 
Route::get('invoice_every1700',[JobController::class, 'regularInvoice']); 

// Authenticated Routes
Route::group( ['middleware' => ['auth:api','scopes:user'] ],function(){
    
    Route::post('dashboard', [DashboardController::class, 'dashboard']);
    Route::get('get-time', [DashboardController::class, 'getTime']);
     //not Available date
    Route::post('get-not-available-dates', [DashboardController::class,'getNotAvailableDates']);
    Route::post('add-not-available-date', [DashboardController::class,'addNotAvailableDates']);
    Route::post('delete-not-available-date', [DashboardController::class,'deleteNotAvailableDates']);


    Route::resource('jobs', JobController::class);
    Route::post('job-start-time', [JobController::class, 'JobStartTime']);
    Route::post('job-end-time', [JobController::class, 'JobEndTime']);
    Route::post('get-job-time', [JobController::class, 'getJobTime']);

    Route::resource('job-comments', JobCommentController::class);
    Route::get('worker_availability/{id}', [JobController::class,'getWorkerAvailability']);
    Route::post('update_availability/{id}', [JobController::class,'updateAvailability']); 
   
    Route::post('upload/{id}', [AuthController::class,'upload']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('details',[AuthController::class, 'details']); 
    Route::post('update_details/{id}',[AuthController::class, 'updateWorker']); 
   
});
