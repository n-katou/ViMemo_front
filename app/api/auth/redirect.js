import { useEffect } from 'react';

export default function RedirectPage({ success }) {
  useEffect(() => {
    if (success) {
      window.location.href = '/'; // ダッシュボードまたは成功ページへリダイレクト
    } else {
      window.location.href = '/signin'; // ログインページへリダイレクト
    }
  }, [success]);

  return <p>認証を処理しています...</p>;
}

export async function getServerSideProps(context) {
  const { query } = context;
  const code = query.code; // URLからcodeパラメータを取得

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oauth/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code })
  });

  if (!response.ok) {
    return {
      props: {
        success: false
      }
    };
  }

  return {
    props: {
      success: true
    }
  };
}