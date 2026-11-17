const fs = require('fs');

// Create 32x32 32bpp ICO containing InfraTrack Shield
function createInfraTrackIco() {
  const width = 32;
  const height = 32;
  const bpp = 32;
  
  // Create pixel buffer (32x32 RGBA)
  // Bottom-up for BMP
  const pixels = Buffer.alloc(width * height * 4);
  
  const cForest = [0x2C, 0x3D, 0x16, 0xFF]; // BGRA: #163D2C
  const cDeep = [0x22, 0x2D, 0x10, 0xFF];   // BGRA: #102D22
  const cWhite = [0xFF, 0xFF, 0xFF, 0xFF];  // BGRA: #FFFFFF
  const cSage = [0xD9, 0xE8, 0xDC, 0xFF];   // BGRA: #DCE8D9
  const cTransparent = [0x00, 0x00, 0x00, 0x00];

  for (let y = 0; y < height; y++) { // y=0 is bottom in BMP
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const actualY = 31 - y; // top-down coordinate
      
      // Rounded rectangle test: corner radius 7
      let inBox = true;
      const cornerR = 7;
      if (x < cornerR && actualY < cornerR) {
        if ((x - cornerR) ** 2 + (actualY - cornerR) ** 2 > cornerR ** 2) inBox = false;
      } else if (x >= width - cornerR && actualY < cornerR) {
        if ((x - (width - 1 - cornerR)) ** 2 + (actualY - cornerR) ** 2 > cornerR ** 2) inBox = false;
      } else if (x < cornerR && actualY >= height - cornerR) {
        if ((x - cornerR) ** 2 + (actualY - (height - 1 - cornerR)) ** 2 > cornerR ** 2) inBox = false;
      } else if (x >= width - cornerR && actualY >= height - cornerR) {
        if ((x - (width - 1 - cornerR)) ** 2 + (actualY - (height - 1 - cornerR)) ** 2 > cornerR ** 2) inBox = false;
      }
      
      if (!inBox) {
        pixels[idx] = 0; pixels[idx+1] = 0; pixels[idx+2] = 0; pixels[idx+3] = 0;
        continue;
      }
      
      // Default to dark botanical green gradient
      let color = actualY < 16 ? cForest : cDeep;
      
      // Shield outline check
      // Center is x=16, y=6 to 25
      const dx = Math.abs(x - 15.5);
      const sy = actualY;
      
      // Shield shape bounds
      if (sy >= 7 && sy <= 24) {
        let maxDx = 0;
        if (sy <= 13) {
          maxDx = 8 - (sy - 7) * 0.2; // top widening
        } else {
          maxDx = 8 - (sy - 13) * 0.7; // tapering to bottom point
        }
        
        if (dx <= maxDx) {
          // Inside shield
          const isBorder = (Math.abs(dx - maxDx) < 1.2) || (sy <= 8) || (sy >= 23 && dx <= 1.5);
          if (isBorder) {
            color = cWhite;
          } else {
            color = cForest;
          }
        }
      }
      
      // Checkmark check
      // Points: (12, 15) to (15, 18) to (20, 12)
      const isCheck1 = (Math.abs((actualY - 15) - (x - 12)) < 1.2) && x >= 12 && x <= 15;
      const isCheck2 = (Math.abs((actualY - 18) + (x - 15) * 1.2) < 1.3) && x >= 15 && x <= 20;
      if (isCheck1 || isCheck2) {
        color = cSage;
      }
      
      pixels[idx] = color[0];
      pixels[idx+1] = color[1];
      pixels[idx+2] = color[2];
      pixels[idx+3] = color[3];
    }
  }

  // BMP Header (BITMAPINFOHEADER)
  const bih = Buffer.alloc(40);
  bih.writeUInt32LE(40, 0); // biSize
  bih.writeInt32LE(width, 4); // biWidth
  bih.writeInt32LE(height * 2, 8); // biHeight (double height for ICO mask)
  bih.writeUInt16LE(1, 12); // biPlanes
  bih.writeUInt16LE(bpp, 14); // biBitCount
  bih.writeUInt32LE(0, 16); // biCompression (BI_RGB)
  bih.writeUInt32LE(pixels.length, 20); // biSizeImage
  
  // AND mask (1 bit per pixel, 32 rows, 4 bytes per row = 128 bytes)
  const andMask = Buffer.alloc((width / 8) * height, 0); // all 0 = opaque according to alpha
  
  const imgData = Buffer.concat([bih, pixels, andMask]);
  
  // ICO Header (6 bytes)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // type 1 = icon
  icoHeader.writeUInt16LE(1, 4); // 1 image
  
  // Directory entry (16 bytes)
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(width, 0);
  dirEntry.writeUInt8(height, 1);
  dirEntry.writeUInt8(0, 2); // color count
  dirEntry.writeUInt8(0, 3); // reserved
  dirEntry.writeUInt16LE(1, 4); // color planes
  dirEntry.writeUInt16LE(bpp, 6); // bits per pixel
  dirEntry.writeUInt32LE(imgData.length, 8); // size of image data
  dirEntry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)
  
  const finalIco = Buffer.concat([icoHeader, dirEntry, imgData]);
  fs.writeFileSync('public/favicon.ico', finalIco);
  console.log('Saved public/favicon.ico successfully, size:', finalIco.length);
}

createInfraTrackIco();
