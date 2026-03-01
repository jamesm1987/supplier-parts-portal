export interface TaxonomyTerm {
  id: number;
  taxonomy_id: number;
  name: string;
  slug: string;
}

export interface Taxonomy {
  id: number;
  name: string;
  slug: string;
  terms: TaxonomyTerm[];
}