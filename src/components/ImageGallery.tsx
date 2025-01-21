import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ImageModal } from "./ImageModal";
import { saveImageDescription, getDescriptionsForPair } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

interface ImageGalleryProps {
  images: string[];
  pairId: number;
}

export const ImageGallery = ({ images, pairId }: ImageGalleryProps) => {
  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadDescriptions = async () => {
      try {
        console.log("Loading descriptions for pairId:", pairId);
        const savedDescriptions = await getDescriptionsForPair(pairId);
        console.log("Retrieved descriptions:", savedDescriptions);
        
        const descriptionsMap = savedDescriptions.reduce((acc, desc) => ({
          ...acc,
          [desc.image_url]: desc.description
        }), {});
        
        setDescriptions(descriptionsMap);
      } catch (error) {
        console.error("Error loading descriptions:", error);
      }
    };
    
    if (pairId) {
      loadDescriptions();
    }
  }, [pairId]);

  if (images.length === 0) {
    return null;
  }

  const handleDescriptionChange = (imageUrl: string, description: string) => {
    setDescriptions(prev => ({
      ...prev,
      [imageUrl]: description
    }));
  };

  const handleSaveDescription = async (imageUrl: string) => {
    try {
      console.log("Saving description for image:", imageUrl);
      await saveImageDescription(pairId, imageUrl, descriptions[imageUrl] || "");
      console.log("Description saved successfully");
      
      toast({
        title: "Success",
        description: "Description saved successfully",
      });
    } catch (error) {
      console.error("Error saving description:", error);
      toast({
        title: "Error",
        description: "Failed to save description",
        variant: "destructive",
      });
    }
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
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a description..."
                value={descriptions[image] || ""}
                onChange={(e) => handleDescriptionChange(image, e.target.value)}
                className="min-h-[80px] resize-none flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleSaveDescription(image)}
                className="h-10 w-10"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
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