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
import { slugify } from '@/lib/utils';
import * as TaxonomiesRoutes from '@/routes/taxonomies';
import type { Taxonomy } from '@/types/taxonomies';


interface TaxonomyFormDialogProps {
  taxonomy?: Taxonomy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export const TaxonomyFormDialog = ({ taxonomy, open, onOpenChange }: TaxonomyFormDialogProps) => {
  const isEditing = !!taxonomy;

  const {data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: taxonomy?.name || '',
    slug: taxonomy?.slug || ''
  })


  useEffect(() => {
    if (open) {
      
      if (taxonomy) {
      
        setData({
          name: taxonomy.name,
          slug: taxonomy.slug,
        });
      
      } else {
      
        reset();
      
      }
    }
  }, [open, taxonomy]);

  const onSubmit = (e: any) => {
    e.preventDefault();

    const options = {
      onSuccess: () => {
        onOpenChange(false);
          reset();
        },
    };
    
    if (isEditing && taxonomy) {

      put(TaxonomiesRoutes.update(taxonomy.id).url, options)

    } else {

      post(TaxonomiesRoutes.store().url, options)

    }

  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Taxonomy' : 'Add New Taxonomy'}</DialogTitle>
        </DialogHeader>


          <form onSubmit={onSubmit} className="space-y-4">

              <FormItem>
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" error={!!errors.name}>Name *</FormLabel>
                <FormControl>
                  <Input
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'}
                  />
                </FormControl>
                <FormMessage error={errors.name}/>
              </FormItem>

              <FormItem>
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" error={!!errors.slug}>Slug *</FormLabel>
                <FormControl>
                  <Input
                    value={data.slug}
                    onChange={e => setData('slug', e.target.value)}
                    className={errors.slug ? 'border-destructive' : 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'}
                  />
                </FormControl>
                <FormMessage error={errors.slug}/>
              </FormItem>              


            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {isEditing ? 'Update Taxonomy' : 'Add Taxonomy'}
              </Button>
            </div>
          </form>

      </DialogContent>
    </Dialog>
  );
};
