import Store from 'electron-store';

const store = new Store({
  name: 'currency-pairs-db', // This will create a JSON file in your user directory
  defaults: {
    currency_pairs: [],
    images: [],
    descriptions: []
  }
});

interface CurrencyPair {
  id?: number;
  pair_name: string;
}

interface ImageData {
  id?: number;
  currency_pair_id: number;
  image_data: Blob;
  created_at: Date;
}

interface ImageDescription {
  id?: number;
  currency_pair_id: number;
  image_url: string;
  description: string;
}

export const saveCurrencyPair = async (pairName: string): Promise<number> => {
  const pairs = store.get('currency_pairs') as CurrencyPair[];
  const newId = pairs.length + 1;
  const newPair = { id: newId, pair_name: pairName };
  
  store.set('currency_pairs', [...pairs, newPair]);
  console.log('Saved currency pair to local storage:', newPair);
  
  return newId;
};

export const saveImage = async (currencyPairId: number, imageData: Blob): Promise<void> => {
  // Convert Blob to Base64 for storage
  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(imageData);
  });

  const images = store.get('images') as any[];
  const newImage = {
    id: images.length + 1,
    currency_pair_id: currencyPairId,
    image_data: base64,
    created_at: new Date()
  };
  
  store.set('images', [...images, newImage]);
  console.log('Saved image to local storage for pair:', currencyPairId);
};

export const getImagesForPair = async (currencyPairId: number): Promise<ImageData[]> => {
  const images = store.get('images') as any[];
  const pairImages = images.filter(img => img.currency_pair_id === currencyPairId);
  
  // Convert Base64 back to Blob
  return pairImages.map(img => ({
    ...img,
    image_data: dataURLtoBlob(img.image_data)
  }));
};

export const saveImageDescription = async (
  currencyPairId: number,
  imageUrl: string,
  description: string
): Promise<void> => {
  const descriptions = store.get('descriptions') as ImageDescription[];
  const newDescription = {
    id: descriptions.length + 1,
    currency_pair_id: currencyPairId,
    image_url: imageUrl,
    description: description
  };
  
  // Remove any existing description for this image
  const filteredDescriptions = descriptions.filter(
    desc => !(desc.currency_pair_id === currencyPairId && desc.image_url === imageUrl)
  );
  
  store.set('descriptions', [...filteredDescriptions, newDescription]);
  console.log('Saved description to local storage:', newDescription);
};

export const getDescriptionsForPair = async (currencyPairId: number): Promise<ImageDescription[]> => {
  const descriptions = store.get('descriptions') as ImageDescription[];
  return descriptions.filter(desc => desc.currency_pair_id === currencyPairId);
};

export const getAllPairs = async (): Promise<CurrencyPair[]> => {
  return store.get('currency_pairs') as CurrencyPair[];
};

// Helper function to convert Base64 data URL to Blob
function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}