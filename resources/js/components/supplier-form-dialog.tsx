import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Part, PartSpecification } from '@/types/suppliers';
import { useParts } from '@/contexts/SuppliersContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const partSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type SupplierFormValues = z.infer<typeof partSchema>;

interface SupplierFormDialogProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = ['Bearings', 'Seals', 'Belts', 'Filters', 'Gears', 'Chains'];

export const SupplierFormDialog = ({ supplier, open, onOpenChange }: SupplierFormDialogProps) => {
  const { addSupplier, updateSupplier } = useSuppliers();
  const { toast } = useToast();
  const isEditing = !!supplier;

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: ''
    },
  });

  useEffect(() => {
    if (supplier) {
      form.reset({
        name: supplier.name,
      });
    } else {
      form.reset({
        name: '',
      });
    }
  }, [supplier, form]);

  const onSubmit = (values: SupplierFormValues) => {

    const supplierData = {
      name: values.name,
    };

    if (isEditing && supplier) {
      updateSupplier(supplier.id, supplierData);
      toast({ title: 'Supplier updated successfully' });
    } else {
      addSupplier(supplierData);
      toast({ title: 'Supplier added successfully' });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Supplier name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Supplier' : 'Add Supplier'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
