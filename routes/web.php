<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TaxonomyController;
use App\Http\Controllers\TaxonomyTermController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\PartController;
use App\Http\Controllers\PartCrossReferenceController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('suppliers', SupplierController::class);
Route::resource('taxonomies', TaxonomyController::class);
Route::resource('taxonomies.terms', TaxonomyTermController::class);
Route::resource('attributes', AttributeController::class);
Route::resource('parts', PartController::class);
Route::resource('parts.cross-references', PartCrossReferenceController::class)
    ->only(['store', 'update', 'destroy']);

require __DIR__.'/settings.php';
