import React, { useState } from 'react';
import { CuisineType, FormData, Ingredient, ManualRecipeData } from '../types';
import { UtensilsCrossed, ChefHat, CircleUserRound, Utensils, Plus, Trash2 } from 'lucide-react';

interface RecipeFormProps {
  onSubmit: (data: FormData) => void;
  onManualSubmit: (data: ManualRecipeData) => void;
  isLoading: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit, onManualSubmit, isLoading }) => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    recipeName: '',
    brandName: '',
    cuisine: 'indian',
  });

  const [manualData, setManualData] = useState<ManualRecipeData>({
    recipeName: '',
    brandName: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cuisine' ? value as CuisineType : value,
    }));
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    setManualData((prev) => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      return { ...prev, ingredients: newIngredients };
    });
  };

  const addIngredient = () => {
    setManualData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }],
    }));
  };

  const removeIngredient = (index: number) => {
    setManualData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isManualMode) {
      onManualSubmit(manualData);
    } else {
      onSubmit(formData);
    }
  };

  const cuisineOptions = [
    { value: 'indian', label: 'Indian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'latin', label: 'Latin' },
    { value: 'italian', label: 'Italian' },
    { value: 'continental', label: 'Continental' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto transform transition-all">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
          <UtensilsCrossed className="mr-2 text-orange-500" size={24} />
          Create Your Recipe Images
        </h2>
        <p className="text-gray-600">
          Generate beautiful, step-by-step recipe images with your brand name
        </p>
      </div>

      <div className="mb-6">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setIsManualMode(false)}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              !isManualMode
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            AI Generated
          </button>
          <button
            type="button"
            onClick={() => setIsManualMode(true)}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              isManualMode
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Manual Input
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {isManualMode ? (
          <>
            <div>
              <label htmlFor="recipeName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Utensils className="mr-2 text-orange-500" size={18} />
                Recipe Name
              </label>
              <input
                type="text"
                id="recipeName"
                name="recipeName"
                placeholder="Enter recipe name"
                value={manualData.recipeName}
                onChange={handleManualChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <CircleUserRound className="mr-2 text-orange-500" size={18} />
                Your Brand Name
              </label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                placeholder="Enter your brand name"
                value={manualData.brandName}
                onChange={handleManualChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center text-sm text-orange-500 hover:text-orange-600"
                >
                  <Plus size={16} className="mr-1" />
                  Add Ingredient
                </button>
              </div>

              {manualData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      placeholder="Quantity"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-red-500 hover:text-red-600"
                    disabled={manualData.ingredients.length === 1}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="recipeName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Utensils className="mr-2 text-orange-500" size={18} />
                Recipe Name
              </label>
              <input
                type="text"
                id="recipeName"
                name="recipeName"
                placeholder="Enter recipe name (e.g., Mango Pickle)"
                value={formData.recipeName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <CircleUserRound className="mr-2 text-orange-500" size={18} />
                Your Brand Name
              </label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                placeholder="Enter your brand name to display on images"
                value={formData.brandName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <ChefHat className="mr-2 text-orange-500" size={18} />
                Cuisine Type
              </label>
              <select
                id="cuisine"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              >
                <option value="" disabled>Select a cuisine type</option>
                {cuisineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Images...
            </span>
          ) : (
            'Generate Recipe Images'
          )}
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;