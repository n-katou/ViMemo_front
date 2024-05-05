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
    maxAge: 30 * 24 * 60 * 60,
  },
  // callbacks: {
  //   async signIn({ user, account }) {
  //     if (account && account.provider === "google") {
  //       const url = `${apiUrl}/oauth/callback?provider=google`;
  //       try {
  //         const response = await axios.post(url, {
  //           provider: account.provider,
  //           accessToken: account.accessToken,
  //           refreshToken: account.refreshToken,
  //           user
  //         }, {
  //           withCredentials: true  // クッキーを含める設定
  //         });
  //         if (response.status === 200) {
  //           console.log('Logged in successfully');
  //           return true;  // NextAuthのセッションを設定
  //         }
  //       } catch (error) {
  //         if (error instanceof AxiosError) {
  //           console.error('エラーステータス: ', error.response?.status);
  //           console.error('エラーレスポンス: ', error.response?.data);
  //         } else {
  //           console.error('未知のエラー: ', error);
  //         }
  //         return false;
  //       }
  //     }
  //     return false;
  //   },
  // },
  callbacks: {
    async jwt({ token, user, account }) {
      // アカウントとユーザー情報が存在する場合に処理
      if (account && user) {
        // `accessToken`と`refreshToken`が正しく存在するか確認してから割り当てる
        if (typeof account.accessToken === 'string') {
          token.accessToken = account.accessToken;
        }
        if (typeof account.refreshToken === 'string') {
          token.refreshToken = account.refreshToken;
        }
        // バックエンドに必要な情報をPOST
        try {
          const response = await axios.post(`${apiUrl}/oauth/callback`, {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            user
          }, { withCredentials: true });
          // レスポンスから得られたセッションIDをトークンに保存
          if (response.data.sessionId) {
            token.backendSessionId = response.data.sessionId;
          }
        } catch (error) {
          console.error("Error posting to backend:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにアクセストークン、リフレッシュトークン、バックエンドセッションIDを反映
      if (token.accessToken) {
        session.user.accessToken = token.accessToken;
      }
      if (token.refreshToken) {
        session.user.refreshToken = token.refreshToken;
      }
      if (token.backendSessionId) {
        session.user.backendSessionId = token.backendSessionId;
      }
      return session;
    },
  }
});

export { handler as GET, handler as POST };
