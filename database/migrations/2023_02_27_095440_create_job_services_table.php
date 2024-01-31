<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobServicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_services', function (Blueprint $table) {
            $table->id();
            $table->string('job_id');
            $table->string('name');
            $table->string('job_hour');
            $table->string('freq_name');
            $table->string('cycle');
            $table->string('period');
            $table->string('total');
            $table->string('pay_status')->default(0);
            $table->string('order_status')->default(0);
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
        Schema::dropIfExists('job_services');
    }
}
