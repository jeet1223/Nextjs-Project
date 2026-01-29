/**
 * Environment variable validation
 * This file ensures all required environment variables are present at startup
 */

interface EnvConfig {
  JWT_SECRET: string;
  DATABASE_URL: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

function validateEnv(): EnvConfig {
  const errors: string[] = [];

  // Required environment variables
  const requiredVars = [
    'JWT_SECRET',
    'DATABASE_URL',
    'DB_HOST',
    'DB_USER',
    'DB_NAME'
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  }

  if (process.env.JWT_SECRET === 'supersecret') {
    errors.push('JWT_SECRET cannot be the default value "supersecret"');
  }

  if (errors.length > 0) {
    console.error('Environment validation failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    throw new Error('Environment validation failed. Please check your .env file.');
  }

  return {
    JWT_SECRET: process.env.JWT_SECRET!,
    DATABASE_URL: process.env.DATABASE_URL!,
    DB_HOST: process.env.DB_HOST!,
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME!,
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  };
}

// Validate on module load
export const env = validateEnv();

// Export individual variables for convenience
export const { JWT_SECRET, DATABASE_URL, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } = env;
