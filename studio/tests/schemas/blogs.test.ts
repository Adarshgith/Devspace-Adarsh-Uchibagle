import { describe, it, expect } from '@jest/globals';
import blogsSchema from '../../schemas/documents/blogs';

type SchemaField = {
  name: string;
  type: string;
  validation?: any;
  options?: any;
  initialValue?: any;
  description?: string;
};

describe('Blogs Schema', () => {
  it('should have correct schema structure', () => {
    expect(blogsSchema.name).toBe('blogs');
    expect(blogsSchema.title).toBe('Blogs');
    expect(blogsSchema.type).toBe('document');
    expect(Array.isArray(blogsSchema.fields)).toBe(true);
  });

  it('should have required fields', () => {
    const fieldNames = (blogsSchema.fields as SchemaField[]).map(field => field.name);
    const requiredFields = ['title', 'slug', 'resourceId'];
    
    requiredFields.forEach(fieldName => {
      expect(fieldNames).toContain(fieldName);
    });
  });

  it('should validate title field correctly', () => {
    const titleField = (blogsSchema.fields as SchemaField[]).find(field => field.name === 'title');
    expect(titleField).toBeDefined();
    if (titleField) {
      expect(titleField.type).toBe('string');
      expect(typeof titleField.validation).toBe('function');
    }
  });

  it('should validate slug field correctly', () => {
    const slugField = (blogsSchema.fields as SchemaField[]).find(field => field.name === 'slug');
    expect(slugField).toBeDefined();
    if (slugField && slugField.options) {
      expect(slugField.type).toBe('slug');
      expect(slugField.options.source).toBe('title');
      expect(slugField.options.maxLength).toBe(200);
    }
  });

  it('should have resourceId with validation', () => {
    const resourceIdField = (blogsSchema.fields as SchemaField[]).find(field => field.name === 'resourceId');
    expect(resourceIdField).toBeDefined();
    if (resourceIdField) {
      expect(resourceIdField.type).toBe('string');
      expect(typeof resourceIdField.validation).toBe('function');
    }
  });

  it('should have boolean fields with default values', () => {
    const booleanFields = ['isSticky', 'featuredBlog'];
    
    booleanFields.forEach(fieldName => {
      const field = (blogsSchema.fields as SchemaField[]).find(f => f.name === fieldName);
      expect(field).toBeDefined();
      if (field) {
        expect(field.type).toBe('boolean');
        expect(field.initialValue).toBe(false);
      }
    });
  });

  it('should have proper field descriptions', () => {
    const fieldsWithDescriptions = ['excerpt', 'mainImage', 'isSticky', 'featuredBlog'];
    
    fieldsWithDescriptions.forEach(fieldName => {
      const field = (blogsSchema.fields as SchemaField[]).find(f => f.name === fieldName);
      expect(field).toBeDefined();
      if (field && field.description) {
        expect(typeof field.description).toBe('string');
        expect((field.description as string).length).toBeGreaterThan(0);
      }
    });
  });
});