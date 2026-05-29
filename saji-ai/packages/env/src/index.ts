import { z } from "zod";

export const ServerEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url("DATABASE_URL wajib berupa URL valid"),
  REDIS_URL: z.string().url("REDIS_URL wajib berupa URL valid").optional(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET minimal 16 karakter"),
  PORT: z.coerce.number().default(4000),
});

export const ClientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url("NEXT_PUBLIC_API_URL wajib berupa URL valid"),
});

export function validateServerEnv() {
  const parsed = ServerEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Environment Variables Server Tidak Valid:", parsed.error.format());
    process.exit(1);
  }
  return parsed.data;
}
