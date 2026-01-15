#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateSchemaFile(filePath) {
  const issues = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Check for common issues
    if (content.includes('// TODO') || content.includes('// FIXME')) {
      issues.push('Contains TODO or FIXME comments');
    }
    
    if (content.includes('console.log')) {
      issues.push('Contains console.log statements');
    }
    
    // Check for commented out code blocks
    const commentedCodeRegex = /\/\*[\s\S]*?\*\/|^\/\/.*$/gm;
    const commentedLines = content.match(commentedCodeRegex);
    if (commentedLines && commentedLines.some(line => line.includes('defineField') || line.includes('validation'))) {
      issues.push('Contains commented out schema definitions');
    }
    
    // Check for required field validations
    if (content.includes('defineField') && !content.includes('validation')) {
      // Only warn if it's a document schema (not all fields need validation)
      if (fileName.includes('.ts') && !fileName.includes('index.ts')) {
        issues.push('Schema may be missing validation rules');
      }
    }
    
    // Check for proper TypeScript imports
    if (content.includes('defineField') || content.includes('defineType')) {
      if (!content.includes("import { defineField, defineType } from 'sanity'") && 
          !content.includes("import { defineField } from 'sanity'") &&
          !content.includes("import { defineType } from 'sanity'")) {
        issues.push('Missing proper Sanity imports');
      }
    }
    
    // Check for description fields in schema definitions
    const fieldMatches = content.match(/defineField\s*\([^)]+\)/g);
    if (fieldMatches) {
      fieldMatches.forEach((field, index) => {
        if (!field.includes('description') && !field.includes('title')) {
          issues.push(`Field ${index + 1} missing description or title`);
        }
      });
    }
    
    return { valid: issues.length === 0, issues };
    
  } catch (error) {
    return { valid: false, issues: [`Failed to read file: ${error.message}`] };
  }
}

function validateSchemaStructure() {
  log('\n🔍 SCHEMA STRUCTURE VALIDATION', 'blue');
  log('=' .repeat(50), 'blue');
  
  const schemasDir = path.join(process.cwd(), 'schemas');
  
  if (!fs.existsSync(schemasDir)) {
    log('❌ Schemas directory not found', 'red');
    return false;
  }
  
  // Check required directories
  const requiredDirs = ['documents', 'fields', 'objects'];
  const missingDirs = requiredDirs.filter(dir => 
    !fs.existsSync(path.join(schemasDir, dir))
  );
  
  if (missingDirs.length > 0) {
    log(`⚠️  Missing schema directories: ${missingDirs.join(', ')}`, 'yellow');
  } else {
    log('✅ All required schema directories exist', 'green');
  }
  
  // Check main index file
  const mainIndexPath = path.join(schemasDir, 'index.ts');
  if (!fs.existsSync(mainIndexPath)) {
    log('❌ Main schema index.ts file not found', 'red');
    return false;
  }
  
  log('✅ Main schema index file exists', 'green');
  return true;
}

function validateAllSchemas() {
  log('\n📋 INDIVIDUAL SCHEMA VALIDATION', 'blue');
  log('=' .repeat(50), 'blue');
  
  const schemasDir = path.join(process.cwd(), 'schemas');
  let totalFiles = 0;
  let validFiles = 0;
  let totalIssues = 0;
  
  function validateDirectory(dirPath, dirName = '') {
    if (!fs.existsSync(dirPath)) return;
    
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        validateDirectory(filePath, file);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        totalFiles++;
        const result = validateSchemaFile(filePath);
        const relativePath = path.relative(schemasDir, filePath);
        
        if (result.valid) {
          validFiles++;
          log(`✅ ${relativePath}`, 'green');
        } else {
          totalIssues += result.issues.length;
          log(`⚠️  ${relativePath}`, 'yellow');
          result.issues.forEach(issue => {
            log(`   - ${issue}`, 'yellow');
          });
        }
      }
    });
  }
  
  validateDirectory(schemasDir);
  
  log(`\n📊 VALIDATION SUMMARY:`, 'blue');
  log(`   Total files: ${totalFiles}`);
  log(`   Valid files: ${validFiles}`, validFiles === totalFiles ? 'green' : 'yellow');
  log(`   Files with issues: ${totalFiles - validFiles}`, totalFiles === validFiles ? 'green' : 'yellow');
  log(`   Total issues: ${totalIssues}`, totalIssues === 0 ? 'green' : 'yellow');
  
  return totalIssues === 0;
}

function main() {
  log('\n🔍 SCHEMA VALIDATION STARTING', 'bold');
  log('=' .repeat(50), 'blue');
  
  const structureValid = validateSchemaStructure();
  const schemasValid = validateAllSchemas();
  
  log('\n🔍 SCHEMA VALIDATION COMPLETED', 'bold');
  
  if (structureValid && schemasValid) {
    log('\n✅ All schema validations passed!', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Schema validation completed with issues', 'yellow');
    log('Please review and fix the issues above.', 'yellow');
    process.exit(0); // Don't fail the build for warnings
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateSchemaFile,
  validateSchemaStructure,
  validateAllSchemas
};