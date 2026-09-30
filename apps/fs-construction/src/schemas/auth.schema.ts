import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  role: z.enum(['client', 'admin', 'architect']),
});

export type ILoginForm = z.infer<typeof loginSchema>;
