/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

// Memory store for autonomous patrol captures
let latestPatrolCapture: any = null;
let patrolFramesCount = 0;
let lastPatrolPing: string | null = null;

// Raw binary body support for direct microcontroller JPEG posts
app.use(express.raw({ type: ['image/jpeg', 'image/png'], limit: '10mb' }));
// JSON body parser for dashboard & structured API calls
app.use(express.json({ limit: '15mb' }));

/**
 * Shared Gemini Vision Diagnostic Helper
 */
async function performGeminiCropDiagnosis(
  cleanBase64: string,
  resolvedMime: string,
  filename: string,
  source: 'manual' | 'patrol_car'
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please configure it in AI Studio Secrets.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: resolvedMime,
            data: cleanBase64,
          },
        },
        {
          text: 'Analyze this crop photograph strictly and objectively for precision agriculture diagnostics. Distinguish observed visual symptoms from possible unconfirmed issues. Highlight uncertainties and state if expert review or laboratory testing is required.',
        },
      ],
    },
    config: {
      systemInstruction:
        'You are an expert precision agriculture AI agronomist analyzing crop photographs captured by autonomous patrol cameras. You must never diagnose plant diseases with false certainty. Distinguish carefully between directly observed symptoms and unconfirmed hypotheses. Always provide uncertainty notes and state when visual quality is insufficient.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plant_identification: {
            type: Type.STRING,
            description: 'Identified plant species or crop type, or "Unknown / Unidentifiable" if ambiguous.',
          },
          observed_symptoms: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Visible physical characteristics and symptoms directly observable in the photo (e.g. leaf spots, chlorosis, necrosis, wilting, curling).',
          },
          possible_issues: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Hypothesized potential diseases, nutrient deficiencies, or pest pressures. Must be phrased as possibilities, never absolute diagnoses.',
          },
          condition_summary: {
            type: Type.STRING,
            description: 'Concise summary of overall crop health state (e.g. Healthy, Mild Stress, Moderate Disease Signs, Severe Damage, Indeterminate).',
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Pragmatic, non-destructive agronomic next steps (e.g. soil moisture verification, leaf underside inspection, sanitation).',
          },
          uncertainty_notes: {
            type: Type.STRING,
            description: 'Specific limitations of photo assessment, lighting/resolution constraints (e.g. 0.3MP VGA sensor), and parameters requiring physical laboratory assay.',
          },
          requires_expert_review: {
            type: Type.BOOLEAN,
            description: 'Whether an agronomist or lab assay should inspect the physical specimen before chemical or irreversible intervention.',
          },
        },
        required: [
          'plant_identification',
          'observed_symptoms',
          'possible_issues',
          'condition_summary',
          'recommendations',
          'uncertainty_notes',
          'requires_expert_review',
        ],
      },
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error('Gemini vision model returned an empty response.');
  }

  const parsed = JSON.parse(responseText);

  return {
    id: `crop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    imageName: filename,
    source,
    model: GEMINI_MODEL,
    ...parsed,
  };
}

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    version: '1.1.0',
    service: 'Smart Farm AI Backend',
  });
});

/**
 * Subsystem connectivity prober
 */
app.get('/api/system-status', (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  const patrolConnected = patrolFramesCount > 0;

  res.json({
    timestamp: new Date().toISOString(),
    backend: {
      status: 'online',
      runtime: 'Node.js / Express',
      port: PORT,
      uptime: Math.round(process.uptime()),
    },
    ai: {
      provider: 'Google Gemini',
      model: GEMINI_MODEL,
      configured: hasGeminiKey,
    },
    hardware: {
      patrolCar: {
        connected: patrolConnected,
        status: patrolConnected ? 'online' : 'standby_listener',
        details: patrolConnected
          ? `OV7670 camera active · ${patrolFramesCount} frames ingested (Last: ${lastPatrolPing})`
          : 'Listening on POST /api/patrol/capture (OV7670 VGA 640x480)',
        lastPing: lastPatrolPing || undefined,
      },
      esp32Sensor: {
        connected: false,
        status: 'disconnected',
        details: 'ESP32 sensor node offline. Zero telemetry reported.',
      },
      irrigationController: {
        connected: false,
        status: 'disconnected',
        details: 'Pump relay controller offline. AI automated actuation disabled.',
      },
    },
  });
});

/**
 * Manual Crop Image Upload Endpoint
 */
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    const { image, mimeType, filename } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Missing crop image payload.' });
    }

    let cleanBase64 = image.trim();
    let resolvedMime = mimeType || 'image/jpeg';

    if (cleanBase64.includes(';base64,')) {
      const parts = cleanBase64.split(';base64,');
      resolvedMime = parts[0].replace('data:', '') || resolvedMime;
      cleanBase64 = parts[1];
    } else if (cleanBase64.startsWith('data:')) {
      const commaIdx = cleanBase64.indexOf(',');
      if (commaIdx !== -1) {
        cleanBase64 = cleanBase64.substring(commaIdx + 1);
      }
    }

    cleanBase64 = cleanBase64.replace(/\s+/g, '');

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(resolvedMime)) {
      return res.status(400).json({
        error: `Unsupported image format (${resolvedMime}). Gemini requires standard raster images (JPEG, PNG, or WebP).`,
      });
    }

    if (!/^[A-Za-z0-9+/=]+$/.test(cleanBase64)) {
      return res.status(400).json({
        error: 'Invalid image encoding. Payload must be valid base64 data.',
      });
    }

    const diagnosis = await performGeminiCropDiagnosis(
      cleanBase64,
      resolvedMime,
      filename || 'crop_upload.jpg',
      'manual'
    );

    return res.json(diagnosis);
  } catch (error: any) {
    console.error('Gemini crop analysis error:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'Failed to process crop analysis request.',
    });
  }
});

/**
 * Autonomous Patrol Car Ingestion Endpoint (POST /api/patrol/capture)
 * Supports:
 * 1. Raw binary image stream (Buffer) with Content-Type: image/jpeg or image/png
 * 2. JSON payload with base64 encoded image
 */
app.post('/api/patrol/capture', async (req: Request, res: Response) => {
  try {
    let base64Image = '';
    let mimeType = 'image/jpeg';
    let filename = `ov7670_frame_${Date.now()}.jpg`;

    if (Buffer.isBuffer(req.body) && req.body.length > 0) {
      // Raw binary frame posted by Arduino / ESP32
      base64Image = req.body.toString('base64');
      const reqMime = req.headers['content-type'];
      mimeType = reqMime === 'image/png' ? 'image/png' : 'image/jpeg';
    } else if (req.body && req.body.image) {
      // JSON payload
      let rawStr = req.body.image;
      if (rawStr.includes(';base64,')) {
        base64Image = rawStr.split(';base64,')[1];
      } else {
        base64Image = rawStr;
      }
      mimeType = req.body.mimeType || 'image/jpeg';
      filename = req.body.filename || filename;
    } else {
      return res.status(400).json({
        error: 'Empty or unparseable frame. Send raw binary JPEG or JSON with { image: "base64" }.',
      });
    }

    base64Image = base64Image.replace(/\s+/g, '');

    patrolFramesCount++;
    lastPatrolPing = new Date().toISOString();

    // Autonomous AI diagnosis via Gemini 3.8 Flash
    const diagnosis = await performGeminiCropDiagnosis(
      base64Image,
      mimeType,
      filename,
      'patrol_car'
    );

    // Save as latest autonomous capture
    latestPatrolCapture = {
      ...diagnosis,
      imageDataUrl: `data:${mimeType};base64,${base64Image}`,
    };

    console.log(`[Patrol Car] Ingested frame #${patrolFramesCount} -> Diagnosis complete (${diagnosis.plant_identification})`);

    return res.status(201).json({
      success: true,
      message: 'Frame ingested and analyzed autonomously.',
      frameNumber: patrolFramesCount,
      diagnosis,
    });
  } catch (error: any) {
    console.error('Patrol car capture error:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'Failed to ingest patrol car capture.',
    });
  }
});

/**
 * Get latest autonomous patrol car capture
 */
app.get('/api/patrol/latest', (_req: Request, res: Response) => {
  res.json({
    latest: latestPatrolCapture,
    frameCount: patrolFramesCount,
    lastPing: lastPatrolPing,
  });
});

// Mount Vite middleware in development or serve static build in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Farm AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
