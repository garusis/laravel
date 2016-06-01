<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model {

    protected $guarded = ['id'];
	//

    public function files()
    {
        return $this->hasMany('App\Models\CandidateFile');
    }
}
