const { createClient } = require('@sanity/client');
const path = require('path');
const fs = require('fs');
const { generateSampleData } = require('./seed-data');

// Load environment variables from .env.local if it exists
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// Check for required environment variables
function checkEnvironmentVariables() {
  const required = {
    SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
    SANITY_STUDIO_API_TOKEN: process.env.SANITY_STUDIO_API_TOKEN
  };

  const missing = Object.entries(required)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   • ${key}`));
    console.error('\n📝 Please create a .env.local file with the required variables.');
    console.error('   You can copy .env.example and fill in your values.');
    console.error('\n🔗 Get your API token from: https://manage.sanity.io/');
    process.exit(1);
  }

  return required;
}

// Initialize Sanity client
let client;
try {
  const env = checkEnvironmentVariables();
  client = createClient({
    projectId: env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_API_DATASET || 'production',
    useCdn: false,
    token: env.SANITY_STUDIO_API_TOKEN,
    apiVersion: '2025-01-01'
  });
} catch (error) {
  console.error('❌ Failed to initialize Sanity client:', error.message);
  process.exit(1);
}

// Check for conflicts
async function checkConflicts() {
  console.log('🔍 Checking for potential conflicts with existing documents...');
  
  const conflicts = [];
  const warnings = [];
  
  try {
    // Get all sample data IDs
    const sampleDataIds = [];
    
    const dataTypes = [
      'siteSettings',
      'blogAuthors', 
      'categories',
      'tags',
      'faqCategories',
      'pages',
      'navigationMenu',
      'blogs',
      'events', 
      'news',
      'faqs'
    ];

    for (const dataType of dataTypes) {
      const data = generateSampleData[dataType]();
      
      if (Array.isArray(data)) {
        data.forEach(item => sampleDataIds.push({ id: item._id, type: item._type, category: dataType }));
      } else {
        sampleDataIds.push({ id: data._id, type: data._type, category: dataType });
      }
    }

    console.log(`\n📋 Checking ${sampleDataIds.length} sample documents...`);

    // Check each document
    for (const { id, type, category } of sampleDataIds) {
      try {
        const existing = await client.getDocument(id);
        
        if (existing) {
          if (existing._type !== type) {
            conflicts.push({
              id,
              category,
              issue: 'Type mismatch',
              existing: existing._type,
              sample: type,
              severity: 'high'
            });
          } else {
            warnings.push({
              id,
              category,
              issue: 'Document exists',
              existing: existing._type,
              sample: type,
              severity: 'medium'
            });
          }
        }
      } catch (error) {
        // Document doesn't exist, which is fine
        if (!error.message.includes('not found')) {
          console.error(`   ⚠️  Error checking ${id}:`, error.message);
        }
      }
    }

    // Check for references to documents that might be deleted
    console.log('\n🔗 Checking for references to conflicting documents...');
    
    for (const conflict of conflicts) {
      try {
        const query = `*[references("${conflict.id}")]`;
        const references = await client.fetch(query);
        
        if (references.length > 0) {
          conflict.references = references.length;
          conflict.severity = 'critical';
        }
      } catch (error) {
        console.error(`   ⚠️  Error checking references for ${conflict.id}:`, error.message);
      }
    }

    // Display results
    console.log('\n📊 Conflict Analysis Results:');
    
    if (conflicts.length === 0 && warnings.length === 0) {
      console.log('✅ No conflicts detected! Safe to import sample data.');
      return;
    }

    if (conflicts.length > 0) {
      console.log(`\n🚨 ${conflicts.length} Critical Conflicts Found:`);
      conflicts.forEach(conflict => {
        console.log(`   • ${conflict.id} (${conflict.category})`);
        console.log(`     Issue: ${conflict.issue}`);
        console.log(`     Existing type: ${conflict.existing}`);
        console.log(`     Sample type: ${conflict.sample}`);
        if (conflict.references) {
          console.log(`     ⚠️  Referenced by ${conflict.references} other documents`);
        }
        console.log('');
      });
      
      console.log('🔧 Recommended Actions:');
      console.log('   1. Backup your existing data');
      console.log('   2. Remove or rename conflicting documents');
      console.log('   3. Update references if necessary');
      console.log('   4. Run the import again');
    }

    if (warnings.length > 0) {
      console.log(`\n⚠️  ${warnings.length} Potential Overwrites:`);
      warnings.forEach(warning => {
        console.log(`   • ${warning.id} (${warning.category}) - will be overwritten`);
      });
      
      console.log('\n💡 These documents will be updated with sample data.');
      console.log('   Consider backing up if you want to preserve existing content.');
    }

  } catch (error) {
    console.error('❌ Error during conflict check:', error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  await checkConflicts();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkConflicts };