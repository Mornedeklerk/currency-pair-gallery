import { useState } from "react";
import { Plus } from "lucide-react";
import { CurrencyPairCard } from "./CurrencyPairCard";
import { cn } from "@/lib/utils";

export const CurrencyPairList = () => {
  const [cards, setCards] = useState([0]);

  const addCard = () => {
    setCards([...cards, cards.length]);
  };

  const removeCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-4">
        {cards.map((_, index) => (
          <CurrencyPairCard
            key={index}
            onDelete={() => removeCard(index)}
          />
        ))}
      </div>
      
      <button
        onClick={addCard}
        className={cn(
          "w-full p-4 rounded-xl border border-dashed",
          "border-gray-200 text-gray-500",
          "transition-all duration-300 ease-in-out",
          "hover:border-gray-300 hover:text-gray-700",
          "hover:shadow-sm",
          "flex items-center justify-center gap-2"
        )}
      >
        <Plus size={20} />
        <span>Add Currency Pair</span>
      </button>
    </div>
  );
};