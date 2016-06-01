<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix'=>'api'], function(){
    Route::resource('users','UserController');
    Route::resource('files','FileController');
    Route::resource('calendars','CalendarController');
    Route::resource('calendars.excel','CalendarExcelController');
    Route::resource('calendars.events','EventController');
    Route::resource('calendars.minutes','MinuteController');
    Route::resource('calendars.candidates','CandidateController');
    Route::resource('calendars.files','CalendarFileController');
    Route::post('authenticate', 'UserController@authenticate');
});