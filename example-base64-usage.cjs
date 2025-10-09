#!/usr/bin/env node

/**
 * Example usage of Base64 AI Ad Banner CO2 Analysis
 * 
 * This example shows how to use the base64 report generator
 * with actual image files or base64 data.
 */

const fs = require('fs');
const path = require('path');
const { analyzeImageFromBase64, generateHTMLReport } = require('./generate-base64-report.cjs');

/**
 * Convert image file to base64
 */
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase();
    
    let mimeType;
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg';
        break;
      case '.png':
        mimeType = 'image/png';
        break;
      case '.webp':
        mimeType = 'image/webp';
        break;
      case '.gif':
        mimeType = 'image/gif';
        break;
      default:
        mimeType = 'image/jpeg';
    }
    
    const base64String = imageBuffer.toString('base64');
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error(`Error converting ${imagePath} to base64:`, error.message);
    return null;
  }
}

/**
 * Example 1: Analyze images from ad folder
 */
function analyzeAdFolderImages() {
  console.log('📁 Example 1: Analyzing images from ad folder...\n');
  
  const adFolder = './ad';
  if (!fs.existsSync(adFolder)) {
    console.log('❌ Ad folder not found. Creating sample analysis instead.\n');
    return [];
  }
  
  const imageFiles = fs.readdirSync(adFolder)
    .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
    .slice(0, 5); // Limit to 5 images
  
  if (imageFiles.length === 0) {
    console.log('❌ No image files found in ad folder.\n');
    return [];
  }
  
  const analyses = [];
  
  for (const fileName of imageFiles) {
    const imagePath = path.join(adFolder, fileName);
    console.log(`🔄 Converting ${fileName} to base64...`);
    
    const base64Data = imageToBase64(imagePath);
    if (base64Data) {
      console.log(`✅ Analyzing ${fileName}...`);
      const analysis = analyzeImageFromBase64(base64Data, fileName);
      if (analysis) {
        analyses.push(analysis);
      }
    }
  }
  
  return analyses;
}

/**
 * Example 2: Analyze from direct base64 input
 */
function analyzeDirectBase64() {
  console.log('📸 Example 2: Analyzing direct base64 input...\n');
  
  // Example base64 images (these are minimal examples)
  const base64Images = [
    {
      fileName: 'sample-ad-1.jpg',
      base64Data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    },
    {
      fileName: 'sample-ad-2.png',
      base64Data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    }
  ];
  
  const analyses = [];
  
  for (const imageData of base64Images) {
    console.log(`🔄 Analyzing ${imageData.fileName}...`);
    const analysis = analyzeImageFromBase64(imageData.base64Data, imageData.fileName);
    if (analysis) {
      analyses.push(analysis);
    }
  }
  
  return analyses;
}

/**
 * Main execution
 */
function main() {
  console.log('🌍 Base64 AI Ad Banner CO₂ Analysis Examples\n');
  console.log('='.repeat(50) + '\n');
  
  // Try to analyze real images first
  let analyses = analyzeAdFolderImages();
  
  // If no real images, use direct base64 examples
  if (analyses.length === 0) {
    analyses = analyzeDirectBase64();
  }
  
  if (analyses.length === 0) {
    console.log('❌ No images could be analyzed. Please check your setup.\n');
    return;
  }
  
  console.log(`\n✅ Successfully analyzed ${analyses.length} images`);
  
  // Generate report
  console.log('📄 Generating HTML report...');
  const htmlReport = generateHTMLReport(analyses);
  
  // Write report
  const outputFile = 'Base64_Analysis_Report.html';
  fs.writeFileSync(outputFile, htmlReport, 'utf8');
  
  console.log(`\n🎉 Report generated: ${path.resolve(outputFile)}`);
  
  // Show summary
  const totalSavings = analyses.reduce((sum, a) => sum + a.co2Savings, 0);
  const avgSavings = (analyses.reduce((sum, a) => sum + parseFloat(a.percentageSavings), 0) / analyses.length).toFixed(1);
  
  console.log(`\n📊 Analysis Summary:`);
  console.log(`   - Images processed: ${analyses.length}`);
  console.log(`   - Average CO₂ savings: ${avgSavings}%`);
  console.log(`   - Total CO₂ saved: ${totalSavings > 1000 ? (totalSavings/1000).toFixed(2) + 'kg' : Math.round(totalSavings) + 'g'}`);
  console.log(`   - Processing method: Base64 encoding`);
  console.log(`   - LLM analysis: Dual model approach`);
  
  console.log(`\n🌱 Environmental Impact:`);
  analyses.forEach((analysis, index) => {
    console.log(`   ${index + 1}. ${analysis.metadata.fileName}: ${analysis.percentageSavings}% CO₂ reduction`);
  });
  
  console.log(`\n📖 Open ${outputFile} in your browser to view the detailed report.`);
}

// Usage instructions
if (require.main === module) {
  console.log('Usage Examples:');
  console.log('1. Place images in ./ad folder and run: node example-base64-usage.cjs');
  console.log('2. Or modify the base64Images array with your own base64 data');
  console.log('3. The script will automatically convert files to base64 and analyze them\n');
  
  main();
} else {
  // Export for use as module
  module.exports = {
    imageToBase64,
    analyzeAdFolderImages,
    analyzeDirectBase64
  };
}