import { useState } from 'react';
import axios from 'axios';
import { TextField, Card, Typography, Snackbar, Alert, Box } from '@mui/material';
import { useRouter } from 'next/router';
import GradientButton from '../styles/GradientButton';
import { WavyBackground } from '../components/Root/WavyBackground'; // WavyBackground コンポーネントのインポート

const PasswordResetForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/password_resets`, { email });
      setMessage(response.data.message);
      setError('');

      // 成功したらログインページにリダイレクト
      setTimeout(() => {
        router.push('/login');
      }, 2000); // 2秒後にリダイレクト
    } catch (err: any) {
      setError(err.response?.data?.error || 'パスワードリセットに失敗しました。');
      setMessage('');
    }
  };

  return (
    <WavyBackground colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22ee8f"]} waveOpacity={0.3} style={{ position: 'relative', zIndex: 1 }}>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Card style={{ padding: '20px', maxWidth: 400, width: '100%' }}>
          <Typography variant="h5" component="h2" style={{ textAlign: 'center', marginBottom: '20px' }}>
            パスワードリセット
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <GradientButton
              type="submit"
              variant="contained"
              fullWidth
              style={{ marginTop: '20px', color: '#fff' }}
            >
              送信
            </GradientButton>
          </form>
          {message && (
            <Snackbar
              open={!!message}
              autoHideDuration={6000}
              onClose={() => setMessage('')}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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

export default PasswordResetForm;
