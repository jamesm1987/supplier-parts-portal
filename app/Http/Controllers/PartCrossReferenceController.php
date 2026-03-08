<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StorePartCrossReferenceRequest;
use Inertia\Inertia;
use App\Models\{Taxonomy, Part, Supplier};

class PartCrossReferenceController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePartCrossReferenceRequest $request)
    {

        // $part = Part::create($request->validated());


        return back()->with('success', 'Cross Reference added.');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(StorePartCrossReferenceRequest $request, Part $part)
    {
        // $part->update($request->validated());

        // if ($request->has('taxonomy_terms')) {

        //     $termIds = array_values($request->taxonomy_terms);

        //     $part->taxonomyTerms()->sync($termIds);
        // }

        return back()->with('success', 'Cross Reference updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
