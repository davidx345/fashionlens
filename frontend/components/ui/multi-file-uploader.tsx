"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileWithPreview extends File {
  id: string;
  preview: string;
}

interface MultiFileUploaderProps {
  onFilesUpload: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  currentFiles: FileWithPreview[];
  onRemoveFile: (fileId: string) => void;
  onClear: () => void;
  className?: string;
}

export function MultiFileUploader({
  onFilesUpload,
  accept = "image/jpeg, image/png, image/webp",
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  currentFiles,
  onRemoveFile,
  onClear,
  className
}: MultiFileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesUpload(acceptedFiles);
    }
    setDragOver(false);
  }, [onFilesUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize,
    maxFiles: maxFiles - currentFiles.length,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
    disabled: currentFiles.length >= maxFiles
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      {currentFiles.length < maxFiles && (
        <Card className="border-2 border-dashed transition-colors">
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={cn(
                "flex flex-col items-center justify-center space-y-4 text-center cursor-pointer transition-colors rounded-lg p-8",
                isDragActive || dragOver 
                  ? "bg-primary/10 border-primary" 
                  : "hover:bg-muted/50",
                currentFiles.length >= maxFiles && "opacity-50 cursor-not-allowed"
              )}
            >
              <input {...getInputProps()} />
              <div className="mx-auto flex max-w-[200px] flex-col items-center justify-center text-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">
                  {isDragActive 
                    ? "Drop the images here..." 
                    : `Upload outfit images (${currentFiles.length}/${maxFiles})`
                  }
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Drag & drop images here, or click to select files
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports: JPEG, PNG, WebP (max {formatFileSize(maxSize)} each)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div className="space-y-2">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {file.name}: {errors.map(e => e.message).join(', ')}
            </div>
          ))}
        </div>
      )}

      {/* Current Files */}
      {currentFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Selected Images ({currentFiles.length})</h3>
            <Button variant="outline" size="sm" onClick={onClear}>
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFiles.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <div className="relative">
                  <div className="aspect-square bg-muted/30 flex items-center justify-center">
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onLoad={() => URL.revokeObjectURL(file.preview)}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => onRemoveFile(file.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
