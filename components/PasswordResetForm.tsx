import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Card, Typography, Snackbar, Alert, Box } from '@mui/material';
import { useRouter } from 'next/router';

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
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
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
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
          >
            <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </Card>
    </Box>
  );
};

export default PasswordResetForm;
