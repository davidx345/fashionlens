"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface SafeImageProps extends React.ComponentProps<typeof Image> {
  fallbackSrc?: string;
}

const SafeImage = React.forwardRef<HTMLImageElement, SafeImageProps>(
  ({ src, fallbackSrc = "/placeholder.svg", alt, className, ...props }, ref) => {
    const [imgSrc, setImgSrc] = React.useState(src);
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
      setImgSrc(src);
      setHasError(false);
    }, [src]);

    const handleError = () => {
      if (imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
        setHasError(true);
      }
    };

    return (
      <Image
        ref={ref}
        src={hasError ? fallbackSrc : (imgSrc || fallbackSrc)}
        alt={alt}
        onError={handleError}
        className={cn(className)}
        {...props}
      />
    );
  }
);

SafeImage.displayName = "SafeImage";

export { SafeImage };
