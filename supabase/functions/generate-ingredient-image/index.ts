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

    const { ingredientName, quantity, unit } = await req.json();

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const imagePrompt = `Create a professional food photography image of ${quantity} ${unit} of ${ingredientName}.
    
    Key requirements:
    - Clean, minimalist style on a light background
    - Professional food photography lighting
    - Show exact quantity specified
    - Include measuring tools or containers where appropriate
    - Focus on texture and detail
    - Ensure the ingredient is clearly visible and identifiable
    - Use soft, natural lighting
    - High-resolution, sharp details
    
    Style: Modern food photography, clean and professional, similar to cookbook or recipe website imagery.`;

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
    console.error('Error in generate-ingredient-image function:', error);
    
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