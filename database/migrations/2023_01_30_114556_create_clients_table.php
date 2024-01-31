<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('lastname')->nullable();
            $table->string('invoicename')->nullable();
            $table->string('city')->nullable();
            $table->string('street_n_no')->nullable();
            $table->string('floor')->nullable();
            $table->string('apt_no')->nullable();
            $table->string('entrence_code')->nullable();
            $table->string('zipcode')->nullable();
            $table->string('dob')->nullable();
            $table->enum('lng',['heb','en'])->default('heb');
            $table->string('passcode')->nullable();
            $table->string('color')->nullable();
            $table->string('geo_address')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->unique();
            $table->integer('status')->default(0);
            $table->string('password');
            $table->longText('extra')->nullable();
            $table->string('payment_method')->default('cc');
            $table->string('avatar')->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('clients');
    }
}
