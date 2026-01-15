import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import deskStructure from './deskStructure';
import SetSlugAndPublishAction from './schemas/actions/setSlugAndPublishAction';
import { structureTool } from 'sanity/structure';

// Environment variable validation
function validateEnvironmentVariables() {
  const requiredVars = {
    SANITY_STUDIO_PROJECT_ID: import.meta.env.SANITY_STUDIO_PROJECT_ID,
    SANITY_STUDIO_API_DATASET: import.meta.env.SANITY_STUDIO_API_DATASET,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.\n' +
      'Refer to .env.example for the required format.'
    );
  }

  return requiredVars;
}

// Validate and get environment variables
const envVars = validateEnvironmentVariables();
const SANITY_STUDIO_PROJECT_ID = envVars.SANITY_STUDIO_PROJECT_ID;
const SANITY_STUDIO_API_DATASET = envVars.SANITY_STUDIO_API_DATASET || 'production';

export default defineConfig({
  name: 'default',
  title: 'Competition Studio',

  projectId: SANITY_STUDIO_PROJECT_ID,
  dataset: SANITY_STUDIO_API_DATASET,

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prevActions) =>
      prevActions.map((previousAction) =>
        previousAction.action === 'publish' ? SetSlugAndPublishAction : previousAction
      ),
  },
})
