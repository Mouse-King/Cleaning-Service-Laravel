<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Mail;

class order extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'generate order';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $url = url('/api/order_generate');
        //Http::get($url);
      //Mail::raw('Hello World!', function($msg) {$msg->to('test@gmail.com')->subject('Test Email'); });
      $this->info($url);
    }
}
