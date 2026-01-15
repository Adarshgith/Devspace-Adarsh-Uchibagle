#!/usr/bin/env node

/**
 * Environment Validation Script
 * Checks for common security issues and validates environment setup
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
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

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
  } catch (error) {
    return null;
  }
}

function validateEnvironment() {
  log('🔍 Validating Environment Security...\n', 'blue');
  
  let issues = [];
  let warnings = [];
  let passed = [];

  // Check 1: .env.local exists
  if (!checkFileExists('.env.local')) {
    issues.push('❌ .env.local file not found. Copy .env.example to .env.local and configure your values.');
  } else {
    passed.push('✅ .env.local file exists');
  }

  // Check 2: .gitignore includes .env.local
  const gitignoreContent = readFileContent('.gitignore');
  if (gitignoreContent) {
    if (gitignoreContent.includes('.env*.local') || gitignoreContent.includes('.env.local')) {
      passed.push('✅ .env.local is properly ignored by git');
    } else {
      issues.push('❌ .env.local is not in .gitignore - SECURITY RISK!');
    }
  } else {
    warnings.push('⚠️  .gitignore file not found');
  }

  // Check 3: Environment variables are set
  const envContent = readFileContent('.env.local');
  if (envContent) {
    const requiredVars = ['SANITY_STUDIO_PROJECT_ID', 'SANITY_STUDIO_API_TOKEN'];
    const missingVars = [];
    
    requiredVars.forEach(varName => {
      const regex = new RegExp(`^${varName}=.+`, 'm');
      if (!regex.test(envContent)) {
        missingVars.push(varName);
      }
    });

    if (missingVars.length === 0) {
      passed.push('✅ All required environment variables are set');
    } else {
      issues.push(`❌ Missing environment variables: ${missingVars.join(', ')}`);
    }

    // Check for placeholder values
    if (envContent.includes('your_project_id_here') || envContent.includes('your_api_token_here')) {
      issues.push('❌ Environment variables contain placeholder values');
    }

    // Check for potentially exposed tokens in source files
    const tokenMatch = envContent.match(/SANITY_STUDIO_API_TOKEN=(.+)/);
    if (tokenMatch && tokenMatch[1] && tokenMatch[1].length > 10) {
      // Check if this token appears in any source files
      const sourceFiles = ['sanity.config.ts', 'scripts/seed-data.js'];
      let tokenFound = false;
      
      sourceFiles.forEach(file => {
        const content = readFileContent(file);
        if (content && content.includes(tokenMatch[1])) {
          tokenFound = true;
        }
      });

      if (tokenFound) {
        issues.push('❌ API token found hardcoded in source files - CRITICAL SECURITY ISSUE!');
      } else {
        passed.push('✅ API token not found in source files');
      }
    }
  }

  // Check 4: Sanity config has validation
  const configContent = readFileContent('sanity.config.ts');
  if (configContent) {
    if (configContent.includes('validateEnvironmentVariables')) {
      passed.push('✅ Environment validation is enabled in sanity.config.ts');
    } else {
      warnings.push('⚠️  No environment validation found in sanity.config.ts');
    }
  }

  // Display results
  log('\n📊 Validation Results:\n', 'bold');
  
  if (passed.length > 0) {
    log('✅ PASSED CHECKS:', 'green');
    passed.forEach(item => log(`  ${item}`, 'green'));
    log('');
  }

  if (warnings.length > 0) {
    log('⚠️  WARNINGS:', 'yellow');
    warnings.forEach(item => log(`  ${item}`, 'yellow'));
    log('');
  }

  if (issues.length > 0) {
    log('❌ ISSUES FOUND:', 'red');
    issues.forEach(item => log(`  ${item}`, 'red'));
    log('');
    log('🔧 To fix these issues:', 'yellow');
    log('  1. Copy .env.example to .env.local', 'yellow');
    log('  2. Fill in your actual Sanity project values', 'yellow');
    log('  3. Ensure .env.local is in .gitignore', 'yellow');
    log('  4. Never commit API tokens to version control', 'yellow');
    log('  5. Refer to SECURITY_GUIDE.md for detailed instructions\n', 'yellow');
    
    process.exit(1);
  } else {
    log('🎉 All security checks passed!', 'green');
    log('💡 Remember to rotate your API tokens every 90 days.\n', 'blue');
  }
}

// Run validation
validateEnvironment();