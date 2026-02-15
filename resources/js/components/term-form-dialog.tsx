import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { TaxonomyTerm } from '@/types/taxonomies';
import * as TermsRoutes from '@/routes/terms';
import {
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { slugify } from '@/lib/utils';


interface TermFormDialogProps {
  term?: TaxonomyTerm | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export const TermFormDialog = ({ term, open, onOpenChange }: TermFormDialogProps) => {
  const isEditing = !!term;

  const {data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: term?.name || '',
    slug: term?.slug || ''
  })


  useEffect(() => {
    if (open) {
      
      if (term) {
      
        setData({
          name: term.name,
          slug: term.slug,
        });
      
      } else {
      
        reset();
      
      }
    }
  }, [open, term]);

  const onSubmit = (e: any) => {
    e.preventDefault();

    const options = {
      onSuccess: () => {
        onOpenChange(false);
          reset();
        },
    };
    
    if (isEditing && term) {

      put(TermsRoutes.update(term.id).url, options)

    } else {

      post(TermsRoutes.store().url, options)

    }

  };

  if (!open) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Taxonomies</h2>
          <p className="text-sm text-muted-foreground">
            Manage taxonomy types (e.g., Brand, Category) and their terms
          </p>
        </div>
        <Button onClick={openAddTaxonomy}>
          <Plus className="h-4 w-4 mr-2" />
          New Taxonomy
        </Button>
      </div>

      {taxonomies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No taxonomies yet. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" defaultValue={taxonomies.map(t => t.id)} className="space-y-4">
          {taxonomies.map((taxonomy) => (
            <AccordionItem key={taxonomy.id} value={taxonomy.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1 text-left">
                  <Tags className="h-5 w-5 text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold">{taxonomy.name}</span>
                    {taxonomy.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{taxonomy.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="mr-2">{taxonomy.terms.length} terms</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pb-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openAddTerm(taxonomy.id)}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add Term
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openEditTaxonomy(taxonomy)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit Taxonomy
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget({ type: 'taxonomy', taxonomyId: taxonomy.id, name: taxonomy.name })}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>

                  <Separator />

                  {taxonomy.terms.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No terms yet. Add one above.
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {taxonomy.terms.map((term) => (
                        <div
                          key={term.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-background"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="font-medium">{term.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">{term.slug}</span>
                            {term.metadata && Object.entries(term.metadata).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditTerm(taxonomy.id, term)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteTarget({
                                type: 'term',
                                taxonomyId: taxonomy.id,
                                termId: term.id,
                                name: term.name,
                              })}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Taxonomy Dialog */}
      <Dialog open={taxonomyDialogOpen} onOpenChange={setTaxonomyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTaxonomy ? 'Edit Taxonomy' : 'New Taxonomy'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={taxonomyName}
                onChange={e => setTaxonomyName(e.target.value)}
                placeholder="e.g., Brand, Category, Material"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={taxonomyDescription}
                onChange={e => setTaxonomyDescription(e.target.value)}
                placeholder="What does this taxonomy classify?"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaxonomyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTaxonomy} disabled={!taxonomyName.trim()}>
              {editingTaxonomy ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Term Dialog */}
      <Dialog open={termDialogOpen} onOpenChange={setTermDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTerm ? 'Edit Term' : 'Add Term'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={termName}
                onChange={e => setTermName(e.target.value)}
                placeholder="e.g., Timken, Bearings"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Metadata (optional)</Label>
                <Button size="sm" variant="ghost" onClick={addMetadataField}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Field
                </Button>
              </div>
              {termMetadata.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Add key-value pairs like "country: USA"
                </p>
              ) : (
                <div className="space-y-2">
                  {termMetadata.map((meta, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={meta.key}
                        onChange={e => updateMetadataField(i, 'key', e.target.value)}
                        placeholder="Key"
                        className="flex-1"
                      />
                      <Input
                        value={meta.value}
                        onChange={e => updateMetadataField(i, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeMetadataField(i)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTermDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTerm} disabled={!termName.trim()}>
              {editingTerm ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type === 'taxonomy' ? 'Taxonomy' : 'Term'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"?
              {deleteTarget?.type === 'taxonomy' && ' This will also remove all its terms.'}
              {' '}This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
