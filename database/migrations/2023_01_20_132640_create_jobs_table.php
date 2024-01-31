<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            
            $table->id();
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('worker_id')->nullable();
            $table->unsignedBigInteger('offer_id');
            $table->unsignedBigInteger('contract_id');
            $table->unsignedBigInteger('schedule_id')->nullable();
            $table->string('schedule')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('start_time')->nullable();
            $table->string('end_time')->nullable();
            $table->text('shifts')->nullable();
            $table->text('comment')->nullable();
            $table->unsignedBigInteger('rate')->nullable();
            $table->string('isOrdered')->default(0);
            $table->string('invoice_no')->nullable();
            $table->longText('invoice_url')->nullable();
            $table->enum('status', ['not-started', 'progress', 'completed','scheduled','unscheduled','re-scheduled','cancel'])->default('unscheduled');
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
        Schema::dropIfExists('jobs');
    }
}
