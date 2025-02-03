import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Soft delete the user
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        isDeleted: true,
        // Invalidate the email to allow reuse
        email: `deleted_${session.user.id}_${new Date().getTime()}@deleted.com`,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
