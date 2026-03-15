
"use client"

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, GitCompare, MoreHorizontal, FileText } from "lucide-react";



import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Supplier } from '@/types/suppliers';

export const getColumns = (onEdit: (supplier: Supplier) => void) => { 
    const columns: ColumnDef<Supplier>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            id: "actions",
            cell: ({ row }) => {
            const supplier = row.original
    
                return (
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(supplier)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete

                            
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },    

    ]

    return columns;
}
