import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { TextField, Button, Card, Typography, Snackbar, Alert, Box } from '@mui/material';

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
      router.push('/login'); // リセット後にログインページにリダイレクト
    } catch (err: any) {
      setError(err.response?.data?.error || 'パスワードリセットに失敗しました。');
      setMessage('');
    }
  };

  if (!isTokenValid) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
        <Typography variant="h5" component="h2" style={{ textAlign: 'center' }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
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
          <Snackbar open={!!message} autoHideDuration={6000} onClose={() => setMessage('')}>
            <Alert onClose={() => setMessage('')} severity="success" sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>
        )}
        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
            <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </Card>
    </Box>
  );
};

export default PasswordReset;
