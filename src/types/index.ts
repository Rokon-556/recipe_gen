export interface RecipeStep {
  id: number;
  imageUrl: string;
  description: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  imageUrl?: string;
}

export interface RecipeData {
  id: string;
  name: string;
  brandName: string;
  cuisine: string;
  ingredients: Ingredient[];
  finalImage?: string;
  steps: RecipeStep[];
}

export type CuisineType = 'chinese' | 'japanese' | 'latin' | 'italian' | 'continental' | 'indian';

export interface FormData {
  recipeName: string;
  brandName: string;
  cuisine: CuisineType;
}

export interface ManualRecipeData {
  recipeName: string;
  brandName: string;
  ingredients: Ingredient[];
}