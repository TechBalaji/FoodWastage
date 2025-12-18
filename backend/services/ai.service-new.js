const { HfInference } = require('@huggingface/inference');
const fs = require('fs');

// Initialize Hugging Face Inference
const apiKey = process.env.HUGGINGFACE_API_KEY;

if (!apiKey) {
    console.error('⚠️  WARNING: HUGGINGFACE_API_KEY not found in environment variables!');
    console.error('   AI analysis will not work. Please add HUGGINGFACE_API_KEY to your .env file');
}

const hf = new HfInference(apiKey || undefined);

/**
 * Analyze food image using Hugging Face models
 */
const analyzeFoodImage = async (imagePath, foodType = 'food') => {
    try {
        console.log('🤖 Analyzing food image with Hugging Face AI...');

        // For version 2.7.0, use file path directly or base64
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        // Use Hugging Face image classification
        const classificationResult = await hf.imageClassification({
            data: `data:image/jpeg;base64,${base64Image}`,
            model: 'nateraw/food'
        });

        console.log('✅ Classification result:', classificationResult);

        // Get the top prediction
        const topPrediction = classificationResult[0];
        const detectedFood = topPrediction.label;
        const confidence = Math.round(topPrediction.score * 100);

        // Generate analysis based on detected food
        const analysis = generateFoodAnalysis(detectedFood, confidence, foodType);

        return {
            success: true,
            data: analysis,
            rawResponse: `Detected: ${detectedFood} (${confidence}% confidence)`,
        };
    } catch (error) {
        console.error('Hugging Face Analysis Error:', error);

        return {
            success: false,
            error: error.message,
            data: generateFallbackAnalysis(foodType),
        };
    }
};

// ... rest of the file remains the same
