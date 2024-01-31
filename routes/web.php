<?php

use App\Http\Controllers\Admin\ChatController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\User\Auth\AuthController;
use App\Http\Controllers\Api\LeadWebhookController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/import',[DashboardController::class,'import']);
Route::get('/pdf/{id}',[AuthController::class,'pdf101']);
Route::get('/view-invoice/{id}',[InvoiceController::class,'viewInvoice']);
Route::get('/generate-payment/{id}',[InvoiceController::class,'generatePayment']);
Route::get('/record-invoice/{sesid}/{cid}/{holder}',[InvoiceController::class,'recordInvoice']);
Route::get('/thanks/{id}',[InvoiceController::class,'displayThanks'])->name('thanks');
Route::any('/webhook_fb',[LeadWebhookController::class,'fbWebhook'])->name('webhook_fb');
Route::get('ads-leads',[LeadController::class,'fbAdsLead'])->name('adsLead');
Route::get('response-import',[ChatController::class,'responseImport']);

Route::get('update-clients',[DashboardController::class,'updateClients'])->name('update-clients');

// Auth::routes();
Route::any( '/{path?}', function(){
    return view( 'index' );
} )->where('path', '.*');

Route::any( '/login', function(){
    return view( 'index' );
} )->where('path', '.*');

Route::any( '/vendor/login', function(){
    return view( 'index' );
} )->where('path', '.*');


Route::any( '/register', function(){
    return view( 'index' );
} )->where('path', '.*');




