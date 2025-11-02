import Stripe from "stripe";
import { env } from "@/lib/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

export const STRIPE_PLANS = {
  free: {
    priceId: null,
    name: "Free",
    price: 0,
    documentsPerMonth: 30,
    apiCallsPerMonth: 0,
    exportEnabled: false,
  },
  pro_monthly: {
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_pro_monthly",
    name: "Pro Monthly",
    price: 2000, // $20.00
    documentsPerMonth: Infinity,
    apiCallsPerMonth: 10000,
    exportEnabled: true,
  },
  pro_annual: {
    priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "price_pro_annual",
    name: "Pro Annual",
    price: 20000, // $200.00 (save $40/year)
    documentsPerMonth: Infinity,
    apiCallsPerMonth: 10000,
    exportEnabled: true,
  },
  enterprise: {
    priceId: null,
    name: "Enterprise",
    price: 0,
    documentsPerMonth: Infinity,
    apiCallsPerMonth: Infinity,
    exportEnabled: true,
  },
} as const;

export type PlanId = keyof typeof STRIPE_PLANS;
