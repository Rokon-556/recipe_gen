import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import Header from './components/Header';
import RecipeForm from './components/RecipeForm';
import RecipeGallery from './components/RecipeGallery';
import EmptyState from './components/EmptyState';
import Auth from './components/Auth';
import { FormData, RecipeData, ManualRecipeData } from './types';
import { simulateApiCall, generateManualRecipe } from './utils/recipeData';
import { supabase } from './lib/supabase';

function App() {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await simulateApiCall(formData);
      setRecipeData(data);
    } catch (error) {
      console.error('Error generating recipe images:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate recipe images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (manualData: ManualRecipeData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateManualRecipe(manualData);
      setRecipeData(data);
    } catch (error) {
      console.error('Error generating manual recipe images:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate recipe images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeUpdate = (updatedRecipe: RecipeData) => {
    setRecipeData(updatedRecipe);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {!session ? (
            <Auth />
          ) : (
            <>
              <RecipeForm 
                onSubmit={handleFormSubmit} 
                onManualSubmit={handleManualSubmit}
                isLoading={isLoading} 
              />
              
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <div className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Generating your recipe images...</p>
                </div>
              ) : recipeData ? (
                <RecipeGallery 
                  recipeData={recipeData} 
                  onStepUpdate={handleRecipeUpdate}
                />
              ) : (
                <EmptyState />
              )}
            </>
          )}
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Recipe Visualizer. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Create beautiful recipe visualizations with your brand in seconds
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;