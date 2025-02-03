import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Find the most recently deleted account with this email
    const deletedUser = await prisma.user.findFirst({
      where: {
        email: {
          startsWith: "deleted_",
        },
        isDeleted: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!deletedUser) {
      return Response.json(
        { message: "No deleted account found" },
        { status: 404 }
      );
    }

    // Restore the user's rest days count
    await prisma.user.update({
      where: {
        id: deletedUser.id,
      },
      data: {
        email,
        isDeleted: false,
        restDaysLeft: deletedUser.restDaysLeft,
      },
    });

    return Response.json({ message: "Account restored successfully" });
  } catch (error) {
    console.error("Error restoring user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
