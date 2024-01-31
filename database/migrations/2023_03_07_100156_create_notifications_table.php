<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('clients')->onDelete('cascade');
            $table->enum('type',[
                'sent-meeting',
                'accept-meeting',
                'reject-meeting',
                'accept-offer',
                'reject-offer',
                'contract-accept',
                'contract-reject',
                'client-cancel-job',
                'worker-reschedule'
            ]);
            $table->string('status');
            $table->integer('seen')->default(0);
            $table->unsignedBigInteger('meet_id')->nullable();
            $table->foreign('meet_id')->references('id')->on('schedules')->onDelete('cascade');
            $table->unsignedBigInteger('offer_id')->nullable();
            $table->foreign('offer_id')->references('id')->on('offers')->onDelete('cascade');
            $table->unsignedBigInteger('contract_id')->nullable();
            $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');
            $table->unsignedBigInteger('job_id')->nullable();
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
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
        Schema::dropIfExists('notifications');
    }
}
