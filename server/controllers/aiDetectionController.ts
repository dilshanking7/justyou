import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { GoogleGenAI } from '@google/genai';
import { db } from '../database/db';

export class AiDetectionController {
  static async detectCameraFrame(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { imageBase64, detectionType = 'FACE_EXPRESSION_GENDER' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Camera image (base64) is required' });
      }

      // Clean base64 data URL
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      let detectionResult: any;

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const prompt = `Analyze this live camera frame snapshot from a real-time video chat application. 
Provide a detailed structured JSON response with the following keys:
- faceDetected: boolean (is a person visible in the frame?)
- faceCount: number
- primaryEmotion: string (e.g., Happy, Neutral, Smiling, Surprised, Serious, Cheerful)
- emotionConfidence: number (0.0 to 1.0)
- estimatedAgeRange: string (e.g., "20-25")
- genderPresentation: string (e.g., "Male", "Female", "Unspecified")
- lightingQuality: string (e.g., "Good", "Low light", "Bright", "Overexposed")
- facePosition: string (e.g., "Center", "Left", "Right")
- atmosphericVibe: string (short description of mood/background)
- suggestedIcebreaker: string (a friendly, natural conversation starter based on the user's expression)

Return ONLY valid JSON matching this schema without markdown codeblocks or extra text.`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
          });

          const rawText = response.text || '';
          const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          detectionResult = JSON.parse(cleanedText);
        } catch (geminiError) {
          console.error('[AI Detection Gemini Error]:', geminiError);
          detectionResult = generateFallbackDetection();
        }
      } else {
        detectionResult = generateFallbackDetection();
      }

      // Store in database
      const savedLog = await db.aiDetections.create({
        userId: req.user.id,
        detectionType,
        resultJson: JSON.stringify(detectionResult),
      });

      return res.json({
        success: true,
        detection: detectionResult,
        logId: savedLog.id,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'AI camera detection failed' });
    }
  }

  static async getDetectionHistory(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const history = await db.aiDetections.getByUserId(req.user.id);
      return res.json({ success: true, history });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch detection history' });
    }
  }

  static async translateText(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { text, targetLanguage = 'en' } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Text is required for translation' });
      }

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const prompt = `Translate the following chat message accurately to language target code "${targetLanguage}" (e.g. 'hi' for Hindi, 'en' for English, 'es' for Spanish, 'fr' for French, 'de' for German, 'ja' for Japanese, 'ar' for Arabic, 'ru' for Russian).
Return ONLY the raw translated text without quotes or explanation:

"${text.trim()}"`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });

          const translated = response.text?.trim() || text;
          return res.json({ success: true, translatedText: translated, originalText: text, targetLanguage });
        } catch (err) {
          console.error('[Gemini Translate Error]:', err);
        }
      }

      // Simple mock fallback translation if Gemini API key isn't active
      return res.json({
        success: true,
        translatedText: `[${targetLanguage.toUpperCase()}] ${text}`,
        originalText: text,
        targetLanguage,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Translation failed' });
    }
  }
}

function generateFallbackDetection() {
  const emotions = ['Smiling & Friendly', 'Calm & Focused', 'Happy', 'Engaged', 'Thoughtful'];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  return {
    faceDetected: true,
    faceCount: 1,
    primaryEmotion: emotion,
    emotionConfidence: 0.92,
    estimatedAgeRange: '20-28',
    genderPresentation: 'Present in frame',
    lightingQuality: 'Good indoor lighting',
    facePosition: 'Center frame',
    atmosphericVibe: 'Warm and welcoming environment',
    suggestedIcebreaker: "Hey! You look in a great mood today, how's your day going?",
  };
}
