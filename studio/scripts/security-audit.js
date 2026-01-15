#!/usr/bin/env node

const { execSync } = require('child_process');
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

function runCommand(command, description) {
  try {
    log(`\n${colors.bold}🔍 ${description}${colors.reset}`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

function checkDependencyVulnerabilities() {
  log('\n🛡️  DEPENDENCY VULNERABILITY SCAN', 'blue');
  log('=' .repeat(50), 'blue');

  // Check if package-lock.json exists
  const packageLockPath = path.join(process.cwd(), 'package-lock.json');
  if (!fs.existsSync(packageLockPath)) {
    log('⚠️  package-lock.json not found. Run npm install first.', 'yellow');
    return false;
  }

  // Run npm audit
  const auditResult = runCommand('npm audit --audit-level=moderate --json', 'Running npm audit...');
  
  if (auditResult.success) {
    try {
      const auditData = JSON.parse(auditResult.output);
      
      if (auditData.metadata && auditData.metadata.vulnerabilities) {
        const { vulnerabilities } = auditData.metadata;
        const total = vulnerabilities.total || 0;
        
        if (total === 0) {
          log('✅ No vulnerabilities found!', 'green');
          return true;
        } else {
          log(`⚠️  Found ${total} vulnerabilities:`, 'yellow');
          log(`   - Info: ${vulnerabilities.info || 0}`, 'blue');
          log(`   - Low: ${vulnerabilities.low || 0}`, 'yellow');
          log(`   - Moderate: ${vulnerabilities.moderate || 0}`, 'yellow');
          log(`   - High: ${vulnerabilities.high || 0}`, 'red');
          log(`   - Critical: ${vulnerabilities.critical || 0}`, 'red');
          
          if (vulnerabilities.high > 0 || vulnerabilities.critical > 0) {
            log('\n🚨 High or Critical vulnerabilities found!', 'red');
            log('Run "npm audit fix" to attempt automatic fixes.', 'yellow');
            return false;
          }
          
          return true;
        }
      }
    } catch (parseError) {
      log('⚠️  Could not parse audit results', 'yellow');
    }
  } else {
    log('❌ npm audit failed', 'red');
    if (auditResult.output) {
      log(auditResult.output, 'red');
    }
    return false;
  }
  
  return true;
}

function checkOutdatedPackages() {
  log('\n📦 OUTDATED PACKAGES CHECK', 'blue');
  log('=' .repeat(50), 'blue');
  
  const outdatedResult = runCommand('npm outdated --json', 'Checking for outdated packages...');
  
  if (outdatedResult.success) {
    try {
      const outdatedData = JSON.parse(outdatedResult.output || '{}');
      const packages = Object.keys(outdatedData);
      
      if (packages.length === 0) {
        log('✅ All packages are up to date!', 'green');
      } else {
        log(`📋 Found ${packages.length} outdated packages:`, 'yellow');
        packages.forEach(pkg => {
          const info = outdatedData[pkg];
          log(`   - ${pkg}: ${info.current} → ${info.latest}`, 'yellow');
        });
        log('\nRun "npm update" to update packages.', 'blue');
      }
    } catch (parseError) {
      log('ℹ️  No outdated packages or could not parse results', 'blue');
    }
  }
}

function generateSecurityReport() {
  const reportPath = path.join(process.cwd(), 'security-report.json');
  const timestamp = new Date().toISOString();
  
  const report = {
    timestamp,
    scan_type: 'dependency_vulnerability_scan',
    tools_used: ['npm audit', 'npm outdated'],
    status: 'completed'
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📄 Security report saved to: ${reportPath}`, 'blue');
}

function main() {
  log('\n🔒 SECURITY AUDIT STARTING', 'bold');
  log('=' .repeat(50), 'blue');
  
  const vulnerabilityCheck = checkDependencyVulnerabilities();
  checkOutdatedPackages();
  generateSecurityReport();
  
  log('\n🔒 SECURITY AUDIT COMPLETED', 'bold');
  
  if (!vulnerabilityCheck) {
    log('\n❌ Security audit failed due to high/critical vulnerabilities', 'red');
    process.exit(1);
  } else {
    log('\n✅ Security audit passed', 'green');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkDependencyVulnerabilities,
  checkOutdatedPackages,
  generateSecurityReport
};