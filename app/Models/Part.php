<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Part extends Model
{

    protected $fillable = [
        'sku',
        'description',
        'contents',
    ];


    protected $casts = [
        'specs' => 'collection',
    ];

    public function attributes() {
        return $this->belongsToMany(Attribute::class)
                    ->withPivot('value')
                    ->withTimestamps();
    }

    public function taxonomyTerms()
    {
        return $this->belongsToMany(TaxonomyTerm::class);
    }
}
