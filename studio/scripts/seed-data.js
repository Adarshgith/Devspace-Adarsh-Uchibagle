const { createClient } = require('@sanity/client');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

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

// Sample data generators
const generateSampleData = {
  // Site Settings
  siteSettings: () => ({
    _type: 'siteSettings',
    _id: 'siteSettings',
    title: 'Agency Pro - Digital Marketing Excellence',
    description: 'Leading digital marketing agency specializing in web development, SEO, social media marketing, and brand strategy. Transform your business with our innovative solutions.',
    copyright: '© 2024 Agency Pro. All rights reserved.',
    address: '123 Business District, Suite 456\nNew York, NY 10001\nUnited States',
    phone: '+1 (555) 123-4567',
    email: 'hello@agencypro.com',
    linkedInLink: 'https://linkedin.com/company/agencypro',
    twitterLink: 'https://twitter.com/agencypro',
    facebookLink: 'https://facebook.com/agencypro',
    footerButton: {
      footerButtonText: 'Get Free Consultation',
      footerButtonLink: 'https://agencypro.com/contact'
    },
    noIndex: false,
    include_in_sitemap: true
  }),

  // Blog Authors
  blogAuthors: () => [
    {
      _type: 'blogsAuthor',
      _id: 'author-sarah-johnson',
      name: 'Sarah Johnson',
      slug: { current: 'sarah-johnson' },
      bio: 'Senior Digital Marketing Strategist with 8+ years of experience in SEO, content marketing, and brand development.',
      assignTo: 'blog'
    },
    {
      _type: 'blogsAuthor',
      _id: 'author-mike-chen',
      name: 'Mike Chen',
      slug: { current: 'mike-chen' },
      bio: 'Full-stack developer and technical writer specializing in modern web technologies and user experience design.',
      assignTo: 'blog'
    },
    {
      _type: 'blogsAuthor',
      _id: 'author-emma-davis',
      name: 'Emma Davis',
      slug: { current: 'emma-davis' },
      bio: 'Creative director and brand strategist helping businesses build compelling visual identities and marketing campaigns.',
      assignTo: 'blog'
    }
  ],

  // Categories
  categories: () => [
    {
      _type: 'categories',
      _id: 'category-digital-marketing',
      title: 'Digital Marketing',
      slug: { current: 'digital-marketing' },
      description: 'Latest trends and strategies in digital marketing'
    },
    {
      _type: 'categories',
      _id: 'category-web-development',
      title: 'Web Development',
      slug: { current: 'web-development' },
      description: 'Web development tutorials and best practices'
    },
    {
      _type: 'categories',
      _id: 'category-seo',
      title: 'SEO',
      slug: { current: 'seo' },
      description: 'Search engine optimization tips and techniques'
    },
    {
      _type: 'categories',
      _id: 'category-branding',
      title: 'Branding',
      slug: { current: 'branding' },
      description: 'Brand strategy and visual identity insights'
    }
  ],

  // Tags
  tags: () => [
    { _type: 'tags', _id: 'tag-seo', title: 'SEO', slug: { current: 'seo' } },
    { _type: 'tags', _id: 'tag-content-marketing', title: 'Content Marketing', slug: { current: 'content-marketing' } },
    { _type: 'tags', _id: 'tag-social-media', title: 'Social Media', slug: { current: 'social-media' } },
    { _type: 'tags', _id: 'tag-web-design', title: 'Web Design', slug: { current: 'web-design' } },
    { _type: 'tags', _id: 'tag-analytics', title: 'Analytics', slug: { current: 'analytics' } },
    { _type: 'tags', _id: 'tag-conversion', title: 'Conversion', slug: { current: 'conversion' } }
  ],

  // FAQ Categories
  faqCategories: () => [
    {
      _type: 'faqCategories',
      _id: 'faq-category-general',
      title: 'General Questions',
      slug: { current: 'general-questions' }
    },
    {
      _type: 'faqCategories',
      _id: 'faq-category-services',
      title: 'Our Services',
      slug: { current: 'our-services' }
    },
    {
      _type: 'faqCategories',
      _id: 'faq-category-pricing',
      title: 'Pricing & Billing',
      slug: { current: 'pricing-billing' }
    }
  ],

  // Sample Blogs
  blogs: () => [
    {
      _type: 'blogs',
      _id: 'blog-seo-guide-2024',
      title: 'The Complete SEO Guide for 2024: Strategies That Actually Work',
      slug: { current: 'complete-seo-guide-2024' },
      resourceId: 'B1',
      excerpt: 'Discover the latest SEO strategies and techniques that will help your website rank higher in search results and drive more organic traffic.',
      blogsAuthor: { _type: 'reference', _ref: 'author-sarah-johnson' },
      publishDate: '2024-01-15',
      isSticky: true,
      featuredBlog: true,
      mainContent: {
        rows: [{
          _type: 'row',
          rowTitle: 'Introduction',
          rowType: 'standard',
          backgroundColor: 'none',
          columns: 1,
          showColumn1: true,
          column1: [{
            _type: 'richText',
            content: [{
              _type: 'block',
              children: [{
                _type: 'span',
                text: 'Search Engine Optimization continues to evolve rapidly. This comprehensive guide covers the most effective SEO strategies for 2024, including technical SEO, content optimization, and link building techniques that deliver real results.'
              }]
            }]
          }]
        }]
      }
    },
    {
      _type: 'blogs',
      _id: 'blog-web-design-trends',
      title: '10 Web Design Trends That Will Dominate 2024',
      slug: { current: 'web-design-trends-2024' },
      resourceId: 'B2',
      excerpt: 'Stay ahead of the curve with these cutting-edge web design trends that will shape the digital landscape in 2024.',
      blogsAuthor: { _type: 'reference', _ref: 'author-mike-chen' },
      publishDate: '2024-01-20',
      isSticky: false,
      featuredBlog: true,
      mainContent: {
        rows: [{
          _type: 'row',
          rowTitle: 'Design Trends Overview',
          rowType: 'standard',
          backgroundColor: 'none',
          columns: 1,
          showColumn1: true,
          column1: [{
            _type: 'richText',
            content: [{
              _type: 'block',
              children: [{
                _type: 'span',
                text: 'From AI-powered personalization to immersive 3D experiences, discover the web design trends that will captivate users and drive conversions in 2024.'
              }]
            }]
          }]
        }]
      }
    },
    {
      _type: 'blogs',
      _id: 'blog-content-marketing-strategy',
      title: 'Building a Content Marketing Strategy That Converts',
      slug: { current: 'content-marketing-strategy-converts' },
      resourceId: 'B3',
      excerpt: 'Learn how to create a content marketing strategy that not only engages your audience but also drives measurable business results.',
      blogsAuthor: { _type: 'reference', _ref: 'author-emma-davis' },
      publishDate: '2024-01-25',
      isSticky: false,
      featuredBlog: false,
      mainContent: {
        rows: [{
          _type: 'row',
          rowTitle: 'Strategy Foundation',
          rowType: 'standard',
          backgroundColor: 'none',
          columns: 1,
          showColumn1: true,
          column1: [{
            _type: 'richText',
            content: [{
              _type: 'block',
              children: [{
                _type: 'span',
                text: 'Effective content marketing goes beyond creating great content. It requires strategic planning, audience understanding, and systematic execution to drive real business growth.'
              }]
            }]
          }]
        }]
      }
    }
  ],

  // Sample Events
  events: () => [
    {
      _type: 'events',
      _id: 'event-digital-marketing-summit',
      title: 'Digital Marketing Summit 2024',
      slug: { current: 'digital-marketing-summit-2024' },
      excerpt: 'Join industry leaders for a day of insights, networking, and cutting-edge digital marketing strategies.',
      eventDate: '2024-03-15',
      eventTime: '09:00',
      location: 'Convention Center, New York',
      isVirtual: false,
      registrationLink: 'https://agencypro.com/events/digital-marketing-summit'
    },
    {
      _type: 'events',
      _id: 'event-seo-workshop',
      title: 'Advanced SEO Workshop',
      slug: { current: 'advanced-seo-workshop' },
      excerpt: 'Hands-on workshop covering advanced SEO techniques and tools for experienced marketers.',
      eventDate: '2024-02-28',
      eventTime: '14:00',
      location: 'Online',
      isVirtual: true,
      registrationLink: 'https://agencypro.com/events/seo-workshop'
    }
  ],

  // Sample News
  news: () => [
    {
      _type: 'news',
      _id: 'news-agency-expansion',
      title: 'Agency Pro Expands to West Coast with New San Francisco Office',
      slug: { current: 'agency-pro-expands-west-coast' },
      excerpt: 'We are excited to announce the opening of our new San Francisco office to better serve our West Coast clients.',
      publishDate: '2024-01-30',
      content: {
        rows: [{
          _type: 'row',
          rowTitle: 'Expansion News',
          rowType: 'standard',
          backgroundColor: 'none',
          columns: 1,
          showColumn1: true,
          column1: [{
            _type: 'richText',
            content: [{
              _type: 'block',
              children: [{
                _type: 'span',
                text: 'This expansion represents our commitment to providing exceptional digital marketing services to businesses across the United States.'
              }]
            }]
          }]
        }]
      }
    }
  ],

  // Sample FAQs
  faqs: () => [
    {
      _type: 'faqs',
      _id: 'faq-what-services',
      question: 'What services does Agency Pro offer?',
      answer: 'We offer comprehensive digital marketing services including SEO, web development, social media marketing, content creation, PPC advertising, and brand strategy.',
      category: { _type: 'reference', _ref: 'faq-category-services' }
    },
    {
      _type: 'faqs',
      _id: 'faq-how-long-results',
      question: 'How long does it take to see results?',
      answer: 'Results vary depending on the service and your current situation. SEO typically shows improvements in 3-6 months, while PPC campaigns can generate leads immediately.',
      category: { _type: 'reference', _ref: 'faq-category-general' }
    },
    {
      _type: 'faqs',
      _id: 'faq-pricing-structure',
      question: 'How is your pricing structured?',
      answer: 'We offer flexible pricing options including monthly retainers, project-based pricing, and performance-based models. Contact us for a custom quote based on your needs.',
      category: { _type: 'reference', _ref: 'faq-category-pricing' }
    }
  ],

  // Sample Pages
  pages: () => [
    {
      _type: 'page',
      _id: 'page-home',
      title: 'Home',
      slug: { current: 'home' },
      heroSection: {
        visible: true,
        backgroundType: 'image',
        heroText: 'Transform Your Business with Digital Excellence',
        subheader: 'Leading Digital Marketing Agency',
        description: 'We help businesses grow through innovative digital marketing strategies, cutting-edge web development, and data-driven results.',
        isBreadcrumb: false
      },
      mainContent: {
        rows: [{
          _type: 'row',
          rowTitle: 'Welcome Section',
          rowType: 'standard',
          backgroundColor: 'none',
          columns: 1,
          showColumn1: true,
          column1: [{
            _type: 'richText',
            content: [{
              _type: 'block',
              children: [{
                _type: 'span',
                text: 'Welcome to Agency Pro, where digital innovation meets business growth. Our team of experts is dedicated to helping your business thrive in the digital landscape.'
              }]
            }]
          }]
        }]
      },
      include_in_sitemap: true,
      noIndex: false
    },
    {
      _type: 'page',
      _id: 'page-about',
      title: 'About Us',
      slug: { current: 'about' },
      heroSection: {
        visible: true,
        backgroundType: 'color',
        heroText: 'About Agency Pro',
        subheader: 'Our Story',
        description: 'Learn about our mission, values, and the passionate team behind Agency Pro.',
        isBreadcrumb: true
      },
      mainContent: {
        rows: [{
          _type: 'row',
          rowTitle: 'Our Story',
          rowType: 'standard',
          backgroundColor: 'none',
          columns: 1,
          showColumn1: true,
          column1: [{
            _type: 'richText',
            content: [{
              _type: 'block',
              children: [{
                _type: 'span',
                text: 'Founded in 2018, Agency Pro has grown from a small startup to a leading digital marketing agency. We believe in the power of digital transformation to drive business success.'
              }]
            }]
          }]
        }]
      },
      include_in_sitemap: true,
      noIndex: false
    },
    {
      _type: 'page',
      _id: 'page-services',
      title: 'Our Services',
      slug: { current: 'services' },
      heroSection: {
        visible: true,
        backgroundType: 'color',
        heroText: 'Our Services',
        subheader: 'Comprehensive Digital Solutions',
        description: 'Discover our full range of digital marketing and web development services.',
        isBreadcrumb: true
      },
      mainContent: {
        rows: [{
          _type: 'row',
          rowTitle: 'Services Overview',
          rowType: 'standard',
          backgroundColor: 'none',
          columns: 1,
          showColumn1: true,
          column1: [{
            _type: 'richText',
            content: [{
              _type: 'block',
              children: [{
                _type: 'span',
                text: 'From SEO and content marketing to web development and brand strategy, we offer comprehensive digital solutions tailored to your business needs.'
              }]
            }]
          }]
        }]
      },
      include_in_sitemap: true,
      noIndex: false
    },
    {
      _type: 'page',
      _id: 'page-contact',
      title: 'Contact Us',
      slug: { current: 'contact' },
      heroSection: {
        visible: true,
        backgroundType: 'color',
        heroText: 'Get In Touch',
        subheader: 'Contact Agency Pro',
        description: 'Ready to transform your business? Contact us today for a free consultation.',
        isBreadcrumb: true
      },
      mainContent: {
        rows: [{
          _type: 'row',
          rowTitle: 'Contact Information',
          rowType: 'standard',
          backgroundColor: 'none',
          columns: 1,
          showColumn1: true,
          column1: [{
            _type: 'richText',
            content: [{
              _type: 'block',
              children: [{
                _type: 'span',
                text: 'We would love to hear from you. Contact us today to discuss how we can help your business grow.'
              }]
            }]
          }]
        }]
      },
      include_in_sitemap: true,
      noIndex: false
    },
    {
      _type: 'page',
      _id: 'page-blog',
      title: 'Blog',
      slug: { current: 'blog' },
      heroSection: {
        visible: true,
        backgroundType: 'color',
        heroText: 'Our Blog',
        subheader: 'Digital Marketing Insights',
        description: 'Stay updated with the latest trends, tips, and strategies in digital marketing.',
        isBreadcrumb: true
      },
      mainContent: {
        rows: [{
          _type: 'row',
          rowTitle: 'Blog Content',
          rowType: 'standard',
          backgroundColor: 'none',
          columns: 1,
          showColumn1: true,
          column1: [{
            _type: 'richText',
            content: [{
              _type: 'block',
              children: [{
                _type: 'span',
                text: 'Explore our collection of articles covering digital marketing strategies, web development tutorials, and industry insights.'
              }]
            }]
          }]
        }]
      },
      include_in_sitemap: true,
      noIndex: false
    },
    {
      _type: 'page',
      _id: 'page-privacy',
      title: 'Privacy Policy',
      slug: { current: 'privacy-policy' },
      heroSection: {
        visible: true,
        backgroundType: 'color',
        heroText: 'Privacy Policy',
        subheader: 'Your Privacy Matters',
        description: 'Learn how we collect, use, and protect your personal information.',
        isBreadcrumb: true
      },
      mainContent: {
        rows: [{
          _type: 'row',
          rowTitle: 'Privacy Policy Content',
          rowType: 'standard',
          backgroundColor: 'none',
          columns: 1,
          showColumn1: true,
          column1: [{
            _type: 'richText',
            content: [{
              _type: 'block',
              children: [{
                _type: 'span',
                text: 'At Agency Pro, we are committed to protecting your privacy and ensuring the security of your personal information.'
              }]
            }]
          }]
        }]
      },
      include_in_sitemap: true,
      noIndex: false
    },
    {
      _type: 'page',
      _id: 'page-terms',
      title: 'Terms of Service',
      slug: { current: 'terms-of-service' },
      heroSection: {
        visible: true,
        backgroundType: 'color',
        heroText: 'Terms of Service',
        subheader: 'Service Agreement',
        description: 'Please read our terms of service carefully before using our services.',
        isBreadcrumb: true
      },
      mainContent: {
        rows: [{
          _type: 'row',
          rowTitle: 'Terms Content',
          rowType: 'standard',
          backgroundColor: 'none',
          columns: 1,
          showColumn1: true,
          column1: [{
            _type: 'richText',
            content: [{
              _type: 'block',
              children: [{
                _type: 'span',
                text: 'These terms of service govern your use of Agency Pro services and website.'
              }]
            }]
          }]
        }]
      },
      include_in_sitemap: true,
      noIndex: false
    }
  ],

  // Navigation Menu
  navigationMenu: () => ({
    _type: 'navigationMenu',
    _id: 'sample-main-navigation',
    title: 'Sample Main Navigation',
    slug: { current: 'sample-main-navigation' },
    items: [
      {
        _type: 'navigationItem',
        text: 'Home',
        navigationItemUrl: { internalLink: { _type: 'reference', _ref: 'page-home' } }
      },
      {
        _type: 'navigationItem',
        text: 'About',
        navigationItemUrl: { internalLink: { _type: 'reference', _ref: 'page-about' } }
      },
      {
        _type: 'navigationItem',
        text: 'Services',
        navigationItemUrl: { internalLink: { _type: 'reference', _ref: 'page-services' } }
      },
      {
        _type: 'navigationItem',
        text: 'Blog',
        navigationItemUrl: { internalLink: { _type: 'reference', _ref: 'page-blog' } }
      },
      {
        _type: 'navigationItem',
        text: 'Contact',
        navigationItemUrl: { internalLink: { _type: 'reference', _ref: 'page-contact' } }
      }
    ]
  })
};

