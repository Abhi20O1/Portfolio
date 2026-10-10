import sharp from 'sharp';
import { unlinkSync } from 'fs';

async function optimize() {
  await sharp('./public/Logo.png')
    .resize(200) // Logo is tiny on screen, 200px is plenty
    .webp({ quality: 80 })
    .toFile('./public/Logo.webp');

  await sharp('./public/robo.png')
    .resize(1000) // Hero image doesn't need to be huge
    .webp({ quality: 80 })
    .toFile('./public/robo.webp');

  // Delete original files
  unlinkSync('./public/Logo.png');
  unlinkSync('./public/robo.png');
}

optimize().then(() => console.log('Optimized successfully')).catch(console.error);
