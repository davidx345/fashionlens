import { readdir } from 'fs/promises';
import { join } from 'path';

async function checkProject() {
  try {
    const frontendPath = 'c:\\Users\\xstat\\OneDrive\\Documents\\Dev\\webDev\\fashionlens\\frontend';
    
    console.log('Checking project structure...');
    
    // Check if package.json exists
    try {
      const files = await readdir(frontendPath);
      console.log('✓ Frontend directory accessible');
      console.log('Files found:', files.slice(0, 10), files.length > 10 ? '...' : '');
    } catch (error) {
      console.log('✗ Cannot access frontend directory:', error.message);
    }
    
    // Check if critical files exist
    const criticalFiles = [
      'package.json',
      'next.config.ts',
      'tailwind.config.ts',
      'tsconfig.json'
    ];
    
    for (const file of criticalFiles) {
      try {
        await readdir(join(frontendPath, file));
        console.log(`✓ ${file} exists`);
      } catch {
        console.log(`✗ ${file} missing or inaccessible`);
      }
    }
    
  } catch (error) {
    console.error('Error checking project:', error);
  }
}

checkProject();
