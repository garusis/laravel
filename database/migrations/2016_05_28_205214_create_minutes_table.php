<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMinutesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('minutes', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('calendar_id');
			$table->string('official_id');
			$table->string('description');
			$table->string('filePath');
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
		Schema::drop('minutes');
	}

}
