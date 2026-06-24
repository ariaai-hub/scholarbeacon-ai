import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/profile/patch
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const existing = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Profile not found. Use POST to create." }, { status: 404 });
  }

  const profile = await prisma.studentProfile.update({
    where: { userId },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: body as any,
  });

  return NextResponse.json(profile);
}
