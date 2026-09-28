import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI client with standard header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper model runner with fallbacks
async function callGemini(contents: any, systemInstruction?: string, responseSchema?: any) {
  const models = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const config: any = {};
      if (systemInstruction) config.systemInstruction = systemInstruction;
      if (responseSchema) {
        config.responseMimeType = 'application/json';
        config.responseSchema = responseSchema;
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying next:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed to respond.');
}

// 1. Generate OOTD Daily Recommendations
app.post('/api/stylist/generate-ootd', async (req: Request, res: Response) => {
  try {
    const { occasion, weather, vibe, gender, closetItems, specialPreferences } = req.body;

    const systemPrompt = `You are a world-class high-fashion creative director and personal wardrobe stylist with discerning taste, deep knowledge of silhouettes, proportions, textiles, color harmony, and styling nuances.
Your job is to generate 3 distinct, exceptionally tasteful OOTD (Outfit Of The Day) formulas tailored to the user's context.
Every outfit must feel authentic, wearable, and elevated—never generic. Provide specific textures, cuts, and realistic styling tricks (e.g. French tucks, cuff rolls, jewelry layering, structured balance).
Respond STRICTLY with valid JSON matching the requested schema.`;

    const userPrompt = `Generate 3 distinct OOTD options for today:
- Occasion: ${occasion || 'Casual & Effortless'}
- Weather & Temp: ${JSON.stringify(weather || { temp: 20, condition: 'Mild and Clear', season: 'Spring' })}
- Aesthetic / Vibe: ${vibe || 'Quiet Luxury & Clean Tailoring'}
- Gender Expression: ${gender || 'Unisex'}
${closetItems && closetItems.length > 0 ? `- User's Available Wardrobe Items to incorporate where suitable: ${JSON.stringify(closetItems)}` : ''}
${specialPreferences ? `- Additional Notes / Preferences: ${specialPreferences}` : ''}

Generate 3 tiers:
1. "The Signature" (The quintessential, polished standard for this vibe)
2. "The Elevated / Statement" (Higher fashion quotient, tailored or striking)
3. "The Relaxed / Modern Casual" (Effortless, comfortable yet high-taste)

Make each breakdown comprehensive: top, bottom, outerwear/layer, footwear, bag, accessories, fragrance pairing, and specific styling hacks.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        outfits: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              tier: { type: Type.STRING },
              name: { type: Type.STRING },
              vibeTag: { type: Type.STRING },
              summary: { type: Type.STRING },
              whyItWorks: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    pieceName: { type: Type.STRING },
                    color: { type: Type.STRING },
                    texture: { type: Type.STRING },
                    stylingTip: { type: Type.STRING },
                  },
                  required: ['category', 'pieceName', 'color', 'texture', 'stylingTip'],
                },
              },
              stylingHacks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              fragranceNote: { type: Type.STRING },
              groomingOrHair: { type: Type.STRING },
              styleScore: { type: Type.INTEGER },
              colorPalette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hex: { type: Type.STRING },
                  },
                  required: ['name', 'hex'],
                },
              },
            },
            required: ['id', 'tier', 'name', 'vibeTag', 'summary', 'whyItWorks', 'items', 'stylingHacks', 'fragranceNote', 'groomingOrHair', 'styleScore', 'colorPalette'],
          },
        },
      },
      required: ['outfits'],
    };

    const rawResponse = await callGemini(userPrompt, systemPrompt, schema);
    const parsed = JSON.parse(rawResponse);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating OOTD:', error);
    res.status(500).json({ error: error.message || 'Failed to generate OOTD' });
  }
});

