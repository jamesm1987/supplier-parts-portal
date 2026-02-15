<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TaxonomyController;
use App\Http\Controllers\TermController;

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
Route::resource('taxonomies.terms', TermController::class)->shallow();

require __DIR__.'/settings.php';
