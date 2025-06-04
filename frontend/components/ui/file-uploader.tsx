"use client";

import { useState, useCallback, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, FileImage, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  maxSize?: number; // in bytes
  accept?: string; // e.g., 'image/jpeg, image/png'
  label?: string;
  disabled?: boolean;
  currentFile?: File | null; // Prop to control displayed file from parent
  previewUrl?: string | null; // Prop to control displayed preview from parent
  onClear?: () => void; // Prop for parent to handle clear action
}

export function FileUploader({
  onFileUpload,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = 'image/jpeg, image/png, image/webp',
  label = "Drag & drop an outfit image here, or click to select",
  disabled = false,
  currentFile: parentFile = null, // Use prop if provided
  previewUrl: parentPreviewUrl = null, // Use prop if provided
  onClear: parentOnClear, // Use prop if provided
}: FileUploaderProps) {
  // Internal state for immediate feedback during drag/drop, but props take precedence for display
  const [internalError, setInternalError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // Keep for visual feedback if needed

  // Determine what to display based on props or internal state (props take precedence)
  const displayFile = parentFile;
  const displayPreview = parentPreviewUrl;

  useEffect(() => {
    // If parentFile is cleared, reset progress
    if (!parentFile) {
      setUploadProgress(0);
      setInternalError(null);
    }
  }, [parentFile]);  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setInternalError(null);
      setUploadProgress(0);

      if (disabled) return;

      if (rejectedFiles && rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0];
        if (firstError.code === 'file-too-large') {
          setInternalError(`File is too large. Max size is ${maxSize / (1024 * 1024)}MB.`);
        } else if (firstError.code === 'file-invalid-type') {
          setInternalError(`Invalid file type. Accepted types: ${accept}.`);
        } else {
          setInternalError(firstError.message || 'File rejected.');
        }
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        // Simulate progress before calling onFileUpload
        // In a real app, onFileUpload would likely handle the upload and progress reporting
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20; // Faster simulation
          if (progress <= 100) {
            setUploadProgress(progress);
          } else {
            clearInterval(interval);
            onFileUpload(selectedFile); // Notify parent with the new file
            // Parent will then update currentFile and previewUrl props
            // Reset internal progress after notifying parent, parent will control display
            // setUploadProgress(0); // Or let parent control this via a prop if needed
          }
        }, 100);
      }
    },
    [onFileUpload, maxSize, accept, disabled]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    maxSize,
    accept: accept ? accept.split(',').reduce((acc, type) => ({ ...acc, [type.trim()]: [] }), {}) : undefined,
    multiple: false,
    disabled,
  });

  const handleClearClick = () => {
    if (parentOnClear) {
      parentOnClear();
    }
    setInternalError(null);
    setUploadProgress(0);
    // Parent should handle clearing of currentFile and previewUrl props
  };

  const formatAcceptedTypes = (types: string) => {
    return types.split(',').map(type => type.split('/')[1]?.toUpperCase() || type.trim()).join(', ');
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {!displayFile && !disabled && (
        <div
          {...getRootProps()}
          className={`
            p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            flex flex-col items-center justify-center text-center
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary/70'}
            ${isDragAccept ? 'border-green-500' : ''}
            ${isDragReject ? 'border-red-500' : ''}
            bg-card
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{ minHeight: '200px' }}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`w-12 h-12 mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          {isDragActive ? (
            <p className="text-lg font-semibold text-primary">Drop the image here ...</p>
          ) : (
            <p className="text-lg text-muted-foreground">{label}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            (Max file size: {maxSize / (1024 * 1024)}MB. Accepted: {formatAcceptedTypes(accept)})
          </p>
        </div>
      )}

      {internalError && (
        <div className="mt-3 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md dark:text-red-300 dark:bg-red-900/30 dark:border-red-700">
          {internalError}
        </div>
      )}

      {displayFile && (
        <div className="mt-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              {displayPreview ? (
                <Image src={displayPreview} alt={displayFile.name} width={48} height={48} className="rounded object-cover flex-shrink-0" />
              ) : (
                <FileImage className="w-8 h-8 text-primary flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{displayFile.name}</p>
                <p className="text-xs text-muted-foreground">{(displayFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            {parentOnClear && !disabled && (
              <Button variant="ghost" size="icon" onClick={handleClearClick} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && ( // Only show progress if it's ongoing and not yet passed to parent
            <div className="mt-3">
              <Progress value={uploadProgress} className="w-full h-2" />
              <p className="text-xs text-muted-foreground text-right mt-1">{uploadProgress}% processing...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
