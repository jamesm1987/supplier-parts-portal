import type { TaxonomyTerm } from './taxonomies';


export type CrossReference = {
  supplier: string;
  partNumber: string;
}

export type Part = {
    id: number;
    sku: string;
    description: string;
    contents: string;
    taxonomy_terms: TaxonomyTerm[];
    crossReferences: CrossReference[];
};