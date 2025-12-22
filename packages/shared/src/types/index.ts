// API Response types
export interface HealthResponse {
  status: 'ok' | 'error';
}

export interface ApiError {
  message: string;
  code?: string;
}

// Entity types
export * from './user.js';
export * from './folder.js';
export * from './document.js';
