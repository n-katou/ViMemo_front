import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "secret_for_local_development", // ローカル開発用のデフォルト値
  providers: [
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
  callbacks: {
    async signIn({ user, account }) {
      const email = user?.email;
      const provider = account?.provider;
      const uid = user?.id;
      try {
        const response = await axios.post(
          `${apiUrl}/oauth/callback`,
          {
            provider,
            uid,
            email
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
