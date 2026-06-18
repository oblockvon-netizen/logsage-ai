import { z } from "zod";

export const emailSchema = z.string().trim().email("Enter a valid email address");
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(128, "Password must be 128 characters or less");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: emailSchema,
    password: passwordSchema.min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password")
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const profileSettingsSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(80, "Full name must be 80 characters or less"),
  email: emailSchema,
  jobTitle: z.string().trim().max(80, "Job title must be 80 characters or less").optional()
});

export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;

export const uploadFileSchema = z
  .custom<File>((value) => typeof File !== "undefined" && value instanceof File, "Select a valid file")
  .refine((file) => [".log", ".txt", ".csv"].some((extension) => file.name.toLowerCase().endsWith(extension)), {
    message: "Upload .log, .txt, or .csv files only"
  })
  .refine((file) => file.size > 0, { message: "Uploaded file cannot be empty" })
  .refine((file) => file.size <= 10 * 1024 * 1024, { message: "Maximum file size is 10 MB" });

export const threatFilterSchema = z.object({
  query: z.string().trim().max(120, "Search must be 120 characters or less"),
  severity: z.enum(["all", "critical", "high", "medium", "low"]),
  type: z.string().trim().max(80, "Threat type filter is too long")
});
