import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import { useFlashMessage } from '../../../context/FlashMessageContext';
import { CustomUser } from '../../../types/user';

export const useEditProfile = () => {
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

  return {
    user,
    email,
    name,
    avatar,
    loading,
    error,
    validationErrors,
    setName,
    handleFileChange,
    handleSubmit,
    handleCloseSnackbar,
  };
};

export default useEditProfile;
