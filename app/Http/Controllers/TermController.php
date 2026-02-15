<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreTermRequest;
use Inertia\Inertia;
use App\Models\{Taxonomy, TaxonomyTerm};
use Illuminate\Support\Facades\Redirect;

class TermController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTermRequest $request, Taxonomy $taxonomy)
    {
        $taxonomy->terms()->create($request->validated());

        return Redirect::back()->with('success', 'Term created.');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(StoreTermRequest $request, Taxonomy $taxonomy)
    {

        $term->update($request->validated());

        return Redirect::back()->with('success', 'Term updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
