const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function extractLayers() {
  const src = path.join(__dirname, '../public/images/mascot-money-transparent.png');
  const outDir = path.join(__dirname, '../public/images/mascot-parts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const meta = await sharp(src).metadata();
  const W = meta.width; // 1254
  const H = meta.height; // 1254
  console.log('Image dimensions:', W, H);

  // We have sharp loaded. Let's crop:
  // 1. Left Ear
  // In the image, the left ear (from viewer's perspective on left side, kangguru's right ear)
  // roughly: x: 190 to 520, y: 70 to 450
  // Let's create high-res crops with transparent padding preserving relative coordinate or standalone:
  
  // Telinga Kiri (Viewer's left):
  // Let's crop just the bounding box
  await sharp(src)
    .extract({ left: Math.round(W * 0.16), top: Math.round(H * 0.05), width: Math.round(W * 0.28), height: Math.round(H * 0.35) })
    .png()
    .toFile(path.join(outDir, 'ear-left.png'));

  // Telinga Kanan (Viewer's right):
  await sharp(src)
    .extract({ left: Math.round(W * 0.54), top: Math.round(H * 0.01), width: Math.round(W * 0.24), height: Math.round(H * 0.32) })
    .png()
    .toFile(path.join(outDir, 'ear-right.png'));

  // Mata Kiri (Viewer's left eye):
  await sharp(src)
    .extract({ left: Math.round(W * 0.38), top: Math.round(H * 0.31), width: Math.round(W * 0.16), height: Math.round(H * 0.18) })
    .png()
    .toFile(path.join(outDir, 'eye-left.png'));

  // Mata Kanan (Viewer's right eye):
  await sharp(src)
    .extract({ left: Math.round(W * 0.59), top: Math.round(H * 0.25), width: Math.round(W * 0.14), height: Math.round(H * 0.18) })
    .png()
    .toFile(path.join(outDir, 'eye-right.png'));

  // Tangan & Gepokan Uang Kertas:
  await sharp(src)
    .extract({ left: Math.round(W * 0.57), top: Math.round(H * 0.44), width: Math.round(W * 0.27), height: Math.round(H * 0.28) })
    .png()
    .toFile(path.join(outDir, 'cash-hand.png'));

  console.log('Finished extracting initial parts');
}

extractLayers().catch(console.error);

