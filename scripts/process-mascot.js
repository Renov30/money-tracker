const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function removeBackground() {
  const inputPath = path.join(__dirname, '../public/images/mascot-money.jpg');
  const outputPath = path.join(__dirname, '../public/images/mascot-money-transparent.png');

  const image = sharp(inputPath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Flood fill from borders to find outer background pixels
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isBg(r, g, b) {
    // Background is near white/off-white (#f6f5f1 ~ rgb 246, 245, 241)
    return r >= 236 && g >= 234 && b >= 230 && Math.abs(r - g) <= 15 && Math.abs(g - b) <= 15;
  }

  // Seed corners & borders
  for (let x = 0; x < width; x++) {
    // Top border
    let idxTop = (0 * width + x) * channels;
    if (isBg(data[idxTop], data[idxTop + 1], data[idxTop + 2])) {
      visited[x] = 1;
      queue.push(x, 0);
    }
    // Bottom border
    let idxBot = ((height - 1) * width + x) * channels;
    if (isBg(data[idxBot], data[idxBot + 1], data[idxBot + 2])) {
      visited[(height - 1) * width + x] = 1;
      queue.push(x, height - 1);
    }
  }

  for (let y = 0; y < height; y++) {
    // Left border
    let idxLeft = (y * width + 0) * channels;
    if (!visited[y * width] && isBg(data[idxLeft], data[idxLeft + 1], data[idxLeft + 2])) {
      visited[y * width] = 1;
      queue.push(0, y);
    }
    // Right border
    let idxRight = (y * width + (width - 1)) * channels;
    if (!visited[y * width + width - 1] && isBg(data[idxRight], data[idxRight + 1], data[idxRight + 2])) {
      visited[y * width + width - 1] = 1;
      queue.push(width - 1, y);
    }
  }

  let head = 0;
  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];

  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const pIdx = (cy * width + cx) * channels;
    // Set alpha to 0 for background
    data[pIdx + 3] = 0;

    for (let i = 0; i < 4; i++) {
      const nx = cx + dx[i];
      const ny = cy + dy[i];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nPos = ny * width + nx;
        if (!visited[nPos]) {
          const nIdx = nPos * channels;
          if (isBg(data[nIdx], data[nIdx + 1], data[nIdx + 2])) {
            visited[nPos] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  // Feathering: soft edge for boundary pixels
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pos = y * width + x;
      const idx = pos * channels;
      if (data[idx + 3] > 0) {
        // Check if neighbor is transparent
        let transparentNeighbors = 0;
        for (let i = 0; i < 4; i++) {
          const nPos = (y + dy[i]) * width + (x + dx[i]);
          if (data[nPos * channels + 3] === 0) {
            transparentNeighbors++;
          }
        }
        if (transparentNeighbors > 0) {
          // If this pixel is close to background color, fade it smoothly
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          if (r >= 225 && g >= 220 && b >= 215) {
            data[idx + 3] = Math.round(data[idx + 3] * (1 - transparentNeighbors * 0.22));
          }
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);

  console.log('Successfully generated transparent mascot at:', outputPath);
}

removeBackground().catch(console.error);

