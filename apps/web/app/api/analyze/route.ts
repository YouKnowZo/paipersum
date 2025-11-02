import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/auth";
import { analyzeText, analyzeFile } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;
    const docType = (formData.get("docType") as string) || "general";

    if (!file && !text) {
      return NextResponse.json(
        { error: "File or text required" },
        { status: 400 }
      );
    }

    let analysisResult;
    let content = "";

    if (file) {
      // Validate file
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/png",
        "image/jpeg",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type" },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "File too large (max 10MB)" },
          { status: 400 }
        );
      }

      // Analyze file
      analysisResult = await analyzeFile(file);

      // Read file content for storage
      const buffer = await file.arrayBuffer();
      content = Buffer.from(buffer).toString("base64");
    } else if (text) {
      if (text.length > 500000) {
        return NextResponse.json(
          { error: "Text too long (max 500KB)" },
          { status: 400 }
        );
      }

      analysisResult = await analyzeText(text, docType);
      content = text;
    }

    // Check usage limits
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "active",
      },
    });

    const plan = subscription?.plan || "free";
    const limits = getPlanLimits(plan);

    // Count documents this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const docsThisMonth = await prisma.usageRecord.count({
      where: {
        userId: user.id,
        type: "analysis",
        date: {
          gte: startOfMonth,
        },
      },
    });

    if (docsThisMonth >= limits.documentsPerMonth) {
      return NextResponse.json(
        { error: "Monthly limit reached. Upgrade to Pro for unlimited analyses." },
        { status: 403 }
      );
    }

    // Save document
    const document = await prisma.document.create({
      data: {
        userId: user.id,
        name: file?.name || "Text Document",
        type: file?.type || "text",
        content: content.substring(0, 10000), // Store first 10KB
        analysis: analysisResult as any,
        fileName: file?.name,
        fileSize: file?.size,
        mimeType: file?.type,
      },
    });

    // Record usage
    await prisma.usageRecord.create({
      data: {
        userId: user.id,
        documentId: document.id,
        type: "analysis",
        count: 1,
      },
    });

    return NextResponse.json({
      document: {
        id: document.id,
        name: document.name,
        analysis: analysisResult,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}

function getPlanLimits(plan: string) {
  switch (plan) {
    case "free":
      return { documentsPerMonth: 30 };
    case "pro_monthly":
    case "pro_annual":
      return { documentsPerMonth: Infinity };
    case "enterprise":
      return { documentsPerMonth: Infinity };
    default:
      return { documentsPerMonth: 30 };
  }
}
