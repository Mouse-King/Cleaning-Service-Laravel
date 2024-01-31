<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobHoursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_hours', function (Blueprint $table) {
            $table->id();
            $table->string('job_id');
            $table->string('worker_id');
            $table->string('start_time')->nullable();
            $table->string('end_time')->nullable();
            $table->string('time_diff')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('job_hours');
    }
}
