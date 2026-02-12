import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import  suppliers from '@/routes/suppliers';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { SupplierFormDialog } from '@/components/supplier-form-dialog';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Suppliers',
        href: suppliers.index.url(),
    },
];

const handleAddSupplier = () => {

}

export default function Suppliers() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suppliers" />

            <div className="flex items-center justify-end">
                <Button onClick={handleAddSupplier}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
                </Button>
            </div>

            <SupplierFormDialog
                supplier={editingSupplier}
                open={formOpen}
                onOpenChange={setFormOpen}
            />
        </AppLayout>
    );
}
