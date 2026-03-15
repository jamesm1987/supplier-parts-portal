import { useForm } from '@inertiajs/react';
import { ArrowRight, Check, Link2, Pencil, Plus, X } from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import * as PartRoutes from '@/routes/parts';
import { CrossReference } from '@/types/parts';
import type { Part} from '@/types/parts';
import type { Supplier } from '@/types/suppliers';

interface CrossRefManagerProps {
  part: Part | null | undefined;
  suppliers: Supplier[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CrossRefEditor = ({ part, suppliers, open, onOpenChange }: CrossRefManagerProps) => {

  const { data, setData, post, put, delete: deleteRecord, errors, reset, clearErrors, processing } = useForm({
    part_id: '',
    supplier_id: '',
    part_number: '',
    superseded_by: '',
    superseded_part: ''
  });

  const [addMode, setAddMode] = useState('crossRef');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSupplierId, setEditSupplierId] = useState('');
  const [editPartNumber, setEditPartNumber] = useState('');

  useEffect(() => {
    if (open && part) {
      setData('part_id', part.id.toString());
    } else if (!open) {
      reset();
      clearErrors();
      setAddMode('crossRef');
    }
  }, [open, part, setData, reset, clearErrors]);

  if (!part) return null;

  const crossRefs = part.crossReferences ?? [];


  const handleAdd = () => {
    if (addMode === 'crossRef') {
      if (!data.supplier_id || !data.part_number.trim()) {
        return;
      }
    } else if (addMode === 'supersession') {
      if ( !data.part_number.trim()) {
        return;
      }

      const supersededRef = crossRefs.find(ref => ref.id.toString() === data.superseded_by);
      if (supersededRef) {
        setData('supplier_id', supersededRef.supplier_id.toString());
        setData('superseded_part', supersededRef.id.toString());
      }
    }

    const params: { part: string | number } = { part: part.id };

    const options = {
      onSuccess: () => {
        onOpenChange(false);
          reset();
          setAddMode('crossRef');
        },
    };

    post(PartRoutes.default.crossReferences.store.url(params), options);
  };

  const handleStartEdit = (ref: CrossReference) => {
    setEditingId(ref.id);
    setEditSupplierId(ref.supplier_id.toString());
    setEditPartNumber(ref.part_number);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    setData('supplier_id', editSupplierId);
    setData('part_number', editPartNumber);

    const params: { part: number; cross_reference: number } = { 
      part: part.id, 
      cross_reference: editingId 
    };

    put(PartRoutes.default.crossReferences.update.url(params), {
      onSuccess: () => {
        setEditingId(null);
        setEditSupplierId('');
        setEditPartNumber('');
        reset();
      },
    });
  };

  const handleRemove = (crossRefId: number) => {
    const params: { part: string | number; cross_reference: number } = { 
      part: part.id, 
      cross_reference: crossRefId 
    };

    deleteRecord(PartRoutes.default.crossReferences.destroy.url(params), {
      onSuccess: () => {

      },
    });
  };

  const handleSupersessionChange = (crossRefId: number, supersededBy: string | undefined) => {
    setData('superseded_by', supersededBy || '');

    const params: { part: number; cross_reference: number } = { 
      part: part.id, 
      cross_reference: crossRefId 
    };

    put(PartRoutes.default.crossReferences.update.url(params), {
      onSuccess: () => {

      },
    });
  };

  const getSupersessionTarget = (ref: CrossReference) => {
    if (!ref.superseded_by) return null;
    return crossRefs.find(r => r.id === ref.superseded_by);
  };

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

          <div className="mt-6 space-y-6 px-6">
            {/* Source Part Info */}
              <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground mb-1">Part</p>
                  <p className="font-mono font-bold text-lg">{part.sku}</p>
              </div>

              <div className="space-y-4">
              <h3 className="font-semibold text-base">
                Cross-References ({crossRefs.length})
              </h3>
              {crossRefs.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No cross-references added yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {crossRefs.map((ref) => {
                    const supersededByRef = getSupersessionTarget(ref);
                    const isEditing = editingId === ref.id;

                    return (
                      <div
                        key={ref.id}
                        className="p-4 rounded-lg border bg-card space-y-3"
                      >
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Supplier</label>
                                <Select
                                  value={editSupplierId}
                                  onValueChange={setEditSupplierId}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select supplier" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {suppliers.map((supplier) => (
                                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                        {supplier.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Part Number</label>
                                <Input
                                  value={editPartNumber}
                                  onChange={(e) => setEditPartNumber(e.target.value)}
                                  placeholder="Part Number"
                                  className="h-9"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                              <Button size="sm" onClick={handleSaveEdit}>
                                <Check className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-medium text-sm">{ref.part_number}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {ref.supplier.name}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => handleStartEdit(ref)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemove(ref.id)}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Supersession selector */}
                        <div className="pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground text-xs">Superseded by:</span>
                            <Select
                              value={ref.superseded_by?.toString() || '_none'}
                              onValueChange={(val) =>
                                handleSupersessionChange(ref.id, val === '_none' ? undefined : val)
                              }
                            >
                              <SelectTrigger className="h-8 flex-1 max-w-xs">
                                <SelectValue placeholder="None" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="_none">None</SelectItem>
                                {crossRefs
                                  .filter(r => r.id !== ref.id)
                                  .map(r => (
                                    <SelectItem key={r.id} value={r.id.toString()}>
                                      {r.supplier.name} - {r.part_number}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {supersededByRef && (
                            <p className="text-xs text-muted-foreground mt-1 ml-6">
                              → {supersededByRef.supplier.name} {supersededByRef.part_number}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

              <Separator />

              <div className="space-y-4">
                  <div className="flex items-center gap-4">
                      <h3 className="font-semibold text-base">Add New</h3>
                      <div className="flex rounded-lg border p-1">
                          <button
                              type="button"
                              onClick={() => setAddMode('crossRef')}
                              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                  addMode === 'crossRef'
                                      ? 'bg-primary text-primary-foreground'
                                      : 'text-muted-foreground hover:text-foreground'
                              }`}
                          >
                              Cross-Reference
                          </button>
                          <button
                              type="button"
                              onClick={() => setAddMode('supersession')}
                              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                  addMode === 'supersession'
                                      ? 'bg-primary text-primary-foreground'
                                      : 'text-muted-foreground hover:text-foreground'
                              }`}
                          >
                              Supersession
                          </button>
                      </div>
                  </div>

                  <div className="space-y-4">
                      {addMode === 'crossRef' ? (
                          <>
                              <FormItem>
                                  <FormLabel className="text-sm font-medium">Supplier</FormLabel>
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
                              
                              <FormItem>
                                  <FormLabel className="text-sm font-medium">Part Number</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="Part Number"
                                          value={data.part_number}
                                          onChange={(e) => setData('part_number', e.target.value)}
                                      />
                                  </FormControl>
                              </FormItem>
                          </>
                      ) : (
                          <>
                              <FormItem>
                                  <FormLabel className="text-sm font-medium">Part</FormLabel>
                                  <Select
                                      value={data.superseded_by?.toString() || ""}
                                      onValueChange={(superseded_by) => setData('superseded_by', superseded_by)}
                                  >
                                      <FormControl>
                                          <SelectTrigger>
                                          <SelectValue placeholder="Select part" />
                                          </SelectTrigger>
                                      </FormControl>
                                      <SelectContent position="item-aligned">
                                          {crossRefs.map((ref) => (
                                              <SelectItem key={ref.id} value={ref.id.toString()}>
                                                  {ref.part_number}
                                              </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                              </FormItem>
                              
                              <FormItem>
                                  <FormLabel className="text-sm font-medium">New Part Number</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="New part number"
                                          value={data.part_number}
                                          onChange={(e) => setData('part_number', e.target.value)}
                                      />
                                  </FormControl>
                              </FormItem>
                          </>
                      )}

                      <div className="flex justify-end">
                          <Button onClick={handleAdd} disabled={processing}>
                              <Plus className="h-4 w-4 mr-2" />
                              {addMode === 'crossRef' ? 'Add Cross-Reference' : 'Add Supersession'}
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };