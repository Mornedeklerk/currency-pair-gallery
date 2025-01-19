import { CurrencyPairList } from "@/components/CurrencyPairList";

const Index = () => {
  return (
    <main className="min-h-screen bg-gray-50/50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Currency Pair Gallery</h1>
        <CurrencyPairList />
      </div>
    </main>
  );
};

export default Index;