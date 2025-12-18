require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// List of possible model names to test
const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.0-pro',
    'models/gemini-pro',
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash',
];

async function testModel(modelName) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        return { success: true, model: modelName, response: response.text().substring(0, 50) };
    } catch (error) {
        return { success: false, model: modelName, error: error.message };
    }
}

async function findWorkingModel() {
    console.log('🔍 Testing available models with your API key...\n');

    for (const modelName of modelsToTest) {
        console.log(`Testing: ${modelName}...`);
        const result = await testModel(modelName);

        if (result.success) {
            console.log(`✅ SUCCESS! Model "${modelName}" works!`);
            console.log(`   Sample response: ${result.response}...\n`);
        } else {
            console.log(`❌ Failed: ${result.error}\n`);
        }
    }
}

findWorkingModel();
