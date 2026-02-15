export interface TaxonomyTerm {
  id: string;
  name: string;
  slug: string;
}

export interface Taxonomy {
  id: string;
  name: string;
  slug: string;
  terms: TaxonomyTerm[];
}