// Helper function to create readline interface
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Helper function to ask for confirmation
function askConfirmation(message) {
  return new Promise((resolve) => {
    const rl = createReadlineInterface();
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Import functions
async function importSampleData() {
  console.log('🌱 Starting sample data import...');
  console.log('⚠️  Note: If you have existing documents with the same IDs, they may be updated or cause conflicts.');
  console.log('   Consider backing up your data before proceeding.\n');
  
  try {
    // Import in order of dependencies
    const importOrder = [
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

    for (const dataType of importOrder) {
      console.log(`\n📝 Importing ${dataType}...`);
      const data = generateSampleData[dataType]();
      
      if (Array.isArray(data)) {
        for (const item of data) {
          try {
            // Check if document exists and has different _type
            const existing = await client.getDocument(item._id).catch(() => null);
            if (existing && existing._type !== item._type) {
              // Delete existing document with different _type
              await client.delete(item._id);
              console.log(`   🗑️  Removed existing ${item._id} (type mismatch)`);
            }
            await client.createOrReplace(item);
            console.log(`   ✅ Created ${item._id}`);
          } catch (error) {
            console.error(`   ❌ Error creating ${item._id}:`, error.message);
          }
        }
      } else {
        try {
          // Check if document exists and has different _type
          const existing = await client.getDocument(data._id).catch(() => null);
          if (existing && existing._type !== data._type) {
            // Delete existing document with different _type
            await client.delete(data._id);
            console.log(`   🗑️  Removed existing ${data._id} (type mismatch)`);
          }
          await client.createOrReplace(data);
          console.log(`   ✅ Created ${data._id}`);
        } catch (error) {
          console.error(`   ❌ Error creating ${data._id}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Sample data import completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   • 1 Site Settings');
    console.log('   • 3 Blog Authors');
    console.log('   • 4 Categories');
    console.log('   • 6 Tags');
    console.log('   • 3 FAQ Categories');
    console.log('   • 7 Pages');
    console.log('   • 1 Navigation Menu');
    console.log('   • 3 Blog Posts');
    console.log('   • 2 Events');
    console.log('   • 1 News Article');
    console.log('   • 3 FAQs');
    
  } catch (error) {
    console.error('❌ Error importing sample data:', error);
    process.exit(1);
  }
}

// Remove functions
async function removeSampleData() {
  console.log('🗑️  Starting sample data removal...');
  
  const dataTypes = {
    'Site Settings': ['siteSettings'],
    'Blog Authors': ['blogsAuthor'],
    'Categories': ['categories'], 
    'Tags': ['tags'],
    'FAQ Categories': ['faqCategories'],
    'Pages': ['page'],
    'Navigation Menus': ['navigationMenu'],
    'Blog Posts': ['blogs'],
    'Events': ['events'],
    'News': ['news'],
    'FAQs': ['faqs']
  };

  for (const [typeName, schemaTypes] of Object.entries(dataTypes)) {
    const confirmed = await askConfirmation(`Remove all ${typeName}?`);
    
    if (confirmed) {
      console.log(`\n🗑️  Removing ${typeName}...`);
      
      for (const schemaType of schemaTypes) {
        try {
          const query = `*[_type == "${schemaType}"]._id`;
          const ids = await client.fetch(query);
          
          if (ids.length > 0) {
            const transaction = client.transaction();
            ids.forEach(id => transaction.delete(id));
            await transaction.commit();
            console.log(`   ✅ Removed ${ids.length} ${typeName}`);
          } else {
            console.log(`   ℹ️  No ${typeName} found`);
          }
        } catch (error) {
          console.error(`   ❌ Error removing ${typeName}:`, error.message);
        }
      }
    } else {
      console.log(`   ⏭️  Skipped ${typeName}`);
    }
  }
  
  console.log('\n🎉 Sample data removal completed!');
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  if (command === 'import') {
    await importSampleData();
  } else if (command === 'remove') {
    await removeSampleData();
  } else {
    console.log('Usage:');
    console.log('  npm run seed:import  - Import sample data');
    console.log('  npm run seed:remove  - Remove sample data');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateSampleData, importSampleData, removeSampleData };