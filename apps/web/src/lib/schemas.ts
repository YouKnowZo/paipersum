import { z } from 'zod'

export const Clause = z.object({
  title: z.string(),
  summary: z.string(),
  risk: z.enum(['green', 'yellow', 'red']),
  citation: z.string(),
  impact: z.string().optional()
})

export const Recommendation = z.object({
  decision: z.enum(['sign', 'negotiate', 'walk_away']),
  confidence: z.number(),
  reasoning: z.string(),
  action_items: z.array(z.string()),
  cost_impact: z.number()
})

export const Benchmark = z.object({
  metric: z.string(),
  your_value: z.string(),
  average_value: z.string(),
  percentile: z.number(),
  is_good: z.boolean()
})

export const NegotiationPoint = z.object({
  clause_title: z.string(),
  current_term: z.string(),
  suggested_term: z.string(),
  success_rate: z.number(),
  email_template: z.string(),
  importance: z.string()
})

export const CostScenario = z.object({
  name: z.string(),
  cost: z.number(),
  description: z.string(),
  is_best: z.boolean(),
  warning: z.string().optional()
})

export const EnhancedAnalysis = z.object({
  risk_score: z.number().int().min(0).max(100),
  clauses: z.array(Clause),
  confidence: z.number().min(0).max(1),
  recommendation: Recommendation,
  benchmarks: z.array(Benchmark),
  negotiation_points: z.array(NegotiationPoint),
  cost_scenarios: z.array(CostScenario),
  share_url: z.string().optional(),
  share_image_url: z.string().optional()
})

export type ClauseT = z.infer<typeof Clause>
export type RecommendationT = z.infer<typeof Recommendation>
export type BenchmarkT = z.infer<typeof Benchmark>
export type NegotiationPointT = z.infer<typeof NegotiationPoint>
export type CostScenarioT = z.infer<typeof CostScenario>
export type EnhancedAnalysisT = z.infer<typeof EnhancedAnalysis>

// Alias for backward compatibility
export type AnalysisT = EnhancedAnalysisT
