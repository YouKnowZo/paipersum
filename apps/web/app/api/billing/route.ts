import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "active",
      },
    });

    // Get usage this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const usage = await prisma.usageRecord.aggregate({
      where: {
        userId: user.id,
        date: {
          gte: startOfMonth,
        },
      },
      _sum: {
        count: true,
      },
    });

    // Get customer portal URL
    let portalUrl = null;
    if (subscription?.stripeCustomerId) {
      try {
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: subscription.stripeCustomerId,
          return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
        });
        portalUrl = portalSession.url;
      } catch (error) {
        console.error("Failed to create portal session:", error);
      }
    }

    return NextResponse.json({
      subscription: subscription
        ? {
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          }
        : null,
      usage: {
        documentsThisMonth: usage._sum.count || 0,
      },
      portalUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch billing info" },
      { status: 500 }
    );
  }
}
