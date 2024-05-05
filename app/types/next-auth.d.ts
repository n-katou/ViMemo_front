// types/next-auth.d.ts
import 'next-auth';
import { JWT as NextAuthJWT, User as NextAuthUser, Session as NextAuthSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * User オブジェクトの型定義を拡張します。
   */
  interface User extends NextAuthUser {
    accessToken?: string;
    refreshToken?: string;
    backendSessionId?: string;
  }

  /**
   * Session オブジェクトの型定義を拡張します。
   */
  interface Session extends NextAuthSession {
    user: {
      accessToken?: string;
      refreshToken?: string;
      backendSessionId?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module 'next-auth/jwt' {
  /** JWT トークンの型定義を拡張します */
  interface JWT extends NextAuthJWT {
    accessToken?: string;
    refreshToken?: string;
    backendSessionId?: string;
  }
}
