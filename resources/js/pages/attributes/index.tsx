import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { Attribute } from '@/types/attributes';
import AppLayout from '@/layouts/app-layout';
import * as AttributeRoutes from '@/routes/attributes';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { AttributeFormDialog } from '@/components/attribute-form-dialog';

import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from "@/components/ui/table";

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

  
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attributes" />

            <div className="flex items-center justify-end">
                <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Attribute
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Label</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attributes.length > 0 ? (
                        attributes.map((attribute) => (
                            <TableRow key={attribute.id}>
                            <TableCell className="font-medium">{attribute.label}</TableCell>
                            <TableCell className="text-right">
                                <Button 
                                variant="ghost" 
                                onClick={() => handleEdit(attribute)}
                                >
                                Edit
                                </Button>

                                <Form
                                    action={AttributeRoutes.destroy(attribute.id).url}
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
                            No attributes found.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <AttributeFormDialog 
                attribute={selectedAttribute} 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen} 
            />
        </AppLayout>
    );
}
