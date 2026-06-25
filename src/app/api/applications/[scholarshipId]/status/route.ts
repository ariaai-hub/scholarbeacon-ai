import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

interface Params {
  params: Promise<{ scholarshipId: string }>;
}

const VALID_STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

// POST /api/applications/[scholarshipId]/status
export async function POST(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { scholarshipId } = await params;
  const body = await req.json();
  const { status, awardedAmount } = body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const application = await prisma.application.findUnique({
    where: {
      userId_scholarshipId: {
        userId,
        scholarshipId,
      },
    },
  });

  if (!application) {
    return NextResponse.json(
      { error: "Application not found. Save the scholarship first." },
      { status: 404 }
    );
  }

  const updated = await prisma.application.update({
    where: { id: application.id },
    data: {
      status,
      ...(status === "ACCEPTED" && awardedAmount != null
        ? { awardedAmount: Number(awardedAmount) }
        : {}),
    },
    include: { scholarship: true },
  });

  return NextResponse.json(updated);
}
