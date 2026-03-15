<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePartCrossReferenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'part_id' => ['required', 'exists:parts,id'],
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'part_number' => ['required', 'string', 'max:255'],
            'superseded_by' => ['nullable', 'exists:cross_reference_parts,id'],
        ];
    }
}
