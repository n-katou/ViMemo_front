"use client";
import { useEffect } from 'react';

interface RedirectPageProps {
  success: boolean;
}

export default function RedirectPage({ success }: RedirectPageProps) {
  useEffect(() => {
    if (success) {
      window.location.href = '/'; // ダッシュボードまたは成功ページへリダイレクト
    } else {
      window.location.href = '/signin'; // ログインページへリダイレクト
    }
  }, [success]);

  return <p>認証を処理しています...</p>;
}