import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Attribute } from '@/types/attributes';
import * as AttributeRoutes from '@/routes/attributes';
import {
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


interface AttributeFormDialogProps {
  attribute?: Attribute | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export const AttributeFormDialog = ({ attribute, open, onOpenChange }: AttributeFormDialogProps) => {
  const isEditing = !!attribute;

  const {data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    label: attribute?.label || '',
    type: attribute?.type || '',
    unit: attribute?.unit || ''
  })


  useEffect(() => {
    if (open) {
      
      if (attribute) {
      
        setData({
          label: attribute.label,
          type: attribute.type,
          unit: attribute.unit,
        });
      
      } else {
      
        reset();
      
      }
    }
  }, [open, attribute]);

  const onSubmit = (e: any) => {
    e.preventDefault();

    const options = {
      onSuccess: () => {
        onOpenChange(false);
          reset();
        },
    };
    
    if (isEditing && attribute) {

      put(AttributeRoutes.update(attribute.id).url, options)

    } else {

      post(AttributeRoutes.store().url, options)

    }

  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Attribute' : 'Add New Attribute'}</DialogTitle>
        </DialogHeader>


          <form onSubmit={onSubmit} className="space-y-4">

              <FormItem>
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" error={!!errors.label}>Label *</FormLabel>
                <FormControl>
                  <input
                    value={data.label}
                    onChange={e => setData('label', e.target.value)}
                    className={errors.label ? 'border-destructive' : 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'}
                  />
                </FormControl>
                <FormMessage error={errors.label}/>
              </FormItem>

              <FormItem>
                <FormLabel error={!!errors.type}>Type *</FormLabel>

                <Select 
                  value={data.type} 
                  onValueChange={(value) => setData('type', value)}
                >
                  <FormControl>
                    <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage error={errors.unit}/>
              </FormItem>       

              <FormItem>
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" error={!!errors.unit}>Unit</FormLabel>
                <FormControl>
                  <input
                    value={data.unit}
                    onChange={e => setData('unit', e.target.value)}
                    className={errors.unit ? 'border-destructive' : 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'}
                  />
                </FormControl>
                <FormMessage error={errors.unit}/>
              </FormItem>              


            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {isEditing ? 'Update Attribute' : 'Add Attribute'}
              </Button>
            </div>
          </form>

      </DialogContent>
    </Dialog>
  );
};
