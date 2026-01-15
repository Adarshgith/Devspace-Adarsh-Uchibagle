import { defineCliConfig } from '@sanity/cli'

const SANITY_STUDIO_PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID;
const SANITY_STUDIO_API_DATASET = process.env.SANITY_STUDIO_API_DATASET || 'production';

export default defineCliConfig({
  api: {
    projectId: SANITY_STUDIO_PROJECT_ID,
    dataset: SANITY_STUDIO_API_DATASET
  }
})
