// Organized schema imports
import { documentSchemas } from './documents'
import { fieldSchemas } from './fields'
import { objectSchemas } from './objects'

// Combine all schema types in logical order
export const schemaTypes = [
  // Document schemas (main content types)
  ...documentSchemas,
  
  // Field schemas (reusable field types)
  ...fieldSchemas,
  
  // Object schemas (complex components and objects)
  ...objectSchemas,
]
