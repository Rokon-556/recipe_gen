import { CuisineType, RecipeData, FormData, Ingredient, ManualRecipeData } from '../types';

export const generateManualRecipe = async (manualData: ManualRecipeData): Promise<RecipeData> => {
  const { recipeName, brandName, ingredients } = manualData;

  try {
    // Generate final recipe image with all ingredients
    const finalResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-final-recipe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipeName,
        ingredients,
      }),
    });

    if (!finalResponse.ok) {
      let errorDetails = '';
      try {
        const errorData = await finalResponse.json();
        errorDetails = JSON.stringify(errorData);
      } catch (e) {
        errorDetails = await finalResponse.text();
      }
      
      console.error(`Failed to generate recipe image. Status: ${finalResponse.status}. Details: ${errorDetails}`);
      throw new Error('Failed to generate recipe image');
    }

    const finalData = await finalResponse.json();

    return {
      id: `recipe-${Date.now()}`,
      name: recipeName,
      brandName,
      cuisine: 'custom' as CuisineType,
      ingredients: ingredients.map(ingredient => ({
        ...ingredient,
        imageUrl: null, // We don't need individual images anymore
      })),
      finalImage: finalData.imageUrl,
      steps: [], // We don't need steps for this view
    };
  } catch (error) {
    console.error('Error in generateManualRecipe:', error);
    throw error;
  }
};

export const simulateApiCall = (formData: FormData): Promise<RecipeData> => {
  return generateRecipeData(formData);
};