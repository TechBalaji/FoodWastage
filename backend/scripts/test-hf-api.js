require('dotenv').config();
const { HfInference } = require('@huggingface/inference');

const apiKey = process.env.HUGGINGFACE_API_KEY;

console.log('Testing Hugging Face API...');
console.log('API Key present:', !!apiKey);
console.log('API Key starts with hf_:', apiKey?.startsWith('hf_'));
console.log('API Key length:', apiKey?.length);

const hf = new HfInference(apiKey);

async function test() {
    try {
        console.log('\nTesting text generation...');
        const result = await hf.textGeneration({
            model: 'gpt2',
            inputs: 'Hello'
        });
        console.log('✅ Success! API key is working');
        console.log('Response:', result);
    } catch (error) {
        console.log('❌ Error:', error.message);
        console.log('Full error:', error);
    }
}

test();
