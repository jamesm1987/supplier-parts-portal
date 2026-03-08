<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StorePartRequest;
use Inertia\Inertia;
use App\Models\{Taxonomy, Part, Supplier};

class PartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $parts = Part::with('taxonomyTerms')->get();
        $taxonomies = Taxonomy::with('terms')->get();
        $suppliers = Supplier::all();
        
        return Inertia::render('parts/index', [
            'parts' => $parts,
            'taxonomies' => $taxonomies,
            'suppliers' => $suppliers,
        ]);
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
    public function store(StorePartRequest $request)
    {

        $part = Part::create($request->validated());

        if ($request->has('taxonomy_terms')) {
            
            $termIds = array_values($request->taxonomy_terms);
            
            $part->taxonomyTerms()->sync($termIds);
        }


        return back()->with('success', 'Part created.');
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
    public function update(StorePartRequest $request, Part $part)
    {
        $part->update($request->validated());

        if ($request->has('taxonomy_terms')) {

            $termIds = array_values($request->taxonomy_terms);

            $part->taxonomyTerms()->sync($termIds);
        }

        return back()->with('success', 'Part updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
