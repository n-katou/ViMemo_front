"use client";
import Skeleton from '@mui/material/Skeleton';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import { useSession } from "next-auth/react";

export default function ClientOnlyHome() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await axios.delete(`${apiUrl}/logout`, {
        withCredentials: true // CORSでクッキーを送るために必要
      });
      if (response.status === 200) {
        await nextAuthSignOut({ redirect: false });
        router.push('/'); // ログアウト後のリダイレクト先
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const displayUserInfo = () => {
    if (status === "loading") {
      return <Skeleton variant="text" animation="wave" width={175} height={25} />;
    } else if (session?.user) { // Optional chaining (`?.`) を使用して session.user が存在するかチェック
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
          onClick={handleSignOut}  // onClick イベントを handleSignOut 関数に更新
          className="bg-red-500 py-2 px-3 text-xs text-white rounded-lg"
        >
          サインアウトする
        </button>
      </div>
    </>
  );
}
