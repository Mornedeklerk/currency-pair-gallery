import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            "aspect-video rounded-lg overflow-hidden",
            "bg-gray-100 relative group"
          )}
        >
          <img
            src={image}
            alt={`Currency pair image ${index + 1}`}
            className={cn(
              "w-full h-full object-cover",
              "transition-transform duration-300",
              "group-hover:scale-105"
            )}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};