import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { saveCurrencyPair, getImagesForPair } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { ImageGallery } from "./ImageGallery";

interface CurrencyPairCardProps {
  onDelete: () => void;
}

export const CurrencyPairCard = ({ onDelete }: CurrencyPairCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currencyPair, setCurrencyPair] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [pairId, setPairId] = useState<number | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSavePair = async () => {
    if (!currencyPair) {
      toast({
        title: "Error",
        description: "Please enter a currency pair first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Saving currency pair:", currencyPair);
      const id = await saveCurrencyPair(currencyPair);
      console.log("Currency pair saved with ID:", id);
      setPairId(id);
      toast({
        title: "Success",
        description: "Currency pair saved successfully. You can now upload images!",
      });
    } catch (error) {
      console.error("Error saving currency pair:", error);
      toast({
        title: "Error",
        description: "Failed to save currency pair",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !pairId) return;

    try {
      for (const file of Array.from(files)) {
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          if (!e.target?.result) return;

          const arrayBuffer = e.target.result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: file.type });
          
          await saveImage(pairId, blob);
          const imageUrl = URL.createObjectURL(blob);
          setImages(prev => [...prev, imageUrl]);
        };

        fileReader.readAsArrayBuffer(file);
      }

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (pairId) {
      console.log("Loading images for pairId:", pairId);
      const loadImages = async () => {
        try {
          const savedImages = await getImagesForPair(pairId);
          console.log("Retrieved images:", savedImages);
          const imageUrls = savedImages.map((img: any) => {
            const blob = new Blob([img.image_data]);
            return URL.createObjectURL(blob);
          });
          setImages(imageUrls);
        } catch (error) {
          console.error("Error loading images:", error);
        }
      };
      loadImages();
    }
  }, [pairId]);

  return (
    <div className="animate-fade-in">
      <div className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-md"
      )}>
        <div className="p-6 flex items-center justify-between">
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
            />
            {!pairId && (
              <Button variant="outline" size="sm" onClick={handleSavePair}>
                Save
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {pairId && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Upload size={20} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </>
            )}
            <button
              onClick={onDelete}
              className={cn(
                "p-2 rounded-full transition-colors",
                "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              )}
            >
              <X size={20} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "p-2 rounded-full transition-colors",
                "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              )}
            >
              {isExpanded ? (
                <ChevronUp className="text-gray-400" />
              ) : (
                <ChevronDown className="text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-6 pt-0 animate-fade-in">
            {pairId ? (
              <div className="space-y-4">
                <ImageGallery images={images} pairId={pairId} />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Save the currency pair to enable image uploads
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};