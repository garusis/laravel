<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix'=>'api'], function(){
    Route::resource('users','UserController');
    Route::resource('files','FileController');
    Route::resource('calendars','CalendarController');
    Route::resource('calendars.events','EventController');
    Route::resource('calendars.candidates','CandidateController');
    Route::post('authenticate', 'UserController@authenticate');
});