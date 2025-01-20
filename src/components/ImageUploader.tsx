import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { saveImage } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  pairId: number;
  onImageUpload: (imageUrl: string) => void;
}

export const ImageUploader = ({ pairId, onImageUpload }: ImageUploaderProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      console.log("No files selected");
      return;
    }

    try {
      console.log("Starting image upload for pairId:", pairId);
      for (const file of Array.from(files)) {
        console.log("Processing file:", file.name);
        const blob = new Blob([await file.arrayBuffer()]);
        await saveImage(pairId, blob);
        console.log("Image saved to DB");
        
        const imageUrl = URL.createObjectURL(file);
        onImageUpload(imageUrl);
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

  return (
    <div className="flex items-center gap-4">
      <label htmlFor="image-upload" className="cursor-pointer inline-block">
        <Button variant="outline" className="gap-2">
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
      />
    </div>
  );
};