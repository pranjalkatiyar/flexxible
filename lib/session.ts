import { createUser, getUser } from "./actions";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { SessionInterface, UserProfile } from "@/common.types";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    // GithubProvider({
    //     clientId: process.env.NEXT_PUBLIC_GITHUB_ID!,
    //     clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET!,
    // }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: "grafbase",
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        },
        secret
      );
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;

      return decodedToken;
    },
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.png",
  },
  callbacks: {
    async session({ session }) {
      // merge the user with its details or pprojects
      const email = session?.user?.email as string;

      try {
        const data = (await getUser(email)) as { user?: UserProfile };

        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data?.user,
          },
        };
        return newSession;
      } catch (error) {
        console.log("Error retrieving user data", error);
        return session;
      }
    },
    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        // user exist
        const userExist = (await getUser(user?.email as string)) as {
          user?: UserProfile;
        };

        if (!userExist.user) {
          // create user
          await createUser(
            user?.name as string,
            user?.email as string,
            user?.image as string
          );
        }
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
} satisfies NextAuthOptions;

export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as SessionInterface;

  return session;
}
