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

    // Get invoices
    let invoices = [];
    if (subscription?.stripeCustomerId) {
      try {
        const stripeInvoices = await stripe.invoices.list({
          customer: subscription.stripeCustomerId,
          limit: 10,
        });
        invoices = stripeInvoices.data.map((inv) => ({
          id: inv.id,
          amount: inv.amount_paid,
          currency: inv.currency,
          status: inv.status,
          date: new Date(inv.created * 1000).toISOString(),
          pdf: inv.invoice_pdf,
          hostedInvoiceUrl: inv.hosted_invoice_url,
        }));
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      }
    }

    return NextResponse.json({ invoices });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
