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

export type ClauseT = z.infer<typeof Clause>
export type AnalysisT = z.infer<typeof Analysis>
