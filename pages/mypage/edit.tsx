import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useFlashMessage } from '../../context/FlashMessageContext';
import { CustomUser } from '../../types/user';
import { WavyBackground } from '../../components/Root/WavyBackground';
import { Box, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';

const EditProfile = () => {
  const { currentUser, jwtToken } = useAuth();
  const { setFlashMessage } = useFlashMessage();
  const router = useRouter();
  const [user, setUser] = useState<CustomUser | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser as CustomUser);
      setEmail(currentUser.email);
      setName(currentUser.name);
    }
  }, [currentUser]);

  const validateInputs = () => {
    let valid = true;
    const errors: string[] = [];

    if (name.trim() === '') {
      errors.push('名前を入力してください。');
      valid = false;
    }

    setValidationErrors(errors);
    return valid;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }

    if (!user) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('user[name]', name);
    if (avatar) {
      formData.append('user[avatar]', avatar);
    }

    try {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        setFlashMessage('プロフィールが更新されました。');
        router.push('/mypage/dashboard');
      } else {
        setFlashMessage('プロフィールの更新に失敗しました。');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setFlashMessage('プロフィールの更新中にエラーが発生しました。');
      if (axios.isAxiosError(error)) {
        setError('プロフィールの更新に失敗しました。');
        if (error.response?.data.errors) {
          setValidationErrors(error.response.data.errors);
        } else {
          setError(error.response?.data.error || 'プロフィールの更新に失敗しました。');
        }
      } else {
        setError('プロフィールの更新に失敗しました。');
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
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <WavyBackground
        colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22ee8f"]}
        waveOpacity={0.3}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Box className="w-full lg:w-2/3 xl:w-1/2 bg-white shadow-md rounded-lg p-8">
            <Typography variant="h5" component="h2" style={{ color: 'black', textAlign: 'center', marginBottom: '20px' }}>
              プロフィール編集
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap="16px">
                <Box display="flex" flexDirection="column" gap="8px">
                  <label className="label text-gray-700" style={{ color: 'black' }}>アバター</label>
                  <Box display="flex" alignItems="center" gap="16px">
                    {user?.avatar_url && (
                      <img
                        src={user.avatar_url}
                        className="rounded-full border border-gray-300"
                        id="preview"
                        alt="Avatar"
                        width="80"
                        height="80"
                      />
                    )}
                    <input
                      type="file"
                      className="input-file p-2 border border-gray-300 rounded-lg"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ color: 'black' }}
                    />
                  </Box>
                </Box>
                <TextField
                  label="名前"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!validationErrors.find(error => error.includes('名前'))}
                  helperText={validationErrors.find(error => error.includes('名前'))}
                  InputProps={{
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'black' }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(90deg, #e879f9, #38bdf8, #818cf8, #22eec5, #c084fc)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientAnimation 10s ease infinite',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #e879f9, #38bdf8, #818cf8, #22eec5, #c084fc)',
                    },
                  }}
                >
                  {loading ? '更新中...' : '更新'}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
        <Snackbar
          open={!!error || validationErrors.length > 0}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ marginTop: '84px', zIndex: 1400 }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
            <ul>
              {validationErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </Alert>
        </Snackbar>
      </WavyBackground>
    </div>
  );
};

export default EditProfile;
