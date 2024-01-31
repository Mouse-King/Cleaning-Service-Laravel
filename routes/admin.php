<?php

use App\Http\Controllers\Admin\ClientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Auth\AuthController;
use App\Http\Controllers\Admin\ChatController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\WorkerController;
use App\Http\Controllers\Admin\InformationPageController;
use App\Http\Controllers\Admin\JobController;
use App\Http\Controllers\Admin\JobCommentController;
use App\Http\Controllers\Admin\JobProfileController;
use App\Http\Controllers\Admin\LanguageController;
use App\Http\Controllers\Admin\NationalityController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\Admin\TaskController;
use App\Http\Controllers\Admin\ServicesController;
use App\Http\Controllers\Admin\ServiceSchedulesController;
use App\Http\Controllers\Admin\OfferController;
use App\Http\Controllers\Admin\TeamMemberController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\ContractController;
use App\Http\Controllers\Admin\CronController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Api\LeadWebhookController;
use App\Models\Invoices;

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

// Unauthenticated Routes
Route::group(['prefix' => 'admin'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::get('weeklyjob', [CronController::class, 'WeeklyJob']);
    Route::get('update_worker', [CronController::class, 'WorkerUpdate']);
    Route::get('countries', [SettingController::class, 'getCountries']);
    Route::get('get_services',[ServicesController::class, 'create']);
    Route::any('save-lead', [LeadWebhookController::class, 'saveLead']);

});

