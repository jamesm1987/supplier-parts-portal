import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { Part } from '@/types/parts';
import { Taxonomy } from '@/types/taxonomies';
import AppLayout from '@/layouts/app-layout';
import * as PartRoutes from '@/routes/parts';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { PartFormDialog } from '@/components/part-form-dialog';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from "@/components/ui/table";

import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Parts',
        href: PartRoutes.index.url(),
    },
];


export default function Index({ parts, taxonomies }: {parts: Part[], taxonomies: []}) {
    const totalParts = parts.length;
    const [selectedPart, setSelectedPart] = useState<Part | null | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreate = () => {
        setSelectedPart(null);
        setIsDialogOpen(true);
    }

    const handleEdit = (part: Part) => {
        setSelectedPart(part);
        setIsDialogOpen(true);
    };

  
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Parts" />

            <div className="flex items-center justify-end">
                <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Part
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parts.length > 0 ? (
                        parts.map((part) => (
                            <TableRow key={part.id}>
                            <TableCell className="font-medium">{part.sku}</TableCell>
                            <TableCell className="text-right">
                                <Button 
                                variant="ghost" 
                                onClick={() => handleEdit(part)}
                                >
                                Edit
                                </Button>

                                <Form
                                    action={PartRoutes.destroy(part.id).url}
                                    method="delete"
                                    options={{ preserveScroll: true }}
                                >
                                    {({ processing }) => (
                                        <Button 
                                            variant="destructive" 
                                            disabled={processing} 
                                            type="submit"
                                        >
                                            {processing ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    )}
                                </Form>
                            </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                            No parts found.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <PartFormDialog 
                part={selectedPart}
                taxonomies={taxonomies}
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen} 
            />
        </AppLayout>
    );
}
