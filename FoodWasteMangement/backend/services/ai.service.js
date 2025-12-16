const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze food image using Google Gemini Vision API
 * @param {string} imagePath - Path to the uploaded image
 * @returns {Object} Analysis results with edibility, suggestions, and storage tips
 */
const analyzeFoodImage = async (imagePath) => {
    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Read the image file
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString('base64');

        // Create the prompt for food analysis
        const prompt = `You are an expert food safety and sustainability advisor. Analyze this leftover food image and provide:

1. **Edibility Status**: Determine if the food is "safe" to eat, "questionable" (might be okay but use caution), or "spoiled" (should not be consumed). Provide a confidence percentage (0-100).

2. **Spoilage Indicators**: List any visible signs of spoilage (mold, discoloration, texture changes, etc.)

3. **Food Type**: Identify what type of food this is.

4. **Estimated Shelf Life**: How long can this food be safely stored (if it's safe)?

5. **Reuse Ideas**: Suggest 3-5 creative ways to reuse or repurpose this leftover food.

6. **Recipes**: Suggest 2-3 simple recipes that could use this leftover food.

7. **Storage Tips**: Provide best practices for storing this type of food to extend its shelf life.

8. **Donation Suitability**: Can this food be donated? If yes, provide suggestions on where/how.

Please format your response as JSON with the following structure:
{
  "edibilityStatus": "safe|questionable|spoiled",
  "confidence": 85,
  "foodType": "string",
  "spoilageIndicators": ["indicator1", "indicator2"],
  "estimatedShelfLife": "string",
  "reuseIdeas": ["idea1", "idea2", "idea3"],
  "recipes": ["recipe1", "recipe2"],
  "storageTips": ["tip1", "tip2", "tip3"],
  "donationOptions": ["option1", "option2"],
  "summary": "Brief overall assessment"
}`;

        // Generate content with image
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Try to parse JSON from the response
        let analysisData;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
            analysisData = JSON.parse(jsonString);
        } catch (parseError) {
            // If JSON parsing fails, create a structured response from the text
            console.warn('Failed to parse AI response as JSON, using fallback structure');
            analysisData = {
                edibilityStatus: 'unknown',
                confidence: 50,
                foodType: 'Unknown',
                spoilageIndicators: [],
                estimatedShelfLife: 'Unknown',
                reuseIdeas: ['Consult the full AI response for suggestions'],
                recipes: [],
                storageTips: [],
                donationOptions: [],
                summary: text.substring(0, 500),
            };
        }

        return {
            success: true,
            data: analysisData,
            rawResponse: text,
        };
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return {
            success: false,
            error: error.message,
            data: {
                edibilityStatus: 'unknown',
                confidence: 0,
                foodType: 'Unknown',
                spoilageIndicators: [],
                estimatedShelfLife: 'Unknown',
                reuseIdeas: [],
                recipes: [],
                storageTips: [],
                donationOptions: [],
                summary: 'AI analysis failed. Please try again.',
            },
        };
    }
};

module.exports = {
    analyzeFoodImage,
};
