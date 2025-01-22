import { CurrencyPairList } from "@/components/CurrencyPairList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Currency Pair Gallery</h1>
        <p className="text-center text-gray-600 mb-8">
          Add and manage your currency pairs with associated images and descriptions.
        </p>
        <CurrencyPairList />
      </div>
    </div>
  );
};

export default Index;