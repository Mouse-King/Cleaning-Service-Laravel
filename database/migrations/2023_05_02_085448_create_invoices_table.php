<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_id');
            $table->string('job_id');
            $table->string('amount');
            $table->string('paid_amount');
            $table->longText('doc_url');
            $table->string('type');
            $table->unsignedBigInteger('customer');
            $table->string('due_date')->nullable();
            $table->string('pay_method')->nullable();
            $table->string('txn_id')->nullable();
            $table->longText('session_id')->nullable();
            $table->longText('callback')->nullable();
            $table->unsignedBigInteger('receipt_id')->nullable();
            $table->string('status');
            $table->string('invoice_icount_status')->default('Open');
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
        Schema::dropIfExists('invoices');
    }
}
