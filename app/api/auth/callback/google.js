import axios from 'axios';

export default async function handler(req, res) {
  const code = req.query.code;
  try {
    const response = await axios.post('https://vimemo.fly.dev/oauth/callback', {
      code
    });
    // レスポンスからトークンやユーザー情報を受け取り、必要に応じて処理
    res.redirect('/dashboard');
  } catch (error) {
    console.error('認証エラー:', error);
    res.redirect('/login?error=authentication_failed');
  }
}
