// @ts-ignore
const { ipcRenderer } = window.electron || {};

export const saveCurrencyPair = async (pair: string) => {
  if (!ipcRenderer) {
    console.log('IPC not available - running in development mode');
    return Date.now();
  }
  
  const id = Date.now();
  await ipcRenderer.invoke('save-data', {
    type: 'pair',
    id,
    data: { pair }
  });
  return id;
};

export const saveImage = async (pairId: number, imageBlob: Blob) => {
  if (!ipcRenderer) {
    console.log('IPC not available - running in development mode');
    return true;
  }

  const arrayBuffer = await imageBlob.arrayBuffer();
  await ipcRenderer.invoke('save-image', {
    id: pairId,
    imageData: Array.from(new Uint8Array(arrayBuffer))
  });
  return true;
};

export const getImagesForPair = async (pairId: number) => {
  if (!ipcRenderer) {
    console.log('IPC not available - running in development mode');
    return [];
  }

  const imageData = await ipcRenderer.invoke('load-images', { id: pairId });
  if (!imageData) return [];
  
  const blob = new Blob([new Uint8Array(imageData)], { type: 'image/png' });
  return [{ image_data: blob }];
};

export const saveImageDescription = async (pairId: number, imageUrl: string, description: string) => {
  if (!ipcRenderer) {
    console.log('IPC not available - running in development mode');
    return true;
  }

  await ipcRenderer.invoke('save-data', {
    type: 'description',
    id: `${pairId}_${imageUrl}`,
    data: { description }
  });
  return true;
};

export const getDescriptionsForPair = async (pairId: number) => {
  if (!ipcRenderer) {
    console.log('IPC not available - running in development mode');
    return [];
  }

  const descriptions = await ipcRenderer.invoke('load-data', {
    type: 'description',
    id: pairId
  });
  return descriptions || [];
};