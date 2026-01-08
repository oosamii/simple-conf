// API Response types
export interface HealthResponse {
  status: 'ok' | 'error';
}

// Entity types
export * from './user.js';
export * from './folder.js';
export * from './document.js';
export * from './api.js';
export * from './comments.js'