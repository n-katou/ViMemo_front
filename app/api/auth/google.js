// pages/api/auth/google.js

export default function handler(req, res) {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const redirect_uri = "https://vimemo.vercel.app/api/auth/callback/google";  // フロントエンド側のコールバックURL
  const scope = "email profile";
  const state = "SOME_STATE_VALUE";  // この値はCSRF攻撃を防ぐためにランダムな文字列を生成してセッションに保存するべきです

  const oauth_url = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}&state=${state}&access_type=offline&prompt=consent`;

  res.redirect(oauth_url);
}
