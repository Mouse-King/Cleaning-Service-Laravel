<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Job;

class WeeklyJob extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'job:week';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Worker Job Weekly';

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
        return 0;
    }
}
