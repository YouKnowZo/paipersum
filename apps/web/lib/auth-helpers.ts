import { auth } from "@/lib/auth";
import { prisma } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: {
        where: {
          status: "active",
        },
        take: 1,
      },
    },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }
  return user;
}

export async function requirePro() {
  const user = await requireAuth();
  const subscription = user.subscriptions[0];
  
  if (!subscription || subscription.plan === "free") {
    redirect("/pricing");
  }
  
  return { user, subscription };
}

export function getPlanLimits(plan: string) {
  switch (plan) {
    case "free":
      return {
        documentsPerMonth: 30,
        apiCallsPerMonth: 0,
        exportEnabled: false,
      };
    case "pro_monthly":
    case "pro_annual":
      return {
        documentsPerMonth: Infinity,
        apiCallsPerMonth: 10000,
        exportEnabled: true,
      };
    case "enterprise":
      return {
        documentsPerMonth: Infinity,
        apiCallsPerMonth: Infinity,
        exportEnabled: true,
      };
    default:
      return getPlanLimits("free");
  }
}
