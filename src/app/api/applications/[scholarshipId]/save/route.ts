import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ scholarshipId: string }>;
}

// POST /api/applications/[scholarshipId]/save
export async function POST(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { scholarshipId } = await params;

  const scholarship = await prisma.scholarship.findUnique({
    where: { id: scholarshipId },
  });

  if (!scholarship) {
    return NextResponse.json({ error: "Scholarship not found" }, { status: 404 });
  }

  const application = await prisma.application.upsert({
    where: {
      userId_scholarshipId: {
        userId,
        scholarshipId,
      },
    },
    create: {
      userId,
      scholarshipId,
      status: "SAVED",
    },
    update: {
      status: "SAVED",
    },
    include: { scholarship: true },
  });

  return NextResponse.json(application);
}
