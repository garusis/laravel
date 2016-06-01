<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCalendarRelationCalendarEventsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('calendar_events', function (Blueprint $table) {
			$table->integer('calendar_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('calendar_events', function (Blueprint $table) {
			$table->dropColumn('calendar_id');
		});
	}

}
