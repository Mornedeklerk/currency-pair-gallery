import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const ImageModal = ({ isOpen, onClose, imageUrl }: ImageModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0">
        <img
          src={imageUrl}
          alt="Full size preview"
          className="w-full h-auto rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
};