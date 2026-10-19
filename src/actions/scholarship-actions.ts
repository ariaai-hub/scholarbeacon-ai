"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function saveScholarshipAction(scholarshipId: string) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  await prisma.application.upsert({
    where: {
      userId_scholarshipId: { userId, scholarshipId },
    },
    create: { userId, scholarshipId, status: "SAVED" },
    update: { status: "SAVED" },
  });
}

export async function applyScholarshipAction(scholarshipId: string) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  await prisma.application.upsert({
    where: {
      userId_scholarshipId: { userId, scholarshipId },
    },
    create: { userId, scholarshipId, status: "APPLIED", appliedAt: new Date() },
    update: { status: "APPLIED", appliedAt: new Date() },
  });
}

export async function draftEssayAction(scholarshipId: string) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  // Essay generation is handled client-side via fetch
  // This server action exists for cases where we want to pre-generate server-side
  return { success: true, scholarshipId };
}
