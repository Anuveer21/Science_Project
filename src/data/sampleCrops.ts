/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SampleCrop {
  id: 'healthy' | 'blight' | 'chlorosis' | 'powdery';
  title: string;
  description: string;
  filename: string;
}

export const SAMPLE_CROPS: SampleCrop[] = [
  {
    id: 'healthy',
    title: 'Healthy Tomato Leaf',
    description: 'Vibrant green canopy with uniform chlorophyll and no visible lesions.',
    filename: 'healthy_tomato_foliage.png',
  },
  {
    id: 'blight',
    title: 'Suspected Early Blight',
    description: 'Concentric dark brown lesions with surrounding yellow chlorotic halos.',
    filename: 'tomato_early_blight_sample.png',
  },
  {
    id: 'chlorosis',
    title: 'Nutrient Stress Chlorosis',
    description: 'Interveinal yellowing with preserved green main vein vascularization.',
    filename: 'crop_nitrogen_iron_chlorosis.png',
  },
  {
    id: 'powdery',
    title: 'Suspected Powdery Mildew',
    description: 'Superficial white powdery talc-like patches covering the adaxial leaf surface.',
    filename: 'powdery_mildew_foliar.png',
  },
];

/**
 * Generates an authentic raster PNG base64 data URL using standard browser Canvas.
 * Guaranteed to be valid raster bytes for Gemini Vision.
 */
export function generateCropCanvasPng(type: 'healthy' | 'blight' | 'chlorosis' | 'powdery'): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  if (type === 'healthy') {
    ctx.fillStyle = '#1b4332';
  } else if (type === 'blight') {
    ctx.fillStyle = '#283618';
  } else if (type === 'chlorosis') {
    ctx.fillStyle = '#1c2826';
  } else {
    ctx.fillStyle = '#22223b';
  }
  ctx.fillRect(0, 0, 400, 400);

  // Main leaf body
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(200, 40);
  ctx.bezierCurveTo(280, 120, 320, 260, 200, 360);
  ctx.bezierCurveTo(80, 260, 120, 120, 200, 40);
  ctx.closePath();

  if (type === 'healthy') {
    ctx.fillStyle = '#2d6a4f';
    ctx.strokeStyle = '#40916c';
  } else if (type === 'blight') {
    ctx.fillStyle = '#606c38';
    ctx.strokeStyle = '#38431e';
  } else if (type === 'chlorosis') {
    ctx.fillStyle = '#d4d700';
    ctx.strokeStyle = '#aacc00';
  } else {
    ctx.fillStyle = '#4a4e69';
    ctx.strokeStyle = '#22223b';
  }
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.stroke();

  // Primary vein
  ctx.beginPath();
  ctx.moveTo(200, 60);
  ctx.lineTo(200, 350);
  ctx.strokeStyle = type === 'chlorosis' ? '#2b9348' : '#74c69d';
  ctx.lineWidth = type === 'chlorosis' ? 4 : 3;
  ctx.stroke();

  // Lateral veins
  const lateralColor = type === 'chlorosis' ? '#2b9348' : '#74c69d';
  ctx.strokeStyle = lateralColor;
  ctx.lineWidth = 2;

  const yPositions = [130, 190, 250];
  yPositions.forEach((y, i) => {
    ctx.beginPath();
    ctx.moveTo(200, y);
    ctx.quadraticCurveTo(240 + i * 5, y - 25, 270, y - 35 + i * 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(200, y);
    ctx.quadraticCurveTo(160 - i * 5, y - 25, 130, y - 35 + i * 15);
    ctx.stroke();
  });

  // Pathology-specific features
  if (type === 'blight') {
    // Concentric target-board lesions
    const lesions = [
      { x: 230, y: 160, r: 24 },
      { x: 160, y: 220, r: 18 },
      { x: 220, y: 270, r: 14 },
    ];
    lesions.forEach((l) => {
      // Outer halo
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.r + 6, 0, Math.PI * 2);
      ctx.fillStyle = '#dda15e';
      ctx.fill();
      // Outer necrotic ring
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
      ctx.fillStyle = '#582f0e';
      ctx.fill();
      // Inner target ring
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#bc6c25';
      ctx.fill();
      // Center dead tissue
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.r * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#281504';
      ctx.fill();
    });
  } else if (type === 'powdery') {
    // Powdery fungal colonies
    const spots = [
      { x: 180, y: 150, rx: 32, ry: 22 },
      { x: 230, y: 210, rx: 36, ry: 26 },
      { x: 160, y: 270, rx: 28, ry: 18 },
      { x: 210, y: 290, rx: 20, ry: 14 },
    ];
    ctx.fillStyle = 'rgba(245, 240, 235, 0.88)';
    spots.forEach((s) => {
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.rx, s.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Label text
  ctx.restore();
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#ffffff';
  const labelMap = {
    healthy: 'Specimen: Healthy Solanum lycopersicum (Tomato)',
    blight: 'Specimen: Foliar Concentric Necrotic Lesions (Suspected Early Blight)',
    chlorosis: 'Specimen: Interveinal Chlorosis Foliar Pattern (Nutrient Stress)',
    powdery: 'Specimen: White Superficial Fungal Patches (Suspected Powdery Mildew)',
  };
  ctx.fillText(labelMap[type], 16, 385);

  return canvas.toDataURL('image/png');
}
