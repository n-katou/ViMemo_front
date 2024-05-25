"use client";
import axios from 'axios';
import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, TextField, Card, Typography, Snackbar, Alert, Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const router = useRouter();
  const { setAuthState, currentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.push('/mypage/dashboard');
    }
  }, [currentUser, router]);

  const validateInputs = () => {
    let valid = true;
    const errors: string[] = [];

    if (name.trim() === '') {
      errors.push('名前を入力してください。');
      valid = false;
    }
    if (email.trim() === '') {
      errors.push('メールアドレスを入力してください。');
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      errors.push('有効なメールアドレスを入力してください。');
      valid = false;
    }
    if (password.length < 3) {
      errors.push('パスワードは3文字以上で入力してください。');
      valid = false;
    }
    if (password !== passwordConfirmation) {
      errors.push('パスワードが一致しません。');
      valid = false;
    }

    setValidationErrors(errors);
    return valid;
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userData = {
        user: {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation
        }
      };
      const config = {
        headers: { 'Content-Type': 'application/json' }
      };
      const registerResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, userData, config);
      console.log('Registration successful', registerResponse.data);

      // ユーザー登録後にログインを試みる
      const loginResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`, { email, password });
      if (loginResponse.data.success) {
        localStorage.setItem('token', loginResponse.data.token);
        setAuthState({ currentUser: loginResponse.data.user, jwtToken: loginResponse.data.token });
        // フラッシュメッセージをlocalStorageに保存
        localStorage.setItem('flashMessage', '登録に成功しました');
        router.push('/mypage/dashboard');
      } else {
        setError(loginResponse.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError('登録に失敗しました。');
        if (error.response?.data.errors) {
          setValidationErrors(error.response.data.errors);
        } else {
          setError(error.response?.data.error || '登録に失敗しました。');
        }
      } else {
        setError('登録に失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setValidationErrors([]);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
      <Card style={{ padding: '20px', maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" component="h2" style={{ textAlign: 'center', marginBottom: '20px' }}>
          ユーザー登録
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="名前"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
            error={!!validationErrors.find(error => error.includes('名前'))}
            helperText={validationErrors.find(error => error.includes('名前'))}
          />
          <TextField
            label="メールアドレス"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={!!validationErrors.find(error => error.includes('メールアドレス'))}
            helperText={validationErrors.find(error => error.includes('メールアドレス'))}
          />
          <TextField
            label="パスワード"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={!!validationErrors.find(error => error.includes('パスワード'))}
            helperText={validationErrors.find(error => error.includes('パスワード'))}
          />
          <TextField
            label="パスワード確認"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={passwordConfirmation}
            onChange={e => setPasswordConfirmation(e.target.value)}
            error={!!validationErrors.find(error => error.includes('パスワード確認'))}
            helperText={validationErrors.find(error => error.includes('パスワード確認'))}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : '登録'}
          </Button>
        </form>
      </Card>
      <Snackbar open={!!error || validationErrors.length > 0} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
          <ul>
            {validationErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RegisterPage;
