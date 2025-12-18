const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEYS = [
    'AIzaSyCcgEKePNpPNDDP-1x5Syf4bYgLufLE7N4',
    'AIzaSyDLcHg-bFPatWsFIwC0JyA2tkg2r51Qa_0'
];

async function verifyKeys() {
    console.log('🔍 Verifying API Keys...');

    for (const key of API_KEYS) {
        const maskedKey = key.substring(0, 10) + '...';
        try {
            const genAI = new GoogleGenerativeAI(key);
            // Use a lightweight model for verification
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const result = await model.generateContent('Hello');
            const response = await result.response;
            const text = response.text();

            if (text) {
                console.log(`✅ Key ${maskedKey}: VALID`);
            } else {
                console.log(`⚠️ Key ${maskedKey}: Valid but returned empty response`);
            }
        } catch (error) {
            console.error(`❌ Key ${maskedKey}: INVALID - ${error.message}`);
        }
    }
}

verifyKeys();
