import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { TextField, Button, Card, Typography, Snackbar, Alert, Box } from '@mui/material';
import { WavyBackground } from '../../../components/Root/WavyBackground'; // WavyBackground コンポーネントのインポート

const PasswordReset = () => {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/password_resets/${token}/edit`)
        .then((response) => {
          setIsTokenValid(true);
        })
        .catch((error) => {
          setIsTokenValid(false);
          setError('無効なトークンです');
        });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/password_resets/${token}`, {
        user: {
          password: password,
          password_confirmation: passwordConfirmation,
        },
      });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => {
        router.push('/login'); // リセット後にログインページにリダイレクト
      }, 3000); // 3秒後にリダイレクト
    } catch (err: any) {
      setError(err.response?.data?.error || 'パスワードリセットに失敗しました。');
      setMessage('');
    }
  };

  if (!isTokenValid) {
    return (
      <WavyBackground colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22ee8f"]} waveOpacity={0.3} style={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography variant="h5" component="h2" style={{ textAlign: 'center' }}>
            {error}
          </Typography>
        </Box>
      </WavyBackground>
    );
  }

  return (
    <WavyBackground colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22ee8f"]} waveOpacity={0.3} style={{ position: 'relative', zIndex: 1 }}>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Card style={{ padding: '20px', maxWidth: 400, width: '100%' }}>
          <Typography variant="h5" component="h2" style={{ textAlign: 'center', marginBottom: '20px' }}>
            パスワードリセット
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="新しいパスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="新しいパスワード確認"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '20px', backgroundColor: '#4CA', color: '#fff' }}
            >
              送信
            </Button>
          </form>
          {message && (
            <Snackbar
              open={!!message}
              autoHideDuration={6000}
              onClose={() => setMessage('')}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 画面中央上部に表示
              sx={{ marginTop: '84px', zIndex: 1400 }} // マージンを追加して位置調整
            >
              <Alert onClose={() => setMessage('')} severity="success" sx={{ width: '100%' }}>
                {message}
              </Alert>
            </Snackbar>
          )}
          {error && (
            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={() => setError('')}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 画面中央上部に表示
              sx={{ marginTop: '84px', zIndex: 1400 }} // マージンを追加して位置調整
            >
              <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>
          )}
        </Card>
      </Box>
    </WavyBackground>
  );
};

export default PasswordReset;
