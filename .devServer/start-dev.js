/* eslint-disable no-console */
const { fork, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const ncp = require('ncp').ncp; // Use ncp for copying files

main();

async function main() {
  let serverStarted = false;
  console.log('+---------------------+');
  console.log('| Starting plugin dev |');
  console.log('|   acode plugin dev  |');
  console.log('+---------------------+');

  const esbuildSource = path.resolve(__dirname,"..", 'node_modules', '.bin', 'esbuild');
  const esbuildDest = path.resolve(__dirname,  'esbuild');

  // Check if esbuild binary exists in .devServer
  if (!fs.existsSync(esbuildDest)) {
    console.log('esbuild binary not found in .devServer. Copying from node_modules...');
    
    // Copy the esbuild binary to .devServer directory
    await copyEsbuildBinary(esbuildSource, esbuildDest);
  }

  // Run esbuild to bundle the app
  const esbuildCmd = spawn(esbuildDest, [
    './src/main.js', // Input file
    '--bundle', // Bundle all dependencies
    '--outdir=dist', // Output directory
    '--format=esm', // ES Modules
    '--target=es6', // Target ES6
    '--loader:.js=jsx', // Process .js files as JSX
  ]);

  // Log esbuild output
  esbuildCmd.stdout.on('data', (data) => {
    console.log(`ESBUILD OUT: ${data}`);
  });

  esbuildCmd.stderr.on('data', (data) => {
    console.log(`ESBUILD ERR: ${data}`);
  });

  esbuildCmd.on('close', (code) => {
    if (code === 0) {
      console.log('ESBUILD: Build completed successfully');
      
      // Run pack-zip.js after the build
      runPackZip();

      // Start the server only once
      if (!serverStarted) {
        startServer();
        serverStarted = true;
      }
    } else {
      console.log(`ESBUILD: Build failed with code ${code}`);
      process.exit(1);
    }
  });

  esbuildCmd.on('error', (err) => {
    console.log('ESBUILD ERROR', err);
    process.exit(1);
  });
}

async function startServer() {
  const server = fork(path.resolve(__dirname, './start-server.js'));
  
  server.on('error', (err) => {
    console.log('SERVER ERROR', err);
    server.kill(1);
    process.exit(1);
  });

  server.on('exit', (code) => {
    if (code !== 0) {
      console.log(`SERVER exited with code ${code}`);
      process.exit(1);
    }
  });
}

// Function to run pack-zip.js after esbuild completes
function runPackZip() {
  console.log('Running pack-zip.js...');

  const packZipCmd = spawn('node', [path.resolve(__dirname, './pack-zip.js')]);

  packZipCmd.stdout.on('data', (data) => {
    console.log(`PACK-ZIP OUT: ${data}`);
  });

  packZipCmd.stderr.on('data', (data) => {
    console.log(`PACK-ZIP ERR: ${data}`);
  });

  packZipCmd.on('close', (code) => {
    if (code === 0) {
      console.log('PACK-ZIP: Finished zipping.');
    } else {
      console.log(`PACK-ZIP: Failed with code ${code}`);
    }
  });

  packZipCmd.on('error', (err) => {
    console.log('PACK-ZIP ERROR', err);
    process.exit(1);
  });
}

// Function to copy the esbuild binary to the .devServer directory
function copyEsbuildBinary(source, destination) {
  return new Promise((resolve, reject) => {
    ncp(source, destination, (err) => {
      if (err) {
        console.log('Failed to copy esbuild binary:', err);
        reject(err);
      } else {
        console.log('Successfully copied esbuild binary to .devServer');
        resolve();
      }
    });
  });
}