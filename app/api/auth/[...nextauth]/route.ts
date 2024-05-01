import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/Prisma";
import bcrypt from "bcrypt";
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "secret_for_local_development", // ローカル開発用のデフォルト値
  // adapter: PrismaAdapter(prisma),
  providers: [
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Username", type: "text" },
    //     password: { label: "Password", type: "password" }
    //   },
    //   async authorize(credentials) {
    //     if (!credentials) return null;
    //     const { email, password } = credentials;
    //     try {
    //       const user = await prisma.user.findUnique({
    //         where: { email }
    //       });
    //       if (user && user.cryptedPassword && await bcrypt.compare(password, user.cryptedPassword)) {
    //         return user;
    //       }
    //     } catch (error) {
    //       console.error('Authentication error:', error);
    //       return null;
    //     }
    //     return null;
    //   },
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID || "default_github_client_id",
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET || "default_github_client_secret"
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string, // 'as string' で TypeScript に string 型であることを強制
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  // callbacks: {
  //   // async signIn({ user, account, profile }) {
  //   //   if (account && account.provider === "google") {
  //   //     const res = await fetch("https://vimemo.fly.dev/api/auth", {
  //   //       method: "POST",
  //   //       headers: {
  //   //         "Content-Type": "application/json"
  //   //       },
  //   //       body: JSON.stringify({
  //   //         email: user.email,
  //   //         token: account.access_token
  //   //       })
  //   //     });
  //   //     return res.ok;
  //   //   }
  //   //   return true;
  //   // },
  //   // async redirect({ url, baseUrl }) {
  //   //   return url.startsWith(baseUrl) ? url : baseUrl;
  //   // },
  // },
  callbacks: {
    async signIn({ user, account }) {
      const provider = account?.provider;
      const uid = user?.id;
      try {
        const response = await axios.post(
          `${apiUrl}/oauth/callback`,
          {
            provider,
            uid,
          }
        );
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log('エラー', error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
