/**
 * Schema Validation Fix Script
 * 
 * This script addresses the following issues:
 * 1. Adds missing _key properties to array items
 * 2. Converts string values to arrays where schema expects arrays
 * 3. Ensures data consistency with updated schemas
 */

const { createClient } = require('@sanity/client');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Validate required environment variables
function validateEnvironmentVariables() {
  const requiredVars = {
    SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
    SANITY_STUDIO_API_DATASET: process.env.SANITY_STUDIO_API_DATASET,
    SANITY_STUDIO_API_TOKEN: process.env.SANITY_STUDIO_API_TOKEN,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.error('Please check your .env.local file and ensure all required variables are set.');
    console.error('Refer to .env.example for the required format.');
    process.exit(1);
  }

  return requiredVars;
}

// Validate and get environment variables
const envVars = validateEnvironmentVariables();

// Initialize Sanity client
const client = createClient({
  projectId: envVars.SANITY_STUDIO_PROJECT_ID,
  dataset: envVars.SANITY_STUDIO_API_DATASET,
  token: envVars.SANITY_STUDIO_API_TOKEN,
  apiVersion: '2025-02-14',
  useCdn: false,
});

/**
 * Generate a unique key for array items
 */
function generateKey() {
  return uuidv4().replace(/-/g, '').substring(0, 12);
}

/**
 * Fix FAQ documents
 */
async function fixFAQs() {
  console.log('🔧 Fixing FAQ documents...');
  
  const faqs = await client.fetch(`*[_type == "faqs"]`);
  
  for (const faq of faqs) {
    const patches = [];
    
    // Fix answer field if it's a string instead of array
    if (typeof faq.answer === 'string') {
      patches.push({
        set: {
          answer: [
            {
              _type: 'block',
              _key: generateKey(),
              style: 'normal',
              markDefs: [],
              children: [
                {
                  _type: 'span',
                  _key: generateKey(),
                  text: faq.answer,
                  marks: []
                }
              ]
            }
          ]
        }
      });
    }
    
    // Apply patches if any
    if (patches.length > 0) {
      for (const patch of patches) {
        await client.patch(faq._id).set(patch.set).commit();
      }
      console.log(`✅ Fixed FAQ: ${faq.question || faq._id}`);
    }
  }
}

/**
 * Fix Navigation Menu documents
 */
async function fixNavigationMenus() {
  console.log('🔧 Fixing Navigation Menu documents...');
  
  const navMenus = await client.fetch(`*[_type == "navigationMenu"]`);
  
  for (const menu of navMenus) {
    let needsUpdate = false;
    const updatedItems = [];
    
    if (menu.items && Array.isArray(menu.items)) {
      for (const item of menu.items) {
        if (!item._key) {
          item._key = generateKey();
          needsUpdate = true;
        }
        
        // Fix sub-navigation items if they exist
        if (item.subNavigationItems && Array.isArray(item.subNavigationItems)) {
          for (const subItem of item.subNavigationItems) {
            if (!subItem._key) {
              subItem._key = generateKey();
              needsUpdate = true;
            }
          }
        }
        
        updatedItems.push(item);
      }
      
      if (needsUpdate) {
        await client.patch(menu._id).set({ items: updatedItems }).commit();
        console.log(`✅ Fixed Navigation Menu: ${menu.title || menu._id}`);
      }
    }
  }
}

/**
 * Fix Page Section documents (for content with rows)
 */
async function fixPageSections() {
  console.log('🔧 Fixing Page Section documents...');
  
  // Find all documents that have pageSection fields
  const documents = await client.fetch(`*[defined(mainContent.rows) || defined(content.rows)]`);
  
  for (const doc of documents) {
    let needsUpdate = false;
    const updates = {};
    
    // Fix mainContent.rows
    if (doc.mainContent && doc.mainContent.rows && Array.isArray(doc.mainContent.rows)) {
      const updatedRows = doc.mainContent.rows.map(row => {
        if (!row._key) {
          row._key = generateKey();
          needsUpdate = true;
        }
        return row;
      });
      
      if (needsUpdate) {
        updates['mainContent.rows'] = updatedRows;
      }
    }
    
    // Fix content.rows
    if (doc.content && doc.content.rows && Array.isArray(doc.content.rows)) {
      const updatedRows = doc.content.rows.map(row => {
        if (!row._key) {
          row._key = generateKey();
          needsUpdate = true;
        }
        return row;
      });
      
      if (needsUpdate) {
        updates['content.rows'] = updatedRows;
      }
    }
    
    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      await client.patch(doc._id).set(updates).commit();
      console.log(`✅ Fixed Page Section in: ${doc.title || doc._id}`);
    }
  }
}

/**
 * Fix Site Settings documents
 */
async function fixSiteSettings() {
  console.log('🔧 Fixing Site Settings documents...');
  
  const siteSettings = await client.fetch(`*[_type == "siteSettings"]`);
  
  for (const settings of siteSettings) {
    let needsUpdate = false;
    const updates = {};
    
    // Fix excerpt field if it's a string instead of array
    if (typeof settings.excerpt === 'string') {
      updates.excerpt = [
        {
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: generateKey(),
              text: settings.excerpt,
              marks: []
            }
          ]
        }
      ];
      needsUpdate = true;
    }
    
    // Apply updates if any
    if (needsUpdate) {
      await client.patch(settings._id).set(updates).commit();
      console.log(`✅ Fixed Site Settings: ${settings._id}`);
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('🚀 Starting schema validation fixes...');
    
    await fixFAQs();
    await fixNavigationMenus();
    await fixPageSections();
    await fixSiteSettings();
    
    console.log('✅ All schema validation fixes completed successfully!');
    console.log('\n📋 Summary of fixes:');
    console.log('- Added missing _key properties to array items');
    console.log('- Converted string values to block arrays where needed');
    console.log('- Updated navigation menu items with proper keys');
    console.log('- Fixed page section row structures');
    
  } catch (error) {
    console.error('❌ Error during schema validation fixes:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  fixFAQs,
  fixNavigationMenus,
  fixPageSections,
  fixSiteSettings,
  main
};