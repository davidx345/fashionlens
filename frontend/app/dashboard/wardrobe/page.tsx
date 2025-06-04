"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, AlertTriangle, Loader2, ImageOff } from 'lucide-react';
import { getWardrobeItems, deleteWardrobeItem, WardrobeItem } from '@/app/api/services/wardrobe-service';
import AddItemForm from '@/components/add-item-form'; // To be created
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; 
import Image from 'next/image'; 

// Placeholder for WardrobeItemCard if not created in a separate file yet
const WardrobeItemCard = ({ item, onDelete }: { item: WardrobeItem, onDelete: (itemId: string) => void }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  // Check both imageUrl and image fields (backend uses 'image')
  const imageField = item.imageUrl || item.image;
  const fullImageUrl = imageField?.startsWith('http') ? imageField : `${API_URL}${imageField}`;

  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative aspect-square">        {imageField ? (
          <Image 
            src={fullImageUrl} 
            alt={item.name} 
            fill
            style={{ objectFit: 'cover' }}
            className="bg-muted"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')} // Fallback placeholder
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ImageOff className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold truncate" title={item.name}>{item.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{item.category}</p>
        {item.color && <p className="text-xs text-muted-foreground">Color: {item.color}</p>}
        {item.season && <p className="text-xs text-muted-foreground">Season: {item.season}</p>}
      </CardContent>
      <CardFooter className="p-4 flex justify-end space-x-2">
        {/* <Button variant="outline" size="sm" onClick={() => onEdit(item)} className="text-blue-500 border-blue-500 hover:bg-blue-50">
          <Edit3 className="w-4 h-4 mr-1" /> Edit
        </Button> */}
        <Button variant="outline" size="sm" onClick={() => onDelete(item._id)} className="text-red-500 border-red-500 hover:bg-red-50">
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null); // For edit functionality

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedItems = await getWardrobeItems();
      setItems(fetchedItems);    } catch (err: unknown) {
      setError((err as Error).message || "Failed to fetch wardrobe items.");
      console.error("Failed to fetch items:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAddItemSuccess = () => {
    setIsAddModalOpen(false);
    fetchItems(); // Refresh list
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteWardrobeItem(itemId);
      setItems(prevItems => prevItems.filter(item => item._id !== itemId));    } catch (err: unknown) {
      setError((err as Error).message || "Failed to delete item.");
      console.error("Failed to delete item:", err);
    }
  };
  
  // const handleEditItem = (item: WardrobeItem) => {
  //   setEditingItem(item);
  //   setIsAddModalOpen(true); // Reuse modal for editing
  // };

  // const handleEditItemSuccess = () => {
  //   setEditingItem(null);
  //   setIsAddModalOpen(false);
  //   fetchItems();
  // };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">My Wardrobe</h1>
          <p className="text-muted-foreground mt-2">
            Manage your clothing items, accessories, and more.
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="w-5 h-5 mr-2" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-lg">
            <DialogHeader>
              <DialogTitle>&quot;Add New Wardrobe Item&quot;</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new item to your wardrobe.
              </DialogDescription>
            </DialogHeader>
            <AddItemForm 
              onSuccess={handleAddItemSuccess} 
              // itemToEdit={editingItem} 
              // onCancel={() => { setEditingItem(null); setIsAddModalOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-12 min-h-[300px]">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
          <p className="text-xl font-semibold text-foreground">Loading your wardrobe...</p>
          <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      )}

      {error && !isLoading && (
        <Card className="w-full max-w-3xl mx-auto shadow-xl border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-destructive">
              <AlertTriangle className="w-6 h-6 mr-3" /> Error Loading Wardrobe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={fetchItems}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="text-center py-12">
          <ImageOff className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground">Your wardrobe is empty!</h3>
          <p className="text-muted-foreground mt-2">
            Start by adding your first clothing item or accessory.
          </p>
        </div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map(item => (            <WardrobeItemCard 
              key={item._id} 
              item={item} 
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
