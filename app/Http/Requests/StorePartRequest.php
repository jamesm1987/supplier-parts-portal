<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePartRequest extends FormRequest
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

        $partId = $this->route('part')?->id;

        return [
            'sku' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'contents' => 'string|max:255',
            'taxonomy_terms' => 'array',
            Rule::unique('parts', 'sku')->ignore($partId),
        ];
    }
}
