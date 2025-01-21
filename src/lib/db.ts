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

// Initialize IndexedDB
const initDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('currency-pairs-db', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('currency_pairs')) {
        db.createObjectStore('currency_pairs', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('descriptions')) {
        db.createObjectStore('descriptions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

// Helper function to perform IndexedDB operations
const dbOperation = async (storeName: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => void) => {
  const db = await initDB() as IDBDatabase;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);

    transaction.oncomplete = () => {
      db.close();
      resolve(null);
    };
    transaction.onerror = () => reject(transaction.error);

    operation(store);
  });
};

export const saveCurrencyPair = async (pairName: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    dbOperation('currency_pairs', 'readwrite', (store) => {
      const request = store.add({ pair_name: pairName });
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  });
};

export const saveImage = async (currencyPairId: number, imageData: Blob): Promise<void> => {
  await dbOperation('images', 'readwrite', (store) => {
    store.add({
      currency_pair_id: currencyPairId,
      image_data: imageData,
      created_at: new Date()
    });
  });
};

export const getImagesForPair = async (currencyPairId: number): Promise<ImageData[]> => {
  return new Promise((resolve, reject) => {
    dbOperation('images', 'readonly', (store) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const allImages = request.result;
        const pairImages = allImages.filter(img => img.currency_pair_id === currencyPairId);
        resolve(pairImages);
      };
      request.onerror = () => reject(request.error);
    });
  });
};

export const saveImageDescription = async (
  currencyPairId: number,
  imageUrl: string,
  description: string
): Promise<void> => {
  await dbOperation('descriptions', 'readwrite', (store) => {
    store.add({
      currency_pair_id: currencyPairId,
      image_url: imageUrl,
      description: description
    });
  });
};

export const getDescriptionsForPair = async (currencyPairId: number): Promise<ImageDescription[]> => {
  return new Promise((resolve, reject) => {
    dbOperation('descriptions', 'readonly', (store) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const allDescriptions = request.result;
        const pairDescriptions = allDescriptions.filter(desc => desc.currency_pair_id === currencyPairId);
        resolve(pairDescriptions);
      };
      request.onerror = () => reject(request.error);
    });
  });
};

export const getAllPairs = async (): Promise<CurrencyPair[]> => {
  return new Promise((resolve, reject) => {
    dbOperation('currency_pairs', 'readonly', (store) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};