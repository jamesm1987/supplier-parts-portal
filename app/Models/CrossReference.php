<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrossReference extends Model
{
    protected $fillable = ['part_id', 'supplier_id', 'part_number', 'superseded_by'];

    protected $table = 'cross_reference_parts';

    public function part()
    {
        return $this->belongsTo(Part::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function scopeLatest($query)
    {
        return $query->where('superseded_by', null);
    }
}
