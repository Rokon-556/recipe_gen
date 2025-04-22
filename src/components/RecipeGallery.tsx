import React from 'react';
import { RecipeData } from '../types';
import { Download } from 'lucide-react';
import { downloadAllImages } from '../utils/downloadUtils';

interface RecipeGalleryProps {
  recipeData: RecipeData | null;
  onStepUpdate: (updatedRecipe: RecipeData) => void;
}

const RecipeGallery: React.FC<RecipeGalleryProps> = ({ recipeData }) => {
  if (!recipeData) return null;

  const handleDownloadAll = async () => {
    try {
      const images = [
        ...recipeData.ingredients.map((ingredient, index) => ({
          imageUrl: ingredient.imageUrl || '',
          stepNumber: index + 1
        })),
        {
          imageUrl: recipeData.finalImage || '',
          stepNumber: recipeData.ingredients.length + 1
        }
      ].filter(img => img.imageUrl); // Filter out empty URLs

      if (images.length === 0) {
        alert('No images available to download.');
        return;
      }

      await downloadAllImages(recipeData.name, recipeData.brandName, images);
    } catch (error) {
      console.error('Error in handleDownloadAll:', error);
      alert(`Failed to download images: ${error.message}`);
    }
  };

  return (
    <div className="mb-12">
      <div className="bg-cream p-12 rounded-lg">
        {/* Recipe Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 uppercase tracking-wider">
            {recipeData.name}
          </h2>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {recipeData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex flex-col items-center">
              {ingredient.imageUrl && (
                <div className="w-full aspect-square mb-4 rounded-lg overflow-hidden bg-white">
                  <img
                    src={ingredient.imageUrl}
                    alt={ingredient.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-center text-lg font-medium text-gray-800">
                {ingredient.quantity} {ingredient.unit} {ingredient.name}
              </p>
            </div>
          ))}
        </div>

        {/* Recipe Process Icons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-8 h-8">
            <img 
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADsUlEQVR4nO2ZW2xMURSGv1JKXYJQl7jEPQhxCYlLQjwgxIOHuoWIW4THEuIeQUJCkJCIEPEgQUJCxIOEeJAQDxKXuIVWq6WoVimtfslKVmb2OXPOzJwzU5P+yX85s/dae6+z915r7QNDGAJkAZuBc8BL4DPQCPwE6oB3wB3gMLAQGDZYwWcDe4DHQDvQ6UNagWfALmBEogJPBzYCt4EWH0HbSQtwE9gApMQr+OXAYx+OuyV1wDIvzqcBh4BmF8a7gQ6gGXgAPAK+R7DVBGwHUr06vxJo9+BwPbAXWA1MAsYCacBYYCawFjgFNLi00wYsc+P8dKDOg7M3gdkeYxkPXHBh8zsww8n5dUC7S8c6gOvAJg+1PQnYDLxwab8NWGsXfJaHjFMZ3wHkAWMi2M8ELrq09xOYHy74AuCXCwfKgbxoVeQwcoCrLmxWA/mhwS8Bfrh0oBgYFqMYsoDLLmJ4D8wKBn/UxY2rgBwfYxgJXHNh+wgwVIXvdGFQGU7zOY40oNSF/VRpHXJdGHoLTPY5jlQXKxRsANJFPOQCv20MqOCzfI5DpfxrNgYaZBcOJxnAExtbDcDEYPDpNgZU8Jk+x6CkEGizsfcZGKWCz7YxoILP8DkGJUVhbNYAIyT4DBsDKvh0n2NQcjqMzS/AWBV8mo0BFXyazzEoKQ5jsxoYp4JPtTGggh/tcwxKzoSx+QEYr4JPsTGggh/lcwxKzobYawAmqOCTbQyo4Ef6HEMScMHGZhUwSQWfZGNABT/C5xiSgYs2Nt8Ak1XwiTYGVPDDfY4hGbhkY/MlkKOCT7AxoIJP9TmGFOCyjc1nkqES/AQbAyr4YT7HkApcsbH5GJiugg+3WqrgU3yOIQ247iKG+Sr4cHteFXySzzGkA7dsbN6Vk1gCkGhjQAU/1OcYxgD3bWwWSJ1LABJsDKjgh/gcw1jgoY3NXKmHCUC8jQEVfLLPMYwDHtnYnCUfQwkgnMEOn2NQ8tjGZrb8IyQAcTYGVPBJPscwAXhiYzNL/hkTgFgbAyr4RJ9jmAQ8tbE5Rf4hE4AYGwMq+ASfY5gMPLOxOVn+KROAaBsDKvh4n2OYCjy3sTlRPjYSgCgbAyr4OJ9jyAVe2NgcL9UwAYi0MaCCj/U5hhnAKxub4+TbIQEIt9RWBh/jcwyzgNc2NkfLJUACEG6prQw+2ucY5gBvbGyOlGvgBCDcUlsZfJTPMcwF3trYHC7XwQnA/5L/ADwh4qUj1eAuAAAAAElFTkSuQmCC" 
              alt="Mix"
              className="w-full h-full"
            />
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="w-8 h-8">
            <img 
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEcElEQVR4nO2ZaYhWVRjHf47jMi6j5r6US2qJ+0JqKpK4G5mKiuOGiR8kTAQXUCQVRAQV/OCCuCAiIiqIiSAumYrihqijiKO4juKGjguO4zgu8Ys/PBcO733Pe999Zj74hwfmnnPPPc95znOe85xz4T9UQA3gKWAB8BVwGrgI/AocBXYDnwNvAY8DNZN0vCrQC1gKHAL+9JCTQA0kAXWBkcBm4JaP426lERgO1IiX89WAZ4EdwG0fjscSNbEZGBrr4JsA7/k48D9wA/gN2AfsAo75aOIW8D7QKNbBPwpc8XDwb2AjMAFoD9QDqgJ1gLbAeGCDx6BuAi9HMfg2wHkPB3cCfQNMPg3oD+zxsPkL0DqM8/WAEx6T+QwYCNT0aa8WMBjY52H7ONAwaPDPAZc9nPsWeDKkPTQHvvOw/RPQPGjwC4G/XRy7BrwK1I7AXl1glYf9hUGDXwf85eLYIaBzhDbRBTjs4sM6v8FPdXHoCtA7BjvpDVx28WVq0OBHujhzCWgXo530Ay67+DQiaPCdXJy5ADSNg730By64+NggaPANXZw5BzSIg730Ac66+NggaPB3uThzGqgfB3vpCZxx8e2uoMFXdXHmFFAnDvbSCTjp4ltVv8FfcHGmIg72Uh844eJbedDgz7k4UxEHe6kFHHXx7VzQ4I+7OFMeB3upDhxw8e140ODLXJwpi4O9VAG2u/hWFjT4HS7OlMbBXpKBTS6+7Qga/EYXZ0riYC9JwBoX3zYGDX6eizPFcbCXJGCpi2/zggY/zsWZojjYSxKwyMW3cUGD7+/iTFEc7GWei2/9gwbfysWZwjjYy2wX31oFDb4qcMbFmcI42MsMF9+qBQ0eYLeLMwVxsJepLn7tChr8aBdnCuJgL5NcfBsdNPiGwB8uzhTEwV7Gu/jVMGjwAOtdnMmPg72McvFrfdDghwB/uTiTHwd7GeLi15CgwdcGjrk4kx8He+nn4texoDdygI9cnMmPg730dvHro6DBdwf+cXEmPw720sPFr+5Bg68C7HVxJj8O9tLVxa89QW/kAAtcnMmPg710cvFrQdDgWwJ/uziTHwd76eDiV8ugwQOsdXEmPw720s7Fr7VBgx8M3HZxJj8O9tLaxa/BQYOvBRxxcSY/DvbS0sWvI0FP5ACzXJzJj4O9NHfxa1bQ4JsCv7s4kx8He2nm4tfPQU/kAMtcnMmPg700cfFrWdDgOwK3XJzJj4O9NHbxq2PQ4AE2uziTHwd7aeDi1+agwQ8Cbrg4kx8He6nv4tegoMFXB/a7OJMfB3up6+LX/qA3coCpLs7kx8Fe6rj4NTVo8I2A317QmZI42EttF796BA0eYIWLMyVxsJdaLn6tCBp8e+C6izMlcbCXmi5+tQ8afBKw1cWZkjjYSw0Xv7YGvZEDjHRxpiQO9lLdxa+RQYOvC/zk4kxJHOylmotfP4W5kQNMdnGmJA72UtXFr8lBg28EXHVxpiQO9lLFxa+rYU7kAHNdnCmJg71UdvFrbtDgGwJXXJwpiYO9VHbx60qYEznADBdnSuJgL/8CkxPipSNVYKIAAAAASUVORK5CYII=" 
              alt="Bake"
              className="w-full h-full"
            />
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="w-8 h-8">
            <img 
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/UlEQVR4nO2ZW4hNURjHf2PMuB0ul3EJuYyZ5MFDXpTyQEQeeEEUeVFEKbcUUfKiPCgPQi7lUqSIzLg8SIk8yIOSuGRIMTPKZWYY49Mv/6rVap999tlnn332Gfav/p3O2t/6f9/51lrfWt85kEMO/zsKgKnAKuAA8Bi4D9wFbgJXgDPATmAVMBkoTtLxPKASOA48Bfo8yj2gKkkHxwLrgOvAXx8OupV+4BowH8hPwvlJwE7gk48B25FPwHZgfNzOTwdOAz8CGKxXfgKngBlxOV8BXA7BYL3yGlgYtfNlwNmIDNYrF4CpUTk/EzgXg8F65SYwLwrnVwM9MRqsV74Dy4M4XwxsAb7GbLBe+QasDdP5hcCHBA3WK73AkjCcLwU6EjZUr3QBc4I4vwz4nLCRemUAWOnH+QLgYMIG6pcjQGEY0agzYQP1y6awotGVhA3UL1fDikbvEjZQv7wNKxp9TNhA/fI4rGj0KWED9UtHWNHoW8IG6pfvYUWjvoQN1C99YUWjgYQN1C8DYUWjvxM2UL/8CSsa5SRsoH7JCysaFSVsoH4pCisaDU3YQP0yLKxoVJKwgfqlJKxoVJawgfqlPKxoNDphA/XL6LCi0biEDdQv48KKRhMSNlC/TAwrGk1L2ED9Mi2saDQnYQP1y5ywolEV8CNhQ/VKD1AVhvMAGxM2VL9sCMv5YcDxhA3VK8eCJnJ2LAXeJ2ywXukElkThPMBs4FbCBuuVm0B1lM4DlAInYjZYr7QBc6N2XlEFtMZksF5pAeYn5byiHDgaocF65QgwPWnnFRXAvggM1it7/WZcSTuvKAE2A90hGWw3sEn3TBXnFaOAjcDrgAbbBWwARieB84oiYA1wMYDBXgBWy7akcd5JObAOOAW8AP7tZPqAduAQsFY/jaTFeTcmAIuBrcBu4CBwGDgI7Ja2SFqxPE4O55CTk5ycHHL4H/EPxK7ipSPV4C4AAAAAElFTkSuQmCC" 
              alt="Serve"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Final Recipe Image */}
        {recipeData.finalImage && (
          <div className="flex flex-col items-center mb-8">
            <div className="w-full max-w-md">
              <img
                src={recipeData.finalImage}
                alt={recipeData.name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Brand Watermark */}
        <div className="flex justify-end mt-8">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-green-700">{recipeData.brandName}</span>
          </div>
        </div>

        {/* Download Button */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full shadow-lg transition-colors"
          >
            <Download size={18} />
            Download Images
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeGallery;
