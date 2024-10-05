import { z } from 'zod'

export const envSchema = z.object({
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  DATABASE_URL: z.string().url(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  DB_HOST: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  MINIO_USER: z.string(),
  MINIO_PASSWORD: z.string(),
  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.coerce.number().optional().default(9000),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_USE_SSL: z.coerce.boolean(),
  MINIO_BUCKET_NAME: z.string(),
})

export type Env = z.infer<typeof envSchema>