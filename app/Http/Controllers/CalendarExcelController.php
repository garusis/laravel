<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\Calendar;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class CalendarExcelController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index($calendarId)
    {
        $calendar = Calendar::find($calendarId);
        Excel::create('Calendario Electoral ' . $calendar->noElection, function ($excel) use ($calendar) {
            $excel->sheet('Datos Principales', function ($sheet) use ($calendar) {
                $sheet->fromArray([
                    ['#Elección', $calendar->noElection],
                    ['Nombre', $calendar->name],
                    ['Descripción', $calendar->description],
                    ['Estado', $calendar->status],
                ]);
            });
            $excel->sheet('Eventos', function ($sheet) use($calendar) {
                $sheet->fromArray($calendar->events);
            });
            $excel->sheet('Candidatos', function ($sheet) use($calendar) {
                $sheet->fromArray($calendar->candidates);
            });
        })->export('xls');
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
    public function store()
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        //
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
    public function update($id)
    {
        //
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
