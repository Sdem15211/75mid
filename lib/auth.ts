import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import prisma from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      // Check if user exists and is deleted
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: user.email! },
            {
              email: { startsWith: `deleted_` },
              isDeleted: true,
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!dbUser) {
        return true; // New user, allow sign in
      }

      if (dbUser.isDeleted) {
        // Restore the account
        await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            email: user.email!,
            isDeleted: false,
          },
        });
      }

      return true;
    },
  },
});
