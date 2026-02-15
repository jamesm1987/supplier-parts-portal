<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreTaxonomyRequest;
use Inertia\Inertia;
use App\Models\Taxonomy;

class TaxonomyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $taxonomies = Taxonomy::all();
        return Inertia::render('taxonomies/index', ['taxonomies' => $taxonomies]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaxonomyRequest $request)
    {
        Taxonomy::create($request->validated());

        return back()->with('success', 'Taxonomy created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreTaxonomyRequest $request, Taxonomy $taxonomy)
    {
        $taxonomy->update($request->validated());

        return back()->with('success', 'Taxonomy updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
