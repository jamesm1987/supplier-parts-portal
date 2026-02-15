import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Taxonomy } from '@/types/taxonomies';
import * as TaxonomiesRoutes from '@/routes/taxonomies';
import {
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { slugify } from '@/lib/utils';


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
                <FormLabel error={!!errors.name}>Name *</FormLabel>
                <FormControl>
                  <input
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                </FormControl>
                <FormMessage error={errors.name}/>
              </FormItem>

              <FormItem>
                <FormLabel error={!!errors.slug}>Slug *</FormLabel>
                <FormControl>
                  <input
                    value={data.slug}
                    onChange={e => setData('slug', slugify(e.target.value))}
                    className={errors.slug ? 'border-destructive' : ''}
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
