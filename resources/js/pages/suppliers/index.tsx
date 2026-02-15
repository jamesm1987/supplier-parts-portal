import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Supplier } from '@/types/suppliers';
import AppLayout from '@/layouts/app-layout';
import * as SupplierRoutes from '@/routes/suppliers';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { SupplierFormDialog } from '@/components/supplier-form-dialog';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from "@/components/ui/table";

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


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suppliers" />

            <div className="flex items-center justify-end">
                <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {suppliers.length > 0 ? (
                        suppliers.map((supplier) => (
                            <TableRow key={supplier.id}>
                            <TableCell className="font-medium">{supplier.name}</TableCell>
                            <TableCell className="text-right">
                                <Button 
                                variant="ghost" 
                                onClick={() => handleEdit(supplier)}
                                >
                                Edit
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                            No suppliers found.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <SupplierFormDialog 
                supplier={selectedSupplier} 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen} 
            />
        </AppLayout>
    );
}
