import JSZip from 'jszip';

// Helper function to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Helper function to fetch image with retry mechanism
const fetchImageAsBlob = async (imageUrl: string, retries = 3, timeout = 5000): Promise<Blob> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(imageUrl, { 
        signal: controller.signal,
        mode: 'cors' // Explicitly enable CORS
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      if (attempt === retries) {
        throw new Error(`Failed to fetch image after ${retries} attempts: ${error.message}`);
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  throw new Error('Failed to fetch image');
};

// Download a single image
export const downloadImage = async (imageUrl: string, brandName: string, stepNumber: number, recipeName: string) => {
  try {
    if (!imageUrl) {
      throw new Error('Invalid image URL');
    }

    const blob = await fetchImageAsBlob(imageUrl);
    const base64 = await blobToBase64(blob);
    
    const link = document.createElement('a');
    link.href = base64;
    link.download = `${recipeName.replace(/\s+/g, '-')}-step-${stepNumber}-${brandName.replace(/\s+/g, '-')}.jpg`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(`Error downloading image for step ${stepNumber}:`, error);
    throw new Error(`Failed to download image for step ${stepNumber}: ${error.message}`);
  }
};

// Download all images as a zip file
export const downloadAllImages = async (recipeName: string, brandName: string, images: { imageUrl: string; stepNumber: number }[]) => {
  try {
    const zip = new JSZip();
    const imageFolder = zip.folder(recipeName.replace(/\s+/g, '-'));
    
    if (!imageFolder) {
      throw new Error('Failed to create zip folder');
    }

    const failedImages: { stepNumber: number; error: string }[] = [];

    // Add each image to the zip file
    await Promise.all(images.map(async ({ imageUrl, stepNumber }) => {
      if (!imageUrl) {
        failedImages.push({ 
          stepNumber, 
          error: 'Missing image URL' 
        });
        return;
      }

      try {
        const blob = await fetchImageAsBlob(imageUrl);
        const fileName = `step-${stepNumber}-${brandName.replace(/\s+/g, '-')}.jpg`;
        imageFolder.file(fileName, blob);
      } catch (error) {
        failedImages.push({ 
          stepNumber, 
          error: error.message 
        });
        console.error(`Error processing image ${stepNumber}:`, error);
      }
    }));

    // If any images failed, show a warning
    if (failedImages.length > 0) {
      const failedSteps = failedImages.map(f => `Step ${f.stepNumber}: ${f.error}`).join('\n');
      console.warn('Some images failed to download:', failedSteps);
      alert(`Warning: Failed to download ${failedImages.length} image(s).\nThe zip file will contain only the successfully downloaded images.`);
    }

    // Generate the zip file if we have any successful downloads
    const content = await zip.generateAsync({ type: 'blob' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${recipeName.replace(/\s+/g, '-')}-recipe-images.zip`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error creating zip file:', error);
    alert(`Failed to create zip file: ${error.message}`);
  }
};