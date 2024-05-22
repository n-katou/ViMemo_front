import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useFlashMessage } from '../../context/FlashMessageContext';
import { CustomUser } from '../../types/user';

const EditProfile = () => {
  const { currentUser, jwtToken } = useAuth();
  const { setFlashMessage } = useFlashMessage();
  const router = useRouter();
  const [user, setUser] = useState<CustomUser | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser as CustomUser);
      setEmail(currentUser.email);
      setName(currentUser.name);
    }
  }, [currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

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
    }
  };

  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-center">
        <div className="w-full lg:w-2/3 xl:w-1/2 bg-white shadow-md rounded-lg p-8">
          <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">プロフィール編集</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label text-gray-700">アバター</label>
              <div className="flex flex-wrap items-center">
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
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label text-gray-700">名前</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200">更新</button>
          </form>
        </div>
      </div>
      <style jsx>{`
        .flex-wrap {
          flex-wrap: wrap;
        }
        .input-file {
          flex: 1 1 auto;
          min-width: 0;
        }
        @media (max-width: 640px) {
          .input-file {
            width: 100%;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
