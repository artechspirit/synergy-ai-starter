import { z } from "zod";

// Base schema placeholders for SajiAI
export const UserRoleSchema = z.enum(["GUEST", "STAFF", "MERCHANT", "ADMIN"]);

export const LoginInputSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Nama tenant wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
});
