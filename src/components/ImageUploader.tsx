import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { saveImage } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

interface ImageUploaderProps {
  pairId: number;
  onImageUpload: (imageUrl: string) => void;
}

export const ImageUploader = ({ pairId, onImageUpload }: ImageUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log("No files selected");
      return;
    }

    try {
      console.log("Starting image upload for pairId:", pairId);
      for (const file of Array.from(files)) {
        console.log("Processing file:", file.name);
        
        // Convert file to blob
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          if (!e.target?.result) {
            console.error("Failed to read file");
            return;
          }

          const arrayBuffer = e.target.result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: file.type });
          
          // Save to IndexedDB
          await saveImage(pairId, blob);
          console.log("Image saved to DB");
          
          // Create URL for preview
          const imageUrl = URL.createObjectURL(blob);
          onImageUpload(imageUrl);
          console.log("Image URL created:", imageUrl);
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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" className="gap-2" onClick={handleButtonClick}>
        <Upload size={16} />
        Upload Images
      </Button>
      <input
        ref={fileInputRef}
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
};