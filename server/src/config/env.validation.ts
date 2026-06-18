type Environment = Record<string, string | undefined>;

type ValidatedEnvironment = {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  OPENAI_API_KEY?: string;
  MAX_UPLOAD_SIZE_MB: number;
  UPLOAD_DIR: string;
};

export function validateEnvironment(config: Environment): ValidatedEnvironment {
  const missing: string[] = [];
  const requireValue = (key: string) => {
    const value = config[key];
    if (!value || value.trim().length === 0) {
      missing.push(key);
      return "";
    }
    return value;
  };

  const databaseUrl = requireValue("DATABASE_URL");
  const jwtSecret = requireValue("JWT_SECRET");

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://")) {
    throw new Error("DATABASE_URL must be a PostgreSQL connection string.");
  }

  if (jwtSecret.length < 16) {
    throw new Error("JWT_SECRET must be at least 16 characters long.");
  }

  return {
    PORT: parseNumber(config.PORT, 4000, "PORT"),
    NODE_ENV: config.NODE_ENV ?? "development",
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: config.JWT_EXPIRES_IN ?? "7d",
    CORS_ORIGIN: config.CORS_ORIGIN ?? config.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    OPENAI_API_KEY: config.OPENAI_API_KEY,
    MAX_UPLOAD_SIZE_MB: parseNumber(config.MAX_UPLOAD_SIZE_MB, 10, "MAX_UPLOAD_SIZE_MB"),
    UPLOAD_DIR: config.UPLOAD_DIR ?? "uploads"
  };
}

function parseNumber(value: string | undefined, fallback: number, key: string) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive number.`);
  }

  return parsed;
}
