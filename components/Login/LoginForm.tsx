import React, { FormEvent, useState } from 'react';
import {
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  Box,
} from '@mui/material';
import GradientButton from '../../styles/GradientButton';
import GoogleButton from './GoogleButton';
import Link from 'next/link';

interface Props {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  loading: boolean;
  error: string;
  successMessage: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleGoogleLogin: () => void;
  setError: (value: string) => void;
  setSuccessMessage: (value: string) => void;
}

const LoginForm: React.FC<Props> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  successMessage,
  handleSubmit,
  handleGoogleLogin,
  setError,
  setSuccessMessage,
}) => {
  return (
    <Card style={{ padding: '20px', maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" component="h2" style={{ textAlign: 'center', marginBottom: '20px' }}>
        ログイン
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
        <TextField
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        <GradientButton
          type="submit"
          disabled={loading}
          variant="contained"
          fullWidth
          className="bg-gradient-rainbow"
          sx={{
            marginTop: '20px',
            color: '#fff'
          }}
        >
          {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'ログイン'}
        </GradientButton>
      </form>

      <div className="text-center mt-4">
        <Link href="/register" passHref>
          <Typography variant="body2" color="primary" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            新規登録はこちら
          </Typography>
        </Link>
      </div>

      <div className="flex justify-center mt-4">
        <GoogleButton
          onClick={handleGoogleLogin}
          loading={loading}
        />
      </div>

      <div className="text-center mt-4">
        <Link href="/password_reset" passHref>
          <Typography variant="body2" color="primary" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            パスワードを忘れた方はこちら
          </Typography>
        </Link>
      </div>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default LoginForm;
