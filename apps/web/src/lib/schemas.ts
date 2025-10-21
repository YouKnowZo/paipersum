import { z } from 'zod'

export const Clause = z.object({
  title: z.string(),
  summary: z.string(),
  risk: z.enum(['green', 'yellow', 'red']),
  citation: z.string()
})

export const Analysis = z.object({
  risk_score: z.number().int().min(0).max(100),
  clauses: z.array(Clause),
  confidence: z.number().min(0).max(1)
})

export const User = z.object({
  id: z.string(),
  email: z.string().email(),
  created_at: z.string()
})

export const Document = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  mime_type: z.string(),
  created_at: z.string(),
  analysis: Analysis.optional()
})

export const AuthResponse = z.object({
  token: z.string(),
  user: User
})

export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const RegisterRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ClauseT = z.infer<typeof Clause>
export type AnalysisT = z.infer<typeof Analysis>
export type UserT = z.infer<typeof User>
export type DocumentT = z.infer<typeof Document>
export type AuthResponseT = z.infer<typeof AuthResponse>
export type LoginRequestT = z.infer<typeof LoginRequest>
export type RegisterRequestT = z.infer<typeof RegisterRequest>