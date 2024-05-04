export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // ここでバックエンドのログアウトAPIを呼び出す
      const backendRes = await fetch('https://vimemo.fly.dev//logout', {
        method: 'DELETE', // バックエンドの要求に合わせてメソッドを変更
        headers: {
          'Content-Type': 'application/json',
          // 必要に応じて認証トークンなどを送る
        },
        // credentials: 'include' // クッキーを使う場合
      });
      if (!backendRes.ok) throw new Error('Failed to log out');

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to log out' });
    }
  } else {
    // POSTメソッド以外のリクエストを拒否
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