// 2. Upgrade / Critique Outfit (Multimodal Vision or Text)
app.post('/api/stylist/upgrade-outfit', async (req: Request, res: Response) => {
  try {
    const { imageBase64, imageMimeType, description, targetVibe, occasion } = req.body;

    if (!imageBase64 && !description) {
      return res.status(400).json({ error: 'Please provide either an image or a description of your outfit.' });
    }

    const systemPrompt = `You are an elite fashion editor and personal stylist known for constructive, highly actionable, kind yet razor-sharp outfit analysis.
Your job is to analyze what the user is currently wearing and provide a 3-level "Outfit Upgrade" plan:
- Level 1: Zero-cost instant micro-adjustments (tuck, roll, cuff, buttons, jewelry placement)
- Level 2: Smart single-piece swaps (e.g. swapping shoe silhouette or jacket cut)
- Level 3: The elevated investment or statement touch (outerwear, luxury texture, statement accessory)
Be specific about proportions (rule of thirds), neckline balance, shoe weight vs hem width, color temperature, and textural contrast.
Respond strictly in JSON format matching the schema.`;

    const contents: any[] = [];
    if (imageBase64) {
      contents.push({
        inlineData: {
          mimeType: imageMimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
        },
      });
    }

    contents.push({
      text: `Analyze this outfit and provide the ultimate Style Upgrade plan:
${description ? `Outfit Description: ${description}` : ''}
Target Vibe / Goal: ${targetVibe || 'Elevate to effortless, high-taste chic'}
Occasion: ${occasion || 'Daily Wear / Smart Casual'}

Provide:
1. Detected Items currently worn
2. Style Assessment (honest, constructive evaluation of silhouette, color, and fit)
3. Scores (Overall, Proportion, Color Harmony, Silhouette, Accessory Balance 0-100)
4. What is working well (keep these!)
5. Zero-Cost Instant Tweaks (actionable right now in front of a mirror)
6. Strategic Swaps & Additions
7. Recommended upgraded color palette
8. The Final Upgraded Outfit Formula`,
    });

    const schema = {
      type: Type.OBJECT,
      properties: {
        detectedItems: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        styleAssessment: { type: Type.STRING },
        scores: {
          type: Type.OBJECT,
          properties: {
            overall: { type: Type.INTEGER },
            proportion: { type: Type.INTEGER },
            colorHarmony: { type: Type.INTEGER },
            silhouette: { type: Type.INTEGER },
            accessoryBalance: { type: Type.INTEGER },
          },
          required: ['overall', 'proportion', 'colorHarmony', 'silhouette', 'accessoryBalance'],
        },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        zeroCostTweaks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING },
              impact: { type: Type.STRING },
            },
            required: ['action', 'impact'],
          },
        },
        pieceSwaps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              currentPiece: { type: Type.STRING },
              recommendedPiece: { type: Type.STRING },
              level: { type: Type.STRING }, // "Quick Swap", "Elevated Pivot", "Statement Touch"
              fashionReason: { type: Type.STRING },
            },
            required: ['currentPiece', 'recommendedPiece', 'level', 'fashionReason'],
          },
        },
        upgradedPalette: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              hex: { type: Type.STRING },
            },
            required: ['name', 'hex'],
          },
        },
        finalUpgradedOutfit: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            formula: { type: Type.STRING },
          },
          required: ['title', 'summary', 'formula'],
        },
      },
      required: ['detectedItems', 'styleAssessment', 'scores', 'strengths', 'zeroCostTweaks', 'pieceSwaps', 'upgradedPalette', 'finalUpgradedOutfit'],
    };

    const rawResponse = await callGemini(contents, systemPrompt, schema);
    const parsed = JSON.parse(rawResponse);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error upgrading outfit:', error);
    res.status(500).json({ error: error.message || 'Failed to upgrade outfit' });
  }
});

// 3. Garment Auto-Detection for Digital Closet
app.post('/api/stylist/analyze-garment', async (req: Request, res: Response) => {
  try {
    const { imageBase64, imageMimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const systemPrompt = `You are a fashion cataloging specialist. Analyze the uploaded garment or accessory photo and classify it with precision for a digital closet inventory.`;
    const contents = [
      {
        inlineData: {
          mimeType: imageMimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
        },
      },
      {
        text: 'Classify this piece: Category (Tops, Bottoms, Outerwear, Footwear, Bags, Accessories), specific item name, primary color, secondary color, material, pattern, aesthetic style tags, seasons suitable, and 3 best pairing ideas.',
      },
    ];

    const schema = {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING },
        name: { type: Type.STRING },
        primaryColor: { type: Type.STRING },
        colorHex: { type: Type.STRING },
        material: { type: Type.STRING },
        pattern: { type: Type.STRING },
        styleTags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        seasons: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        pairingSuggestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['category', 'name', 'primaryColor', 'colorHex', 'material', 'pattern', 'styleTags', 'seasons', 'pairingSuggestions'],
    };

    const rawResponse = await callGemini(contents, systemPrompt, schema);
    const parsed = JSON.parse(rawResponse);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing garment:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze garment' });
  }
});

// 4. Capsule Wardrobe Planner for Travel / Minimalist Week
app.post('/api/stylist/capsule-planner', async (req: Request, res: Response) => {
  try {
    const { destination, days, season, vibe, gender } = req.body;

    const systemPrompt = `You are an expert luxury travel stylist who creates hyper-efficient, high-style capsule wardrobes where every piece pairs with almost every other piece.`;
    const userPrompt = `Create a complete travel capsule wardrobe for:
- Destination: ${destination || 'Milan & Lake Como'}
- Duration: ${days || 5} days
- Season / Climate: ${season || 'Autumn (15-20°C)'}
- Vibe / Aesthetic: ${vibe || 'Quiet Luxury & Elegant Minimalist'}
- Gender Expression: ${gender || 'Unisex'}

Provide:
1. 8-10 core capsule pieces that pack into a carry-on
2. Day-by-day outfits for each day of the trip using only these pieces
3. Essential packing and styling rules for this destination`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        capsuleSummary: { type: Type.STRING },
        pieces: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              name: { type: Type.STRING },
              color: { type: Type.STRING },
              role: { type: Type.STRING },
            },
            required: ['category', 'name', 'color', 'role'],
          },
        },
        dailyItinerary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dayNumber: { type: Type.INTEGER },
              activityName: { type: Type.STRING },
              outfitTitle: { type: Type.STRING },
              piecesUsed: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              stylingNote: { type: Type.STRING },
            },
            required: ['dayNumber', 'activityName', 'outfitTitle', 'piecesUsed', 'stylingNote'],
          },
        },
        packingWisdom: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['capsuleSummary', 'pieces', 'dailyItinerary', 'packingWisdom'],
    };

    const rawResponse = await callGemini(userPrompt, systemPrompt, schema);
    const parsed = JSON.parse(rawResponse);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error planning capsule:', error);
    res.status(500).json({ error: error.message || 'Failed to plan capsule' });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`OOTD AI Fashion Stylist server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
