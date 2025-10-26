const cookieNamePrefix = process.env.COOKIE_NAME_PREFIX || 'ecoa';

export function configuration() {
  return {
    nodeEnv: process.env.NODE_ENV,
    isDev: process.env.NODE_ENV == 'development',
    port: process.env.PORT,
    corsOrigin: String(process.env.CORS_ORIGIN).split(','),
    database: { url: process.env.DATABASE_URL },
    cookie: {
      domain: process.env.COOKIE_DOMAIN,
      secure: process.env.COOKIE_SECURE === 'true',
      expiresIn: process.env.COOKIE_EXPIRATION,
      secret: process.env.COOKIE_SECRET,
    },
    jwt: {
      keys: {
        jwtAlgorithm: process.env.JWT_ALGORITHM,
      },
      refresh: {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        cookieName: `${cookieNamePrefix}_refresh_token`,
      },
      access: {
        expiresIn: process.env.JWT_ACESS_EXPIRATION,
        cookieName: `${cookieNamePrefix}_access_token`,
      },
    },
    postgres: {
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      db: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      url: process.env.DATABASE_URL,
    },
    google: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
      },
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    redis: {
      common: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DB,
      },
      bullmq: {
        host: process.env.REDIS_BULLMQ_HOST,
        port: process.env.REDIS_BULLMQ_PORT,
        password: process.env.REDIS_BULLMQ_PASSWORD,
        db: process.env.REDIS_BULLMQ_DB,
      },
    },
    aws: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      s3: {
        tempFolder: process.env.AWS_S3_TEMP_FOLDER,
        bucket: process.env.AWS_S3_BUCKET,
        endpoint: process.env.AWS_S3_ENDPOINT,
      },
    },
  };
}
