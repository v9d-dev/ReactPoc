<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Student;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\StudentResource;
use App\Http\Resources\StudentResourceCollection;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $students = Student::all();
        return (new StudentResourceCollection($students))->response();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'bail|required|string|max:255',
            'last_name' => 'bail|required|string|max:255',
            'address' => 'bail|required|string|max:255',
            'email' => 'bail|required|string|max:255|email|unique:students,email',
            'phone' => 'required|string',
        ]);
        $input = $request->all();

        $student = Student::create($input);
        return (new StudentResource($student))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function show(Student $student)
    {
        //
        return (new StudentResource($student))->response();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Student $student)
    {
        $request->validate([
            'first_name' => 'bail|required|string|max:255',
            'last_name' => 'bail|required|string|max:255',
            'address' => 'bail|required|string|max:255',
            'email' => 'bail|required|string|max:255|email|unique:students,email,' . $student->id,
            'phone' => 'required|string',

        ]);

        $input = $request->all();
        $student->update($input);

        return (new StudentResource($student))->response()->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function destroy(Student $student)
    {
        $student->delete();
        return response($student, Response::HTTP_NO_CONTENT);
    }
}
