<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class StoreTermRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
        {
            if (!$this->slug && $this->name) {
                $this->merge([
                    'slug' => Str::slug($this->name),
                ]);
            }
        }    

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        $taxonomy = $this->route('taxonomy');
        $term = $this->route('term');

        return [
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                Rule::unique('taxonomy_terms')
                    ->where('taxonomy_id', $taxonomy->id)
                    ->ignore($term?->id),
            ]
        ];
    }
}
