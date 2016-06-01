<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCandidatesTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('calendar_id');
            $table->string('identification');
            $table->string('lot');
            $table->string('name');
            $table->string('lastname');
            $table->string('status', 1);
            $table->string('witness1FirstName');
            $table->string('witness1LastName');
            $table->string('witness1Identification');
            $table->string('witness2FirstName');
            $table->string('witness2LastName');
            $table->string('witness2Identification');
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
        Schema::drop('candidates');
    }

}
