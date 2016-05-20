<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix'=>'api'], function(){
    Route::resource('users','UserController');
    Route::resource('calendars','CalendarController');
    Route::post('authenticate', 'UserController@authenticate');
});