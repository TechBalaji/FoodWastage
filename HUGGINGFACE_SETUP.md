# Hugging Face AI Integration Guide

## Overview
This application now uses **Hugging Face** for AI-powered food image classification instead of Google Gemini. The model can identify food types from images and provide detailed analysis.

## Model Used
- **Model**: `nateraw/food`
- **Dataset**: Food-101 (101 food categories)
- **Accuracy**: ~85% on food classification
- **Free Tier**: 30,000 requests/month

## Getting Your Hugging Face API Key

### Step 1: Create Account
1. Go to https://huggingface.co/join
2. Sign up with email or GitHub
3. Verify your email

### Step 2: Get API Token
1. Go to https://huggingface.co/settings/tokens
2. Click **"New token"**
3. Name it: `food-waste-app`
4. Select **"Read"** access (free tier)
5. Click **"Generate token"**
6. **Copy the token** (starts with `hf_...`)

### Step 3: Add to Environment
Open `backend/.env` and add:
```env
HUGGINGFACE_API_KEY=hf_YourTokenHere
```

### Step 4: Restart Backend
```bash
cd backend
npm run dev
```

## How It Works

1. **User uploads food image** → Image sent to backend
2. **Backend calls Hugging Face API** → Image classification
3. **Model identifies food type** → e.g., "rice", "chicken curry", "bread"
4. **Analysis generated** → Based on food type:
   - Edibility status
   - Shelf life estimation
   - Spoilage indicators
   - Reuse ideas
   - Recipes
   - Storage tips

## Supported Food Categories

The model can identify 101 food types including:
- **Indian**: Biryani, Curry, Dal, Samosa, Pakora, Naan
- **Rice dishes**: Fried rice, Risotto, Sushi
- **Bread**: Toast, Sandwich, Bagel, Croissant
- **Proteins**: Chicken, Beef, Fish, Eggs
- **Vegetables**: Salads, Stir-fry
- **Desserts**: Cake, Ice cream, Pudding
- And many more...

## API Limits

### Free Tier
- **30,000 requests/month**
- **~1,000 requests/day**
- **No credit card required**

### Rate Limits
- **100 requests/minute**
- Sufficient for most applications

## Advantages Over Gemini

✅ **Free tier available** - No billing required
✅ **Specialized for food** - Better accuracy for food images
✅ **No regional restrictions** - Works worldwide
✅ **Simple integration** - Easy to use API
✅ **Fast inference** - ~1-2 seconds per image

## Future Improvements

### Option 1: Fine-tune the Model
- Collect your own dataset of fresh vs spoiled food
- Fine-tune the model for better spoilage detection
- Deploy on Hugging Face Spaces

### Option 2: Use Multiple Models
- **Classification**: `nateraw/food` (current)
- **Freshness detection**: Train custom model
- **Object detection**: Detect multiple food items

### Option 3: Self-hosted Model
- Download model weights
- Run inference locally with TensorFlow.js
- No API calls needed (faster, more private)

## Troubleshooting

### Error: "Invalid API token"
- Check token is correct in `.env`
- Make sure token has "Read" access
- Regenerate token if needed

### Error: "Rate limit exceeded"
- Free tier: 30k/month limit
- Wait or upgrade to Pro ($9/month for unlimited)

### Error: "Model not found"
- Check internet connection
- Model name is correct: `nateraw/food`
- Try again after a few minutes

## Cost Comparison

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Hugging Face | 30k/month | $9/month unlimited |
| Google Gemini | Limited/Blocked | $0.25/1k images |
| AWS Rekognition | 5k/month | $1/1k images |

## Next Steps

1. ✅ Get Hugging Face API key
2. ✅ Add to `.env` file
3. ✅ Restart backend
4. ✅ Test food upload
5. 🔄 (Optional) Fine-tune model for better accuracy
6. 🔄 (Optional) Add freshness detection model

---

**Need Help?**
- Hugging Face Docs: https://huggingface.co/docs/api-inference
- Model Page: https://huggingface.co/nateraw/food
- Community Forum: https://discuss.huggingface.co
