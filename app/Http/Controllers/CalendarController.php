<?php namespace App\Http\Controllers;

use App\Http\Requests;

use App\Models\Calendar;
use App\Models\CalendarEvent;
use Illuminate\Support\Facades\Input;

class CalendarController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return Calendar::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create(Input $input)
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Input $input)
    {
        Calendar::unguard();
        $data = $input::all();
        $events = is_null($data['events']) ? [] : $data['events'];
        unset($data['events']);
        $calendar = new Calendar($data);
        $calendar->save();
        foreach ($events as $event) {
            $calendar->events()->create($event);
        }
        return $calendar;
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        return Calendar::find($id)->with('events')->first();
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
    public function update(Input $input, $id)
    {
        Calendar::unguard();
        $data = $input::all();
        $events = [];
        if (isset($data['events'])) {
            $events = $data['events'];
            unset($data['events']);
        }
        foreach ($events as $event) {
            if (isset($event['id'])) {
                CalendarEvent::where('id', '=', $event['id'])->update($event);
            } else {
                $event['calendar_id'] = $id;
                CalendarEvent::create($event);
            }
        }
        return Calendar::where('id', '=', $id)->update($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
    }

}