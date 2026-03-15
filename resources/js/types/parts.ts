import type { TaxonomyTerm } from './taxonomies';
import type { Supplier } from './suppliers';

export type CrossReference = {
  id: number;
  part_number: string;
  supplier: Supplier;
  supplier_id: number;
  superseded_by?: number | null;
  superseded_part?: number | null;
}

export type Part = {
    id: number;
    sku: string;
    description: string;
    contents: string;
    taxonomy_terms: TaxonomyTerm[];
    crossReferences: CrossReference[];
};