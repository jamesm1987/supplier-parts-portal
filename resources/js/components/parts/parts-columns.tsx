
"use client"

import { Part } from '@/types/parts';
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, GitCompare, MoreHorizontal, FileText } from "lucide-react";



import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getColumns = (onEdit: (part: Part) => void, onManageCrossRefs: (part: Part) => void) => { 
    const columns: ColumnDef<Part>[] = [
        {
            accessorKey: "sku",
            header: "SKU",
        },
        {
            accessorKey: "crossrefs",
            header: "Cross Refs",
        },
        {
            accessorKey: "oerefs",
            header: "OE Refs",
        },
        {
            id: "actions",
            cell: ({ row }) => {
            const part = row.original
    
                return (
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(part)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onManageCrossRefs(part)}>
                            <GitCompare className="h-4 w-4 mr-2" />
                            Manage Cross-Refs
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Manage OE Refs
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
