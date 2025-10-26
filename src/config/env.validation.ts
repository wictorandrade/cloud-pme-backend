import Joi from 'joi';

export const envSchema: Joi.ObjectSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),

  PORT: Joi.number().default(5000),
  COOKIE_SECRET: Joi.string().required(),

  //POSTGRES
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(54444),
  DATABASE_URL: Joi.string().required(),

  //GOOGLE
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),

  //AWS/MINIO
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_S3_BUCKET: Joi.string().required(),
  AWS_S3_ENDPOINT: Joi.string().uri().required(),
  AWS_S3_TEMP_FOLDER: Joi.string().default('tmp'),

  //BULLMQ COMMON
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  REDIS_DB: Joi.number().default(0),

  //BULLMQ
  REDIS_BULLMQ_HOST: Joi.string().required(),
  REDIS_BULLMQ_PORT: Joi.number().default(6379),
  REDIS_BULLMQ_PASSWORD: Joi.string().allow('').optional(),
  REDIS_BULLMQ_DB: Joi.number().default(1),
});
