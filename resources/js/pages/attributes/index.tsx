import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { Attribute } from '@/types/attributes';
import AppLayout from '@/layouts/app-layout';
import * as AttributeRoutes from '@/routes/attributes';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { AttributeFormDialog } from '@/components/attribute-form-dialog';

import { DataTable } from "@/components/data-table";
import { getColumns } from "@/components/attributes/attributes-columns";

import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attributes',
        href: AttributeRoutes.index.url(),
    },
];


export default function Index({ attributes }: {attributes: Attribute[]}) {
    const totalAttributes = attributes.length;
    const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreate = () => {
        setSelectedAttribute(null);
        setIsDialogOpen(true);
    }

    const handleEdit = (attribute: Attribute) => {
        setSelectedAttribute(attribute);
        setIsDialogOpen(true);
    };

    const columns = getColumns(handleEdit);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attributes" />

            <div className="flex items-center justify-end">
                <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Attribute
                </Button>
            </div>

            <DataTable columns={columns} data={attributes} resourceName="attributes"/>

            <AttributeFormDialog 
                attribute={selectedAttribute} 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen} 
            />
        </AppLayout>
    );
}