// Authenticated Routes
Route::group(['prefix' => 'admin', 'middleware' => ['auth:admin-api', 'scopes:admin']], function () {

    // Admin Details Api
    Route::get('details', [AuthController::class, 'details']);

    // Admin Dashboard Api
    Route::get('dashboard', [DashboardController::class, 'dashboard']);
    Route::get('pending-data/{for}', [DashboardController::class, 'pendingData']);
    Route::get('latest-clients', [ClientController::class, 'latestClients']);

    // Jobs Api
    Route::resource('jobs', JobController::class);
    Route::get('get-all-jobs',[JobController::class,'getAllJob']);
    Route::post('upldate-job/{id}',[JobController::class,'updateJob']);
    Route::post('create-job/{id}',[JobController::class,'createJob']);
    Route::post('get-client-jobs',[JobController::class,'getJobByClient'])->name('get-client-jobs');
    Route::post('get-worker-jobs',[JobController::class,'getJobWorker']);
    Route::post('cancel-job',[JobController::class,'cancelJob']);
    Route::get('job-worker/{id}',[JobController::class,'AvlWorker']);

    Route::resource('job-comments', JobCommentController::class);

    Route::post('get-job-time', [JobController::class, 'getJobTime']);
    Route::post('add-job-time', [JobController::class, 'addJobTime']);
    Route::post('update-job-time', [JobController::class, 'updateJobTime']);
    Route::delete('delete-job-time/{id}', [JobController::class, 'deleteJobTime']);

    // Lead Api
    Route::resource('leads', LeadController::class);
    Route::post('update-lead-status/{id}', [JobController::class, 'updateStatus']);

    // workers Api
    Route::resource('workers', WorkerController::class);
    Route::get('all-workers', [WorkerController::class,'AllWorkers']);
    Route::get('all-workers/availability', [WorkerController::class,'getALLWorkerAvailability']);
    Route::get('worker_availability/{id}', [WorkerController::class,'getWorkerAvailability']);
    Route::post('update_availability/{id}', [WorkerController::class,'updateAvailability']);
    Route::post('upload/{id}', [WorkerController::class,'upload']);

    //not Available date
    Route::post('get-not-available-dates', [WorkerController::class,'getNotAvailableDates']);
    Route::post('add-not-available-date', [WorkerController::class,'addNotAvailableDates']);
    Route::post('delete-not-available-date', [WorkerController::class,'deleteNotAvailableDates']);


    // Clients Api
    Route::resource('clients', ClientController::class);
    Route::get('all-clients', [ClientController::class,'AllClients']);

    // Services Api
    Route::resource('services', ServicesController::class);
    Route::get('all-services', [ServicesController::class,'AllServices']);
    Route::post('all-services', [ServicesController::class,'AllServicesByLng']);

     // Services schedule Api
     Route::resource('service-schedule', ServiceSchedulesController::class);
     Route::get('all-service-schedule', [ServiceSchedulesController::class,'allSchedules'])->name('all-service-schedule');
     Route::post('all-service-schedule', [ServiceSchedulesController::class,'allSchedulesByLng'])->name('all-service-schedule');


    //Offer Api
    Route::resource('offers',OfferController::class);
    Route::post('client-offers',[OfferController::class,'ClientOffers'])->name('client-offers');
    Route::post('latest-client-offer', [OfferController::class,'getLatestClientOffer']);

    //Contract Api
    Route::resource('contract',ContractController::class);
    Route::post('client-contracts',[ContractController::class,'clientContracts'])->name('client-contracts');
    Route::post('get-contract', [ContractController::class, 'getContract'])->name('get-contract');
    Route::post('verify-contract',[ContractController::class,'verifyContract'])->name('verify-contract');
    Route::get('get-contract-by-client/{id}', [ContractController::class, 'getContractByClient']);
    Route::post('cancel-contract-jobs',[ContractController::class,'cancelJob']);

    //TeamMembers
    Route::resource('team',TeamMemberController::class);

    //Notes
    Route::post('get-notes', [ClientController::class,'getNotes']);
    Route::post('add-note', [ClientController::class,'addNote']);
    Route::post('delete-note', [ClientController::class,'deleteNote']);

    //Lead Comment
    Route::post('get-comments', [LeadController::class,'getComments']);
    Route::post('add-comment', [LeadController::class,'addComment']);
    Route::post('delete-comment', [LeadController::class,'deleteComment']);
    Route::post('uninterested/{id}',[LeadController::class,'uninterested']);
   
    //Meeting Schedules
    Route::resource('schedule',ScheduleController::class);
    Route::post('client-schedules',[ScheduleController::class,'ClientSchedules']);
    Route::post('schedule-events', [ScheduleController::class,'getEvents']);
    Route::post('latest-client-schedule', [ScheduleController::class,'getLatestClientSchedule']);
        
    //client files
    Route::post('add-file',[ClientController::class,'addfile'])->name('add-file');
    Route::post('get-files',[ClientController::class,'getfiles'])->name('get-files');
    Route::post('delete-file',[ClientController::class,'deletefile'])->name('delete-file');

    //Report
    Route::post('export_report',[JobController::class,'exportReport'])->name('export_report');
    
    // Reviews Api
    Route::resource('reviews', ReviewController::class);

    // Skills Api
    Route::resource('skills', SkillController::class);

    // Tasks Api
    Route::resource('tasks', TaskController::class);

    //Income 
    Route::post('income',[DashboardController::class,'income'])->name('income');


    //Invoice
    Route::post('add-invoice',[InvoiceController::class,'AddInvoice']);
    Route::get('invoices',[InvoiceController::class,'index']);
    Route::get('get-invoice/{id}',[InvoiceController::class,'getInvoice']);
    Route::post('update-invoice/{id}',[InvoiceController::class,'updateInvoice']);
    Route::post('invoice-jobs',[InvoiceController::class,'invoiceJobs']);
    Route::post('invoice-jobs-order',[InvoiceController::class,'invoiceJobOrder']);
    Route::post('order-jobs',[InvoiceController::class,'orderJobs']);
    Route::get('delete-invoice/{id}',[InvoiceController::class,'deleteInvoice']);
    Route::get('payments',[InvoiceController::class,'getPayments']);
    Route::get('card_token/{id}',[ClientController::class,'cardToken']);
    
    Route::get('clients_export',[ClientController::class,'export']);

    Route::get('close-doc/{id}/{type}',[InvoiceController::class,'closeDoc']);
    Route::post('cancel-doc',[InvoiceController::class,'cancelDoc']);

    Route::get('order-manual-invoice/{id}',[InvoiceController::class,'manualInvoice']);
    Route::get('client-invoices/{id}',[InvoiceController::class,'getClientInvoices']);

    Route::get('client-payments/{id}',[InvoiceController::class,'getClientPayments']);

    //Orders
    Route::get('orders',[InvoiceController::class,'getOrders']);
    Route::get('client-orders/{id}',[InvoiceController::class,'getClientOrders']);
    Route::get('delete-oders/{id}',[InvoiceController::class,'deleteOrders']);
    Route::post('get-codes-order',[InvoiceController::class,'getCodesOrders']);
    Route::post('add-order',[InvoiceController::class,'AddOrder']);

    //ManualInvoice
    Route::get('client-invoice-job',[InvoiceController::class,'getClientInvoiceJob']);
    Route::post('get-client-invorders',[InvoiceController::class,'clientInvoiceOrders']);

    //Multiple Orders
    Route::post('multiple-orders',[InvoiceController::class,'multipleOrders']);
    Route::post('multiple-invoices',[InvoiceController::class,'multipleInvoices']);
    
   
    //Notifications
    Route::get('head-notice',[DashboardController::class,'headNotice'])->name('head-notice');
    Route::post('notice',[DashboardController::class,'Notice'])->name('notice');
    Route::post('seen',[DashboardController::class,'seen'])->name('seen');
    Route::post('clear-notices',[DashboardController::class,'clearNotices'])->name('clear-notices');

    //View Password
    Route::post('viewpass',[DashboardController::class,'viewPass'])->name('viewpass');

    //ManageTime
    Route::post('update-time',[DashboardController::class,'updateTime'])->name('update-time');
    Route::get('get-time',[DashboardController::class,'getTime'])->name('get-time');

    // My Account Api
    Route::get('my-account', [SettingController::class, 'getAccountDetails']);
    Route::post('my-account', [SettingController::class, 'saveAccountDetails']);

    // Change Password Api
    Route::post('change-password', [SettingController::class, 'changePassword']);

    //Languages
    Route::resource('languages',LanguageController::class);

    // Admin Logout Api
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('chats',[ChatController::class,'chats']);
    Route::get('chat-message/{no}',[ChatController::class,'chatsMessages']);
    Route::post('chat-reply',[ChatController::class,'chatReply']);
    Route::post('save-response',[ChatController::class,'saveResponse']);
    Route::get('chat-responses',[ChatController::class,'chatResponses']);
    Route::post('chat-restart',[ChatController::class,'chatRestart']);
    Route::get('chat-search',[ChatController::class,'search'])->name('chat-search');

    Route::get('messenger-participants',[ChatController::class,'participants']);
    Route::get('messenger-message/{id}',[ChatController::class,'messengerMessage']);
    Route::post('messenger-reply',[ChatController::class,'messengerReply']);
});



