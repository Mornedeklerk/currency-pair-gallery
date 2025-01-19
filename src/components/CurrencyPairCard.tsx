import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { saveCurrencyPair, saveImage, getImagesForPair } from "@/lib/db";
import { useToast } from "./ui/use-toast";

interface CurrencyPairCardProps {
  onDelete: () => void;
}

export const CurrencyPairCard = ({ onDelete }: CurrencyPairCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currencyPair, setCurrencyPair] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [pairId, setPairId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSavePair = async () => {
    if (!currencyPair) return;
    const id = saveCurrencyPair(currencyPair);
    setPairId(id as number);
    toast({
      title: "Success",
      description: "Currency pair saved successfully",
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !pairId) return;

    try {
      for (const file of Array.from(files)) {
        const blob = new Blob([await file.arrayBuffer()]);
        await saveImage(pairId, blob);
        
        // Create URL for preview
        const imageUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, imageUrl]);
      }

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (pairId) {
      const loadImages = async () => {
        const savedImages = await getImagesForPair(pairId);
        const imageUrls = savedImages.map((img: any) => {
          const blob = new Blob([img.image_data]);
          return URL.createObjectURL(blob);
        });
        setImages(imageUrls);
      };
      loadImages();
    }
  }, [pairId]);

  return (
    <div className="animate-fade-in">
      <div
        className={cn(
          "bg-white rounded-xl shadow-sm border border-gray-100",
          "transition-all duration-300 ease-in-out",
          "hover:shadow-md cursor-pointer",
          isExpanded && "shadow-md"
        )}
      >
        <div
          className="p-6 flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4 flex-1">
            <input
              type="text"
              value={currencyPair}
              onChange={(e) => setCurrencyPair(e.target.value)}
              placeholder="Enter currency pair (e.g., BTC/USD)"
              className={cn(
                "text-lg font-medium bg-transparent outline-none w-full",
                "placeholder:text-gray-400 transition-colors",
                "focus:placeholder:text-gray-500"
              )}
              onClick={(e) => e.stopPropagation()}
            />
            {!pairId && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSavePair();
                }}
              >
                Save
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className={cn(
                "p-2 rounded-full transition-colors",
                "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              )}
            >
              <X size={20} />
            </button>
            {isExpanded ? (
              <ChevronUp className="text-gray-400" />
            ) : (
              <ChevronDown className="text-gray-400" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="p-6 pt-0 animate-fade-in">
            {pairId && (
              <div className="mb-4">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-block"
                >
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Upload size={16} />
                    Upload Images
                  </Button>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
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
          </div>
        )}
      </div>
    </div>
  );
};