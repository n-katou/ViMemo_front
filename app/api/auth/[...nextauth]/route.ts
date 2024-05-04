import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios, { AxiosError } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "secret_for_local_development",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "your_google_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "your_google_client_secret",
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
          scope: 'openid profile email',
          access_type: 'offline',
          prompt: 'consent'
        },
      },
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
      if (account && account.provider === "google") {
        const url = `${apiUrl}/oauth/callback?provider=google`;
        try {
          const response = await axios.post(url, {
            provider: account.provider,
            accessToken: account.accessToken,
            refreshToken: account.refreshToken,
            user
          }, {
            withCredentials: true  // クッキーを含める設定
          });
          if (response.status === 200) {
            console.log('Logged in successfully');
            return true;  // NextAuthのセッションを設定
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            console.error('エラーステータス: ', error.response?.status);
            console.error('エラーレスポンス: ', error.response?.data);
          } else {
            console.error('未知のエラー: ', error);
          }
          return false;
        }
      }
      return false;
    },
  },
});

export { handler as GET, handler as POST };
