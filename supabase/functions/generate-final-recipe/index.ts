import OpenAI from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const { recipeName, ingredients } = await req.json();

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Format ingredients for the prompt with clear spacing
    const ingredientsList = ingredients
      .map(ing => `• ${ing.quantity} ${ing.unit} ${ing.name}`)
      .join('\n');

    const imagePrompt = `Create a professional recipe ingredients layout image exactly like a modern cookbook recipe card.

Recipe: ${recipeName}

Ingredients (ONLY show these exact ingredients, no more, no less):
${ingredientsList}

Key requirements:
- Layout MUST be on a cream/beige background (#FDF6E9 or similar)
- Each ingredient must be photographed individually in a clean white bowl or on a white surface
- Each ingredient must have clear text showing EXACT quantity and unit as provided (e.g., "150g butter")
- Arrange only the provided ingredients in a grid layout
- Text must be black, large, and easily readable (use a clean sans-serif font)
- Place recipe title in large, bold, uppercase text at the bottom
- Include three small, simple black icons between title and final image: bowl → cupcake → plate
- Show a single final plated dish at the bottom
- Use consistent, professional studio lighting throughout
- Add subtle shadows under ingredients for depth
- Keep the overall style minimal and modern
- Maintain exact quantities and units as provided

Style: Modern, minimalist cookbook layout with emphasis on clean typography and professional food photography. Reference the layout of high-end recipe books with ingredients clearly displayed in a grid with their measurements.

CRITICAL: 
- Only show the exact ingredients provided, no additions
- All measurements must match exactly what was provided
- Text must be large and clearly readable
- Layout must be clean and minimal with plenty of whitespace`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "hd",
      n: 1,
    });

    if (!response.data?.[0]?.url) {
      throw new Error('Failed to generate image from OpenAI');
    }

    return new Response(
      JSON.stringify({ imageUrl: response.data[0].url }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error in generate-final-recipe function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while generating the image',
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