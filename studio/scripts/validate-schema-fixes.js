/**
 * Schema Validation Fixes Checker
 * 
 * This script validates that all schema fixes have been properly implemented
 * without requiring Sanity API access.
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if a file exists and contains specific content
 */
function checkFileContains(filePath, searchStrings) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const results = {};
    
    searchStrings.forEach(searchString => {
      results[searchString] = content.includes(searchString);
    });
    
    return { exists: true, content, results };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

/**
 * Validate FAQ schema fixes
 */
function validateFAQSchema() {
  console.log('🔍 Checking FAQ schema fixes...');
  
  const faqSchemaPath = path.join(__dirname, '..', 'schemas', 'documents', 'faqs.tsx');
  const requiredFields = [
    "name: 'category'",
    "type: 'reference'",
    "to: [{ type: 'faqscategories' }]"
  ];
  
  const result = checkFileContains(faqSchemaPath, requiredFields);
  
  if (!result.exists) {
    console.log('❌ FAQ schema file not found');
    return false;
  }
  
  const allFieldsPresent = Object.values(result.results).every(Boolean);
  
  if (allFieldsPresent) {
    console.log('✅ FAQ schema: category field added');
    return true;
  } else {
    console.log('❌ FAQ schema: missing category field');
    return false;
  }
}

/**
 * Validate Events schema fixes
 */
function validateEventsSchema() {
  console.log('🔍 Checking Events schema fixes...');
  
  const eventsSchemaPath = path.join(__dirname, '..', 'schemas', 'documents', 'events.ts');
  const requiredFields = [
    "name: 'eventDate'",
    "name: 'eventTime'",
    "name: 'isVirtual'",
    "name: 'location'",
    "name: 'registrationLink'"
  ];
  
  const result = checkFileContains(eventsSchemaPath, requiredFields);
  
  if (!result.exists) {
    console.log('❌ Events schema file not found');
    return false;
  }
  
  const allFieldsPresent = Object.values(result.results).every(Boolean);
  
  if (allFieldsPresent) {
    console.log('✅ Events schema: all missing fields added');
    return true;
  } else {
    console.log('❌ Events schema: some fields missing');
    Object.entries(result.results).forEach(([field, present]) => {
      if (!present) {
        console.log(`   - Missing: ${field}`);
      }
    });
    return false;
  }
}

/**
 * Validate Blogs schema fixes
 */
function validateBlogsSchema() {
  console.log('🔍 Checking Blogs schema fixes...');
  
  const blogsSchemaPath = path.join(__dirname, '..', 'schemas', 'documents', 'blogs.ts');
  const requiredFields = [
    "name: 'content'",
    "type: 'pageSection'"
  ];
  
  const result = checkFileContains(blogsSchemaPath, requiredFields);
  
  if (!result.exists) {
    console.log('❌ Blogs schema file not found');
    return false;
  }
  
  const allFieldsPresent = Object.values(result.results).every(Boolean);
  
  if (allFieldsPresent) {
    console.log('✅ Blogs schema: content field added');
    return true;
  } else {
    console.log('❌ Blogs schema: missing content field');
    return false;
  }
}

/**
 * Validate Blog Authors schema fixes
 */
function validateBlogAuthorsSchema() {
  console.log('🔍 Checking Blog Authors schema fixes...');
  
  const authorsSchemaPath = path.join(__dirname, '..', 'schemas', 'documents', 'blogsAuthor.ts');
  const requiredFields = [
    "name: 'name'",
    "name: 'bio'",
    "type: 'text'"
  ];
  
  const result = checkFileContains(authorsSchemaPath, requiredFields);
  
  if (!result.exists) {
    console.log('❌ Blog Authors schema file not found');
    return false;
  }
  
  const allFieldsPresent = Object.values(result.results).every(Boolean);
  
  if (allFieldsPresent) {
    console.log('✅ Blog Authors schema: name and bio fields added');
    return true;
  } else {
    console.log('❌ Blog Authors schema: missing fields');
    return false;
  }
}

/**
 * Validate Navigation Menu schema fixes
 */
function validateNavigationMenuSchema() {
  console.log('🔍 Checking Navigation Menu schema fixes...');
  
  const navSchemaPath = path.join(__dirname, '..', 'schemas', 'documents', 'navigationMenu.ts');
  const requiredFields = [
    "name: 'include_in_sitemap'",
    "type: 'boolean'"
  ];
  
  const result = checkFileContains(navSchemaPath, requiredFields);
  
  if (!result.exists) {
    console.log('❌ Navigation Menu schema file not found');
    return false;
  }
  
  const allFieldsPresent = Object.values(result.results).every(Boolean);
  
  if (allFieldsPresent) {
    console.log('✅ Navigation Menu schema: include_in_sitemap field added');
    return true;
  } else {
    console.log('❌ Navigation Menu schema: missing include_in_sitemap field');
    return false;
  }
}

/**
 * Check if fix script exists
 */
function validateFixScript() {
  console.log('🔍 Checking data migration script...');
  
  const scriptPath = path.join(__dirname, 'fix-schema-validation.js');
  
  if (fs.existsSync(scriptPath)) {
    console.log('✅ Data migration script exists');
    return true;
  } else {
    console.log('❌ Data migration script not found');
    return false;
  }
}

/**
 * Check if documentation exists
 */
function validateDocumentation() {
  console.log('🔍 Checking documentation...');
  
  const docPath = path.join(__dirname, '..', 'SCHEMA_VALIDATION_FIXES.md');
  
  if (fs.existsSync(docPath)) {
    console.log('✅ Schema validation fixes documentation exists');
    return true;
  } else {
    console.log('❌ Documentation not found');
    return false;
  }
}

/**
 * Main validation function
 */
function main() {
  console.log('🚀 Validating Schema Validation Fixes\n');
  
  const validations = [
    validateFAQSchema,
    validateEventsSchema,
    validateBlogsSchema,
    validateBlogAuthorsSchema,
    validateNavigationMenuSchema,
    validateFixScript,
    validateDocumentation
  ];
  
  const results = validations.map(validation => validation());
  const allPassed = results.every(Boolean);
  
  console.log('\n📋 Validation Summary:');
  console.log('='.repeat(50));
  
  if (allPassed) {
    console.log('✅ All schema validation fixes have been implemented successfully!');
    console.log('\n🎯 Next Steps:');
    console.log('1. Set up your .env.local file with Sanity credentials');
    console.log('2. Run `npm run fix:schema` to migrate existing data');
    console.log('3. Test the fixes in Sanity Studio');
    console.log('4. Run `npm run seed:check` to verify no conflicts remain');
  } else {
    console.log('❌ Some schema validation fixes are missing or incomplete.');
    console.log('\n🔧 Please review the failed checks above and ensure all fixes are properly implemented.');
  }
  
  console.log('\n📚 For detailed information, see: SCHEMA_VALIDATION_FIXES.md');
  
  process.exit(allPassed ? 0 : 1);
}

// Run the validation
if (require.main === module) {
  main();
}

module.exports = {
  validateFAQSchema,
  validateEventsSchema,
  validateBlogsSchema,
  validateBlogAuthorsSchema,
  validateNavigationMenuSchema,
  validateFixScript,
  validateDocumentation,
  main
};