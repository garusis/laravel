<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix'=>'api'], function(){
    Route::resource('users','UserController');
    Route::post('authenticate', 'UserController@authenticate');
});