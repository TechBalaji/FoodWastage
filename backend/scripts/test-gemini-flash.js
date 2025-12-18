require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log('🧪 Testing Gemini API...');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ Missing API Key');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-lite', 'gemini-2.0-flash-exp', 'gemini-1.5-flash'];

        for (const modelName of modelsToTry) {
            try {
                console.log(`\n🤖 Attempting model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                console.log(`📤 Sending hello prompt to ${modelName}...`);
                const result = await model.generateContent("Hello, are you working?");
                const response = await result.response;
                const text = response.text();

                console.log(`✅ SUCCESS! ${modelName} is working.`);
                console.log(`📝 Response: ${text}`);

                // If successful, we can stop or just log it
                console.log('---------------------------------------------------');
            } catch (error) {
                console.error(`❌ Failed ${modelName}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error('❌ An unexpected error occurred outside the model loop:', error);
    }
}

testGemini();
