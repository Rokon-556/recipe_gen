import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import OpenAI from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate ingredient structure
const isValidIngredient = (ingredient: any): boolean => {
  return (
    ingredient &&
    typeof ingredient === 'object' &&
    typeof ingredient.name === 'string' &&
    (typeof ingredient.quantity === 'string' || typeof ingredient.quantity === 'number') &&
    typeof ingredient.unit === 'string'
  );
};

// Parse and validate ingredients array
const parseAndValidateIngredients = (response: string): any[] => {
  console.log('Raw OpenAI response:', response);
  
  try {
    // Try to parse the response as JSON
    const parsed = JSON.parse(response.trim());
    
    // Handle both direct array and object with ingredients property
    const ingredients = Array.isArray(parsed) ? parsed : parsed.ingredients;
    
    // If ingredients is not an array, return an empty array
    if (!Array.isArray(ingredients)) {
      console.error('Parsed response is not an array:', ingredients);
      return [];
    }
    
    // Validate each ingredient
    const validIngredients = ingredients.filter(isValidIngredient);
    
    if (validIngredients.length === 0) {
      console.error('No valid ingredients found in response');
      return [];
    }
    
    return validIngredients;
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return [];
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'OpenAI API key is not configured',
          ingredients: [], // Always include empty ingredients array
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { recipeName, cuisine } = await req.json();

    if (!recipeName || !cuisine) {
      return new Response(
        JSON.stringify({
          error: 'Missing required parameters',
          ingredients: [], // Always include empty ingredients array
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const prompt = `Generate a comprehensive list of ingredients with precise quantities for ${recipeName}, which is a ${cuisine} dish. 
    Consider:
    - Traditional ${cuisine} cooking methods
    - Authentic ingredients specific to the cuisine
    - Proper proportions for a 4-person serving
    - Both essential and garnishing ingredients
    - Any special ingredients that give the dish its authentic flavor
    
    Return ONLY a JSON array of ingredients with their quantities and units.
    Format: [{"name": "ingredient name", "quantity": "amount", "unit": "measurement unit"}]
    Example: [{"name": "rice", "quantity": "2", "unit": "cups"}]
    
    Be specific with quantities and use appropriate regional measurement units for ${cuisine} cuisine.
    
    IMPORTANT: The response must be a valid JSON array containing only ingredients in the specified format.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [{ 
        role: "system", 
        content: "You are a precise JSON generator. Always respond with valid JSON arrays containing ingredient objects with exactly three properties: name, quantity, and unit."
      },
      { 
        role: "user", 
        content: prompt 
      }],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      return new Response(
        JSON.stringify({
          error: 'No response from OpenAI',
          ingredients: [], // Always include empty ingredients array
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const ingredients = parseAndValidateIngredients(response);

    return new Response(
      JSON.stringify({ ingredients }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error in generate-recipe-ingredients function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while generating ingredients',
        ingredients: [], // Always include ingredients array, even if empty
        details: error.toString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});