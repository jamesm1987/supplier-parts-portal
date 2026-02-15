import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Taxonomy, TaxonomyTerm } from '@/types/taxonomies';
import * as TaxonomiesRoutes from '@/routes/taxonomies';
import * as TermsRoutes from '@/routes/taxonomies/terms';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, Pencil, Trash2, Tags, FolderTree, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Taxonomies',
        href: TaxonomiesRoutes.index.url(),
    },
];


export default function Index({ taxonomies }: {taxonomies: Taxonomy[]}) {
    const totalTaxonomies = taxonomies.length;
    const [taxonomyDialogOpen, setTaxonomyDialogOpen] = useState(false);
    const [editingTaxonomy, setEditingTaxonomy] = useState<Taxonomy | null>(null);
    const [termDialogOpen, setTermDialogOpen] = useState(false);
    const [editingTerm, setEditingTerm] = useState<{ taxonomyId: string; term: TaxonomyTerm } | null>(null);
    const [termTaxonomyId, setTermTaxonomyId] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'taxonomy' | 'term'; taxonomyId: string; termId?: string; name: string } | null>(null);


    const taxonomyForm = useForm({
        name: '',
    });


    const termForm = useForm({
        name: '',
    });


    const handleCreateTaxonomy = () => {
        setEditingTaxonomy(null);
        setTaxonomyDialogOpen(true);
    };

    const openEditTaxonomy = (taxonomy: Taxonomy) => {
        setEditingTaxonomy(taxonomy);
        setTaxonomyDialogOpen(true);
    };

    const handleSaveTaxonomy = () => {
        if (editingTaxonomy) {
            taxonomyForm.put(TaxonomiesRoutes.update(editingTaxonomy.id), {
                onSuccess: () => {
                    setTaxonomyDialogOpen(false);
                    taxonomyForm.reset();
                }
            });
        } else {
            taxonomyForm.post(TaxonomiesRoutes.store(), {
                onSuccess: () => {
                    setTaxonomyDialogOpen(false);
                    taxonomyForm.reset();
                }
            });
        }
    };

    const handleSaveTerm = () => {
        if (editingTerm) {
            termForm.put(TermsRoutes.update(editingTerm.id), {
                onSuccess: () => {
                    setTermDialogOpen(false);
                    termForm.reset();
                }
            });
        } else {
            termForm.post(TermsRoutes.store(), {
                onSuccess: () => {
                    setTermDialogOpen(false);
                    termForm.reset();
                }
            });
        }
    }; 


    const handleCreateTerm = (taxonomyId: string) => {
        setEditingTerm(null);
        setTermTaxonomyId(taxonomyId);
        setTermName('');
        setTermDialogOpen(true);
    };

    const handleEditTerm = (taxonomyId: string, term: TaxonomyTerm) => {
        setEditingTerm({ taxonomyId, term });
        setTermTaxonomyId(taxonomyId);
        setTermName(term.name);
        setTermDialogOpen(true);
    };

    const handleSaveTerm = () => {
        if (!termName.trim()) return;

        if (editingTerm) {
            updateTerm(editingTerm.taxonomyId, editingTerm.term.id, {
            name: termName.trim()
        });
        } else {
            addTerm(termTaxonomyId, termName.trim());
        }
        setTermDialogOpen(false);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
    
        const { type, taxonomyId, termId } = deleteTarget;

        if (type === 'taxonomy') {
            taxonomyForm.delete(TaxonomiesRoutes.destroy(taxonomyId), {
                onSuccess: () => setDeleteTarget(null)
            });
        } else {
            termForm.delete(TermsRoutes.destroy([taxonomyId, termId]), {
                onSuccess: () => setDeleteTarget(null)
            });
        }
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Taxonomies" />

            <div className="flex items-center justify-end">


                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Taxonomy
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
        </AppLayout>
    );
}
