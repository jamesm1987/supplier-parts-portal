<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrossReference extends Model
{
    protected $fillable = [];

    public function part()
    {
        return $this->belongsTo(Part::class);
    }
}
