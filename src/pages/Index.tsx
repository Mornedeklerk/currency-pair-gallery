import { CurrencyPairList } from "@/components/CurrencyPairList";

const Index = () => {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Currency Pair Gallery</h1>
        <p className="text-center text-gray-600 mb-8">
          Add and manage your currency pairs with associated images and descriptions.
        </p>
        <CurrencyPairList />
      </div>
    </main>
  );
};

export default Index;