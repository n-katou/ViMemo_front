"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Skeleton from '@mui/material/Skeleton';

export default function Home() {
  const { data: session, status } = useSession();

  // ユーザー情報の表示内容を決定
  const displayUserInfo = () => {
    if (status === "loading") {
      return <Skeleton variant="text" animation="wave" width={175} height={25} />;
    } else if (session?.user) {
      // ユーザー名またはメールアドレスを表示
      const userNameOrEmail = session.user.name || session.user.email || "未知のユーザー";
      return <p className="font-bold">{userNameOrEmail}</p>;
    }
    return <p className="font-bold">未ログイン</p>;
  };

  return (
    <>
      <div className="flex items-center flex-col">
        <h1 className="text-3xl m-10 font-bold">Next Auth</h1>
        <div className="flex items-center flex-col m-5">
          <div className="m-2">ログイン中のユーザー:</div>
          {displayUserInfo()}
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-500 py-2 px-3 text-xs text-white rounded-lg"
        >
          サインアウトする
        </button>
      </div>
    </>
  );
}
