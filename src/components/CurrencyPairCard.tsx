import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencyPairCardProps {
  onDelete: () => void;
}

export const CurrencyPairCard = ({ onDelete }: CurrencyPairCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currencyPair, setCurrencyPair] = useState("");
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  ]);

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