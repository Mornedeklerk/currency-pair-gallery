import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { ImageModal } from "./ImageModal";

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) {
    return null;
  }

  const handleDescriptionChange = (imageUrl: string, description: string) => {
    setDescriptions((prev) => ({
      ...prev,
      [imageUrl]: description,
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="space-y-2"
          >
            <div
              className={cn(
                "aspect-video rounded-lg overflow-hidden",
                "bg-gray-100 relative group cursor-pointer"
              )}
              onClick={() => setSelectedImage(image)}
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
            <Textarea
              placeholder="Add a description..."
              value={descriptions[image] || ""}
              onChange={(e) => handleDescriptionChange(image, e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        ))}
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ""}
      />
    </>
  );
};