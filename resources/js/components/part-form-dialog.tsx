import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Part } from '@/types/parts';
import { Taxonomy } from '@/types/taxonomies';
import * as PartRoutes from '@/routes/parts';
import {
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";


interface PartFormDialogProps {
  part?: Part | null;
  taxonomies: Taxonomy[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export const PartFormDialog = ({part, taxonomies, open, onOpenChange }: PartFormDialogProps) => {
  const isEditing = !!part;

  const {data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    sku: part?.sku || '',
    description: part?.description || '',
    contents: part?.contents || '',
    taxonomy_terms: {} as Record<number, number>

  })


  useEffect(() => {
    if (open) {
      
      if (part) {

        const mappedTerms = part.taxonomy_terms.reduce((acc, term) => {
          acc[term.taxonomy_id] = term.id;
            return acc;
        }, {} as Record<number, number>);
      
        setData({
          sku: part.sku,
          description: part.description,
          contents: part.contents,
          taxonomy_terms: mappedTerms, 
        });
      
      } else {
      
        reset();
      
      }
    }
  }, [open, part]);

  const onSubmit = (e: any) => {
    e.preventDefault();

    const options = {
      onSuccess: () => {
        onOpenChange(false);
          reset();
        },
    };
    
    if (isEditing && part) {

      put(PartRoutes.update(part.id).url, options)

    } else {

      post(PartRoutes.store().url, options)

    }

  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Part' : 'Add New Part'}</DialogTitle>
        </DialogHeader>


          <form onSubmit={onSubmit} className="space-y-4">

              <FormItem>
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" error={!!errors.sku}>SKU *</FormLabel>
                <FormControl>
                  <Input
                    value={data.sku}
                    onChange={e => setData('sku', e.target.value)}
                    className={errors.sku ? 'border-destructive' : 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'}
                  />
                </FormControl>
                <FormMessage error={errors.sku}/>
              </FormItem>

              <FormItem>
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"error={!!errors.description}>Description *</FormLabel>
                <FormControl>
                  <Input
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    className={errors.description ? 'border-destructive' : 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'}
                  />
                </FormControl>
                <FormMessage error={errors.description}/>
              </FormItem>

              {taxonomies.map((taxonomy) => (
                <FormItem key={taxonomy.id}>
                  <FormLabel>{taxonomy.name} *</FormLabel>
                  <Select
                    value={data.taxonomy_terms[taxonomy.id]?.toString() || ""}
                    onValueChange={(termId) => setData('taxonomy_terms', {
                      ...data.taxonomy_terms,
                      [taxonomy.id]: parseInt(termId)
                    })}
                  >
                  <FormControl>
                    <SelectTrigger className={errors.description ? 'border-destructive' : ''}>
                      <SelectValue placeholder={`Select ${taxonomy.name}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {taxonomy.terms.map((term) => (
                      <SelectItem key={term.id} value={term.id.toString()}>{term.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage/>
              </FormItem>
              ))}

              <FormItem>
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" error={!!errors.contents}>Contents</FormLabel>
                <FormControl>
                  <Textarea
                    value={data.contents}
                    onChange={e => setData('contents', e.target.value)}
                    className={errors.contents ? 'border-destructive' : 'flex h-[10rem] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'}
                  />
                </FormControl>
                <FormMessage error={errors.contents}/>
              </FormItem>


            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {isEditing ? 'Update Part' : 'Add Part'}
              </Button>
            </div>
          </form>

      </DialogContent>
    </Dialog>
  );
};
