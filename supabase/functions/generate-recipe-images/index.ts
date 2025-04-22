import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
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

    const { recipeName, stepNumber, description, cuisine, ingredients } = await req.json();

    if (!recipeName || !stepNumber || !description) {
      throw new Error('Missing required parameters');
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Using GPT-4 mini for detailed step descriptions
    const stepPrompt = `Create a detailed cooking instruction for step ${stepNumber} of ${recipeName} (${cuisine} cuisine).
    Consider the ingredients: ${JSON.stringify(ingredients)}
    Current step description: ${description}
    Provide a more detailed, step-by-step instruction that includes:
    - Specific techniques used
    - Cooking temperatures and times
    - Visual cues for doneness
    - Tips for best results
    - Traditional ${cuisine} cooking methods
    - Safety precautions where needed
    Return only the detailed instruction text.`;

    const stepCompletion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [{ role: "user", content: stepPrompt }],
      temperature: 0.8,
      max_tokens: 500,
    });

    const detailedDescription = stepCompletion.choices[0]?.message?.content || description;

    // Using DALL-E 3 for image generation
    const imagePrompt = `Create a highly detailed, professional cooking demonstration image for ${recipeName}, an authentic ${cuisine} dish.
    
    This is step ${stepNumber}: ${detailedDescription}
    
    Key requirements:
    - Photorealistic, high-end food photography style
    - Show realistic cooking action with visible ingredients and proper utensils
    - Include authentic ${cuisine} cooking techniques and tools
    - Demonstrate proper technique and handling
    - Professional studio lighting with dramatic shadows
    - Clean, well-organized cooking space
    - Show hands in action where appropriate
    - Include relevant ingredients visible in the frame
    - Capture steam, sizzle, or other cooking effects
    - Use traditional ${cuisine} cookware
    - Include subtle motion blur to convey action
    - Ensure proper food safety practices are visible
    
    Style: Professional food photography, high contrast, shallow depth of field, focusing on the action and texture. The image should look like it belongs in a high-end cookbook.`;

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

    const imageUrl = response.data[0].url;

    return new Response(
      JSON.stringify({ 
        imageUrl,
        description: detailedDescription 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error in generate-recipe-images function:', error);
    
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