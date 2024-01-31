<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('offer_id');
            $table->unsignedBigInteger('client_id');
            $table->string('additional_address')->nullable();
            $table->string('name_on_card')->nullable();
            $table->string('cvv')->nullable();
            $table->string('card_type')->nullable();
            $table->longText('card_sign')->nullable();
            $table->longText('signature')->nullable();
            $table->enum('status',['verified','un-verified','not-signed','declined'])->default('not-signed');
            $table->string('unique_hash')->nullable();
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
        Schema::dropIfExists('contracts');
    }
}
