const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function build() {
  try {
    console.log('Building with Vite...');
    await execAsync('vite build');
    
    console.log('Compiling server with TypeScript...');
    await execAsync('tsc --project tsconfig.server.json --outDir dist --rootDir .');
    
    console.log('Moving compiled server...');
    await execAsync('mv dist/server/index.js dist/index.cjs');
    
    console.log('✓ Build complete!');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

build();
