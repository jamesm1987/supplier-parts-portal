import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Tags, FolderTree, X } from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import AppLayout from '@/layouts/app-layout';

import * as TaxonomiesRoutes from '@/routes/taxonomies';
import * as TermsRoutes from '@/routes/taxonomies/terms';
import type { BreadcrumbItem } from '@/types';
import type { Taxonomy, TaxonomyTerm } from '@/types/taxonomies';







const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Taxonomies',
        href: TaxonomiesRoutes.index.url(),
    },
];


export default function Index({ taxonomies }: {taxonomies: Taxonomy[]}) {
    const totalTaxonomies = taxonomies.length;
    const [taxonomyDialogOpen, setTaxonomyDialogOpen] = useState(false);
    const [termDialogOpen, setTermDialogOpen] = useState(false);
    const [editingTaxonomy, setEditingTaxonomy] = useState<Taxonomy | null>(null);
    const [editingTerm, setEditingTerm] = useState<{ taxonomy_id: number; term: TaxonomyTerm } | null>(null);
    const [termTaxonomyId, setTermTaxonomyId] = useState<number | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<{ 
        type: 'taxonomy' | 'term'; 
        taxonomy_id: number; 
        termId?: number; 
        name: string 
    } | null>(null);


    const taxonomyForm = useForm({
        name: '',
        slug: '',
    });

    const termForm = useForm({
        name: '',
        taxonomy_id: null as number | null,
    });


    const openCreateTaxonomy = () => {
        setEditingTaxonomy(null);
        taxonomyForm.reset();
        setTaxonomyDialogOpen(true);
    };

    const openEditTaxonomy = (taxonomy: Taxonomy) => {
        setEditingTaxonomy(taxonomy);
        taxonomyForm.setData('name', taxonomy.name);
        taxonomyForm.setData('slug', taxonomy.slug);
        setTaxonomyDialogOpen(true);
    };

    const handleSaveTaxonomy = () => {
        if (editingTaxonomy) {
            taxonomyForm.put(TaxonomiesRoutes.update(editingTaxonomy.id).url, {
                onSuccess: () => {
                    setTaxonomyDialogOpen(false);
                    taxonomyForm.reset();
                }
            });
        } else {
            taxonomyForm.post(TaxonomiesRoutes.store().url, {
                onSuccess: () => {
                    setTaxonomyDialogOpen(false);
                    taxonomyForm.reset();
                },
            });
        }
    };

    const openCreateTerm = (taxonomy_id: number) => {
        setEditingTerm(null);
        setTermTaxonomyId(taxonomy_id);
        termForm.reset();
        termForm.setData('taxonomy_id', taxonomy_id);
        setTermDialogOpen(true);
    };

    const openEditTerm = (taxonomy_id: number, term: TaxonomyTerm) => {
        setEditingTerm({ taxonomy_id, term });
        setTermTaxonomyId(taxonomy_id);
        termForm.setData({
            name: term.name,
            taxonomy_id: taxonomy_id
        });
        setTermDialogOpen(true);
    };

    const handleSaveTerm = () => {
        if (editingTerm) {
        termForm.put(TermsRoutes.update([editingTerm.taxonomy_id, editingTerm.term.id]).url, {
            onSuccess: () => {
            setTermDialogOpen(false);
            termForm.reset();
            },
        });
        } else {
        termForm.post(TermsRoutes.store(termForm.data.taxonomy_id!).url, {
            onSuccess: () => {
            setTermDialogOpen(false);
            termForm.reset();
            },
        });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;

        if (deleteTarget.type === 'taxonomy') {

            taxonomyForm.delete(TaxonomiesRoutes.destroy(deleteTarget.taxonomy_id).url, {
                onSuccess: () => setDeleteTarget(null),
            });
        } else if (deleteTarget.termId) {
            termForm.delete(TermsRoutes.destroy([deleteTarget.taxonomy_id, deleteTarget.termId]).url, {
                onSuccess: () => setDeleteTarget(null),
            });
        }
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Taxonomies" />

            <div className="flex items-center justify-end">


                <Button onClick={openCreateTaxonomy}>
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
            <Accordion type="multiple" defaultValue={taxonomies.map(t => String(t.id))} className="space-y-4">
                {taxonomies.map((taxonomy) => (
                    <AccordionItem key={taxonomy.id} value={String(taxonomy.id)} className="border rounded-lg px-4">
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
                                <Button size="sm" variant="outline" onClick={() => openCreateTerm(taxonomy.id)}>
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
                                onClick={() => setDeleteTarget({ type: 'taxonomy', taxonomy_id: taxonomy.id, name: taxonomy.name })}
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
                                                taxonomy_id: taxonomy.id,
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
                            <Label className={taxonomyForm.errors.name ? 'text-destructive' : 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'}>Name *</Label>
                            <Input
                                value={taxonomyForm.data.name} 
                                onChange={e => taxonomyForm.setData('name', e.target.value)}
                                className={taxonomyForm.errors.name ? 'border-destructive' : 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'}
                                placeholder="e.g., Brand, Category, Material"
                            />
                            {taxonomyForm.errors.name && (
                                <p className="text-sm text-destructive mt-1">{taxonomyForm.errors.name}</p>
                            )}
                        </div>
                        <div>
                            <Label className={taxonomyForm.errors.slug ? 'text-destructive' : 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'}>Slug</Label>
                            <Input
                                value={taxonomyForm.data.slug} 
                                onChange={e => taxonomyForm.setData('slug', e.target.value)}
                                className={taxonomyForm.errors.slug ? 'border-destructive' : 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'}
                            />
                            {taxonomyForm.errors.slug && (
                                <p className="text-sm text-destructive mt-1">{taxonomyForm.errors.slug}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTaxonomyDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveTaxonomy} disabled={!taxonomyForm.data.name.trim()}>
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
                            <Label className={termForm.errors.name ? 'text-destructive' : ''}>Name *</Label>
                            <Input
                                value={termForm.data.name} 
                                onChange={e => termForm.setData('name', e.target.value)}
                                className={termForm.errors.name ? 'border-destructive' : ''}
                                placeholder="e.g., Timken, Bearings"
                            />
                            {termForm.errors.name && (
                                <p className="text-sm text-destructive mt-1">{termForm.errors.name}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTermDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveTerm} disabled={!termForm.data.name.trim()}>
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
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white">
                        Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
