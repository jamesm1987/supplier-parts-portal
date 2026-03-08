import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { Supplier } from '@/types/suppliers';
import AppLayout from '@/layouts/app-layout';
import * as SupplierRoutes from '@/routes/suppliers';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { SupplierFormDialog } from '@/components/supplier-form-dialog';

import { DataTable } from "@/components/data-table";
import { getColumns } from "@/components/suppliers/suppliers-columns";

import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Suppliers',
        href: SupplierRoutes.index.url(),
    },
];


export default function Index({ suppliers }: {suppliers: Supplier[]}) {
    const totalSuppliers = suppliers.length;
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreate = () => {
        setSelectedSupplier(null);
        setIsDialogOpen(true);
    }

    const handleEdit = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsDialogOpen(true);
    };

    const columns = getColumns(handleEdit);
  
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suppliers" />

            <div className="flex items-center justify-end">
                <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
                </Button>
            </div>

            <DataTable columns= {columns} data={suppliers} resourceName="suppliers" />

            <SupplierFormDialog 
                supplier={selectedSupplier} 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen} 
            />
        </AppLayout>
    );
}
