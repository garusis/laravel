<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\Calendar;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class CandidateController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return Candidate::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Input $input, $calendarId)
    {
        $data = $input::all();
        $calendar = Calendar::find($calendarId);
        return $calendar->candidates()->create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($calendarId, $candidateId)
    {
        return Candidate::find($candidateId)->with('files')->first();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @return Response
     */
    public function update(Input $input, $calendarId, $candidateId)
    {
        $data = $input::all();
        return Candidate::where('id', '=', $candidateId)->update($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

}
