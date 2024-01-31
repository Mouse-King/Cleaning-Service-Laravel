<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ClientCard extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_card', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id');
            $table->string('card_number')->nullable();
            $table->string('card_type')->nullable();
            $table->string('card_holder')->nullable();
            $table->longText('valid')->nullable();
            $table->longText('cvv')->nullable();
            $table->string('cc_charge')->default(0);
            $table->longText('card_token');
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
        //
    }
}
