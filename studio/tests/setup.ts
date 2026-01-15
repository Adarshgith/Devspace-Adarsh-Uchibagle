// Jest setup file
import { jest } from '@jest/globals';

// Mock Sanity client for testing
jest.mock('@sanity/client', () => ({
  createClient: jest.fn(() => ({
    fetch: jest.fn(),
    create: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    getDocument: jest.fn(),
    transaction: jest.fn(() => ({
      create: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      commit: jest.fn()
    }))
  }))
}));

// Mock Sanity types
jest.mock('sanity', () => ({
  defineField: jest.fn((field) => field),
  defineType: jest.fn((type) => type),
  createClient: jest.fn()
}));

// Global test utilities
(global as any).mockSanityDocument = (overrides = {}) => ({
  _id: 'test-id',
  _type: 'test-type',
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
  _rev: 'test-rev',
  ...overrides
});

// Console error suppression for expected validation errors
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('validation') || args[0]?.includes?.('required')) {
    return; // Suppress expected validation errors in tests
  }
  originalError.apply(console, args);
};