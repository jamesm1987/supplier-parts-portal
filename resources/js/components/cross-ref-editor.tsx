import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Part, CrossReference } from '@/types/parts';
import { Supplier } from '@/types/suppliers';
import * as PartRoutes from "@/routes/parts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Plus, X, Link2 } from 'lucide-react';

interface CrossRefManagerProps {
  part: Part | null | undefined;
  suppliers: Supplier[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CrossRefEditor = ({ part, suppliers, open, onOpenChange }: CrossRefManagerProps) => {

  if (!part) return null;

   const {data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        part_id: part?.id ?? '',
        supplier_id: '',
        part_number: ''
   })

  const crossRefs = part.crossReferences ?? [];

    useEffect(() => {
      if (open && part) {
        
        
          setData('part_id', part.id);
        
        } else if(!open){
        
          reset();
          clearErrors();
        
      }
    }, [open, part]);

  const handleAdd = () => {

    const options = {
      onSuccess: () => {
        onOpenChange(false);
          reset();
        },
    }
  };

  post(PartRoutes.parts.cross-crossReferences.store().url, 1, 2);

//   const handleRemove = (index: number) => {
//     const updated = crossRefs.filter((_, i) => i !== index);
//     put(part.id, { crossReferences: updated });
//   };

if (!open) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Manage Cross-References
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Source Part Info */}
            <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-1">Part</p>
                <p className="font-mono font-bold text-lg">{part.sku}</p>
            </div>

            <div>
                <h3 className="font-semibold mb-3">
                Cross-References ({crossRefs.length})
                </h3>
                {crossRefs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                    No cross-references added yet
                </p>
                ) : (
                <div className="space-y-2">
                    {crossRefs.map((ref, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border bg-background"
                    >
                        <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-medium">{ref.partNumber}</span>
                            <Badge variant="secondary" className="text-xs">
                            {ref.supplier}
                            </Badge>
                        </div>
                        </div>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        // onClick={() => ()}
                        >
                        <X className="h-4 w-4" />
                        </Button>
                    </div>
                    ))}
                </div>
                )}
            </div>

            <Separator />

            <div>
                <h3 className="font-semibold mb-3">Add Cross-Reference</h3>
                <div className="flex gap-2">

                    <form className="space-y-4">
                        <FormItem>
                            <Select
                                value={data.supplier_id?.toString() || ""}
                                onValueChange={(supplier_id) => setData('supplier_id', supplier_id.toString())}
                            >
                                <FormControl>
                                    <SelectTrigger className={errors.supplier_id ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Select supplier" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent position="item-aligned">
                                    {suppliers.map((supplier) => (
                                        <SelectItem key={supplier.id} value={supplier.id.toString()}>{supplier.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                        
                        <Input
                            placeholder="Part Number"
                            value=""
                            className="flex-1"
                        />
                        <Button onClick={handleAdd}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                        </Button>
                    </form>
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};