<?php  namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Calendar extends Model {

    protected $guarded = ['id'];

	//
    public function events()
    {
        return $this->hasMany('App\Models\CalendarEvent');
    }

    public function minutes()
    {
        return $this->hasMany('App\Models\Minute');
    }

    public function files()
    {
        return $this->hasMany('App\Models\CalendarFile');
    }

    public function candidates()
    {
        return $this->hasMany('App\Models\Candidate');
    }
}
