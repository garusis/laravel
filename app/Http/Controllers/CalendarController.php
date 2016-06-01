<?php namespace App\Http\Controllers;

use App\Http\Requests;

use App\Models\Calendar;
use App\Models\CalendarEvent;
use App\Models\CalendarFile;
use App\Models\Minute;
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
        $events = isset($data['events']) ? $data['events'] : [];
        unset($data['events']);
        $minutes = isset($data['minutes']) ? $data['minutes'] : [];
        unset($data['minutes']);
        $files = isset($data['files']) ? $data['files'] : [];
        unset($data['files']);
        $calendar = new Calendar($data);
        $calendar->save();
        foreach ($events as $event) {
            $calendar->events()->create($event);
        }
        foreach ($minutes as $minute) {
            $calendar->minutes()->create($minute);
        }
        foreach ($files as $file) {
            $calendar->files()->create($file);
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
        return Calendar::find($id)->with('events')->with('minutes')->with('files')->first();
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

        $minutes = [];
        if (isset($data['minutes'])) {
            $minutes = $data['minutes'];
            unset($data['minutes']);
        }
        foreach ($minutes as $minute) {
            if (isset($minute['id'])) {
                Minute::where('id', '=', $minute['id'])->update($minute);
            } else {
                $minute['calendar_id'] = $id;
                Minute::create($minute);
            }
        }

        $files = [];
        if (isset($data['files'])) {
            $files = $data['files'];
            unset($data['files']);
        }
        foreach ($files as $file) {
            if (isset($file['id'])) {
                CalendarFile::where('id', '=', $file['id'])->update($file);
            } else {
                $file['calendar_id'] = $id;
                CalendarFile::create($file);
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