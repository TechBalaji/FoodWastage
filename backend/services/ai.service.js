const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

/**
 * Analyze food image using Google Gemini with robust fallback
 * @param {string} imagePath - Path to the uploaded image
 * @param {string} foodType - Optional food type hint from user
 * @param {string} location - Optional user location (State, Country)
 * @returns {Object} Analysis results
 */

// User-provided API Keys for redundancy
// (In production, these should be loaded from environment variables)
const API_KEYS = [
    'AIzaSyCcgEKePNpPNDDP-1x5Syf4bYgLufLE7N4',
    'AIzaSyDLcHg-bFPatWsFIwC0JyA2tkg2r51Qa_0'
];

// Models strictly restricted to the user's allowed list of 11.
// Prioritizing the best vision-capable models.
const MODELS = [
    'gemini-2.5-flash',       // Primary
    'gemini-3-flash',         // Next Best
    'gemini-2.5-flash-lite'   // Backup
];

const analyzeFoodImage = async (imagePath, foodType = '', location = '') => {
    // Combine env key (if exists) with backup keys, deduped
    const envKey = process.env.GEMINI_API_KEY;
    let allKeys = envKey ? [envKey, ...API_KEYS] : API_KEYS;
    allKeys = [...new Set(allKeys)].filter(k => k && k.trim().length > 0);

    if (allKeys.length === 0) {
        console.error('❌ No API Keys available');
        return { success: false, error: 'API Keys missing', data: generateFallbackAnalysis(foodType) };
    }

    // Read image file once
    let imageBase64;
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        imageBase64 = imageBuffer.toString('base64');
    } catch (err) {
        console.error('❌ Error reading image file:', err);
        return { success: false, error: 'Image read error', data: generateFallbackAnalysis(foodType) };
    }

    let lastError = null;

    // Double Loop: Iterate through Models -> Then Keys
    // This ensures we try the BEST model with ALL keys before degrading to a lighter model.
    for (const modelName of MODELS) {
        for (const apiKey of allKeys) {
            try {
                const maskedKey = apiKey.substring(0, 8) + '...';
                console.log(`🤖 Analyzing with ${modelName} (Key: ${maskedKey})`);

                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `
                You are an AI Food Waste Expert. Analyze this food image.
                User hint (optional): "${foodType}"
                User Location: "${location}"
                
                Task: Provide advice relevant to the user's region (${location}) but ALSO include interesting global/fusion ideas.
                
                    Provide a structured analysis in JSON format with exactly these fields:
                {
                    "detectedFood": "Name of the food identified",
                    "confidence": 95,
                    "edibilityStatus": "safe" | "questionable" | "spoiled",
                    "spoilageIndicators": ["Visual sign 1"],
                    "estimatedShelfLife": "e.g., 3-4 days",
                    "storageTips": ["Tip 1"],
                    "reuseIdeas": ["Idea 1"],
                    "recipes": ["Recipe 1"],
                    "sustainabilityScore": 1-10,
                    "compostable": true/false,
                    "moderation": {
                         "isFlagged": true/false,
                         "reason": "Explain why if flagged (e.g. non-food, inappropriate)"
                    },
                    "summary": "1-sentence summary"
                }
                
                IMPORTANT rules:
                1. CHECK FOR INAPPROPRIATE CONTENT. If the image is not food/kitchen related or contains prohibited content, set 'moderation.isFlagged' to true.
                2. If flagged, set 'detectedFood' to "Flagged Content" and 'edibilityStatus' to "unknown".
                3. Calculate Sustainability Score based on carbon footprint.
                4. Return ONLY valid JSON.
                `;

                const result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: imageBase64,
                            mimeType: 'image/jpeg'
                        }
                    }
                ]);

                const response = await result.response;
                let text = response.text();

                // Clean up markdown if present
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                const firstBrace = text.indexOf('{');
                const lastBrace = text.lastIndexOf('}');

                if (firstBrace !== -1 && lastBrace !== -1) {
                    text = text.substring(firstBrace, lastBrace + 1);
                }

                console.log(`✅ Success with ${modelName} (Key: ${maskedKey})`);

                let analysis;
                try {
                    analysis = JSON.parse(text);
                } catch (parseError) {
                    console.warn(`⚠️ JSON Parse Error (${modelName}). Retrying...`);
                    throw new Error('JSON Parse Failed');
                }

                // If successful, return immediately
                return {
                    success: true,
                    data: {
                        foodType: analysis.detectedFood,
                        confidence: analysis.confidence || 90,
                        edibilityStatus: analysis.edibilityStatus,
                        spoilageIndicators: analysis.spoilageIndicators || [],
                        estimatedShelfLife: analysis.estimatedShelfLife,
                        storageTips: analysis.storageTips || [],
                        reuseIdeas: analysis.reuseIdeas || [],
                        recipes: analysis.recipes || [],
                        sustainabilityScore: analysis.sustainabilityScore || 5,
                        compostable: analysis.compostable,
                        moderation: analysis.moderation || { isFlagged: false, reason: null },
                        summary: analysis.summary,
                        aiResponse: analysis.summary
                    },
                    rawResponse: text,
                    usedModel: modelName
                };

            } catch (error) {
                console.warn(`⚠️ Failed: ${modelName} [${apiKey.substring(0, 5)}...] - ${error.message}`);
                lastError = error;
                // Continue to next key
            }
        }
    }

    // If loop finishes without returning, all models/keys failed
    console.error('❌ All AI models/keys failed.');
    return {
        success: false,
        error: lastError ? lastError.message : 'All models failed',
        data: generateFallbackAnalysis(foodType)
    };
};

function generateFallbackAnalysis(foodType) {
    return {
        edibilityStatus: 'unknown',
        confidence: 0,
        foodType: foodType || 'Unknown',
        spoilageIndicators: ['Could not analyze image'],
        estimatedShelfLife: 'Unknown',
        reuseIdeas: [],
        recipes: [],
        storageTips: ['Refrigerate if perishable'],
        sustainabilityScore: 5,
        compostable: false,
        summary: 'AI Analysis unavailable. Please verify manually.'
    };
}

module.exports = {
    analyzeFoodImage,
    // No loadModel needed for API
    loadModel: async () => console.log('✅ Gemini API ready (Multi-Key configured)')
};
