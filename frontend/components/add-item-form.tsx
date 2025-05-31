"use client";

import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addWardrobeItem } from "@/app/api/services/wardrobe-service";
import { WardrobeItem } from "@/app/api/services/wardrobe-service"; // Assuming WardrobeItem type is exported
import { Loader2, AlertTriangle, ImageIcon, X } from "lucide-react";

interface AddItemFormProps {
  onSuccess: () => void;
  // itemToEdit?: WardrobeItem | null; // For future edit functionality
  // onCancel?: () => void; // For future edit functionality
}

const AddItemForm = ({ onSuccess }: AddItemFormProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [season, setSeason] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean up image preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
    
    // Clean up previous preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    // Create new preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    // Clear the file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!imageFile) {
      setError("Please select an image file.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("color", color);
    formData.append("season", season);
    formData.append("image", imageFile);

    try {
      await addWardrobeItem(formData);
      onSuccess();
      // Reset form fields
      setName("");
      setCategory("");
      setColor("");      setSeason("");
      setImageFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      // Clear the file input visually (this is a bit tricky, might need a ref or key change)
      const fileInput = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err: any) {
      setError(err.message || "Failed to add item. Please try again.");
      console.error("Failed to add item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/50 text-destructive rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Blue Denim Jacket"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Outerwear, Tops, Shoes"
          required
          disabled={isLoading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g., Blue, Black, Multi-color"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="season">Season</Label>
          <Input
            id="season"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            placeholder="e.g., Spring, Winter, All-season"
            disabled={isLoading}
          />
        </div>
      </div>      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          disabled={isLoading}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
        {imageFile && <p className="text-xs text-muted-foreground mt-1">Selected: {imageFile.name}</p>}
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4 relative">
            <div className="w-full max-w-xs mx-auto rounded-lg overflow-hidden border border-muted bg-muted/30">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
              onClick={handleRemoveImage}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Placeholder when no image */}
        {!imagePreview && (
          <div className="mt-4 w-full max-w-xs mx-auto h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">Image preview will appear here</p>
            </div>
          </div>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Item...
          </>
        ) : (
          "Add Item to Wardrobe"
        )}
      </Button>
    </form>
  );
};

export default AddItemForm;
