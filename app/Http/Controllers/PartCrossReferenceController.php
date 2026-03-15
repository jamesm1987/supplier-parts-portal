<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StorePartCrossReferenceRequest;
use Inertia\Inertia;
use App\Models\{Taxonomy, Part, Supplier, CrossReference};

class PartCrossReferenceController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePartCrossReferenceRequest $request)
    {
        $crossReference = CrossReference::create($request->except('superseded_by'));

        if ($request->filled('superseded_part')) {
            $superseded = CrossReference::find($request->superseded_part);
            if ($superseded) {
                $superseded->update(['superseded_by' => $crossReference->id]);
            }
        }
        
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
