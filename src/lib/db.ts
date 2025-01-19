// Using IndexedDB for client-side storage
const DB_NAME = 'currencyPairsDB';
const DB_VERSION = 1;

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

let db: IDBDatabase;

const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create currency_pairs store
      if (!db.objectStoreNames.contains('currency_pairs')) {
        const currencyPairsStore = db.createObjectStore('currency_pairs', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        currencyPairsStore.createIndex('pair_name', 'pair_name', { unique: false });
      }

      // Create images store
      if (!db.objectStoreNames.contains('images')) {
        const imagesStore = db.createObjectStore('images', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        imagesStore.createIndex('currency_pair_id', 'currency_pair_id', { unique: false });
      }
    };
  });
};

export const saveCurrencyPair = async (pairName: string): Promise<number> => {
  await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['currency_pairs'], 'readwrite');
    const store = transaction.objectStore('currency_pairs');
    
    const request = store.add({ pair_name: pairName });
    
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
};

export const saveImage = async (currencyPairId: number, imageData: Blob): Promise<void> => {
  await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');
    
    const request = store.add({
      currency_pair_id: currencyPairId,
      image_data: imageData,
      created_at: new Date()
    });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getImagesForPair = async (currencyPairId: number): Promise<ImageData[]> => {
  await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['images'], 'readonly');
    const store = transaction.objectStore('images');
    const index = store.index('currency_pair_id');
    
    const request = index.getAll(currencyPairId);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllPairs = async (): Promise<CurrencyPair[]> => {
  await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['currency_pairs'], 'readonly');
    const store = transaction.objectStore('currency_pairs');
    
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};