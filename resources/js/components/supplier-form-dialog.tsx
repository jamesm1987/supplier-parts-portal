import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import * as SupplierRoutes from '@/routes/suppliers';
import type { Supplier } from '@/types/suppliers';


interface SupplierFormDialogProps {
  supplier?: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export const SupplierFormDialog = ({ supplier, open, onOpenChange }: SupplierFormDialogProps) => {
  const isEditing = !!supplier;

  const {data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: supplier?.name || ''
  })


  useEffect(() => {
    if (open) {
      
      if (supplier) {
      
        setData({
          name: supplier.name,
        });
      
      } else {
      
        reset();
      
      }
    }
  }, [open, supplier]);

  const onSubmit = (e: any) => {
    e.preventDefault();

    const options = {
      onSuccess: () => {
        onOpenChange(false);
          reset();
        },
    };
    
    if (isEditing && supplier) {

      put(SupplierRoutes.update(supplier.id).url, options)

    } else {

      post(SupplierRoutes.store().url, options)

    }

  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
        </DialogHeader>


          <form onSubmit={onSubmit} className="space-y-4">

              <FormItem>
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" error={!!errors.name}>Name *</FormLabel>
                <FormControl>
                  <input
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'}
                  />
                </FormControl>
                <FormMessage error={errors.name}/>
              </FormItem>


            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {isEditing ? 'Update Supplier' : 'Add Supplier'}
              </Button>
            </div>
          </form>

      </DialogContent>
    </Dialog>
  );
};
