import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { Part } from '@/types/parts';
import { Taxonomy } from '@/types/taxonomies';
import { Supplier } from '@/types/suppliers';
import AppLayout from '@/layouts/app-layout';
import * as PartRoutes from '@/routes/parts';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { DataTable } from "@/components/data-table";
import { getColumns } from "@/components/parts/parts-columns";

import { PartFormDialog } from '@/components/part-form-dialog';
import { CrossRefEditor } from '@/components/cross-ref-editor';

import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Parts',
        href: PartRoutes.index.url(),
    },
];

export default function Index({ parts, taxonomies, suppliers }: {parts: Part[], taxonomies: [], suppliers: Supplier[]}) {
    const totalParts = parts.length;
    const [selectedPart, setSelectedPart] = useState<Part | null | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCrossRefEditorOpen, setIsCrossRefEditorOpen] = useState(false);

    const handleCreate = () => {
        setSelectedPart(null);
        setIsDialogOpen(true);
    }

    const handleEdit = (part: Part) => {
        setSelectedPart(part);
        setIsDialogOpen(true);
    };

    const handleManageCrossRefs = (part: Part) => {
        setSelectedPart(part);
        setIsCrossRefEditorOpen(true);
    }

    const columns = getColumns(handleEdit, handleManageCrossRefs);

  
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Parts" />

            <div className="flex items-center justify-end">
                <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Part
                </Button>
            </div>

            <DataTable columns={columns} data={parts} resourceName="parts" />

            <PartFormDialog 
                part={selectedPart}
                taxonomies={taxonomies}
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen}
            />

            <CrossRefEditor part={selectedPart} suppliers={suppliers} open={isCrossRefEditorOpen} onOpenChange={setIsCrossRefEditorOpen} />
        </AppLayout>
    );
}
