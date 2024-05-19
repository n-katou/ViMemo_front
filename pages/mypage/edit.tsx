import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CustomUser } from '../../types/user';

const EditProfile = () => {
  const { currentUser, jwtToken } = useAuth();
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
    formData.append('user[email]', email);
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
        router.push('/mypage');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-center">
        <div className="w-full lg:w-3/4">
          <h1 className="text-center text-3xl font-bold mb-6">プロフィール編集</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">Avatar</label>
              <div className="input-group">
                <input
                  type="file"
                  className="input input-bordered"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="mt-3 mb-3">
                {user?.avatar_url && (
                  <img
                    src={user.avatar_url}
                    className="rounded-full"
                    id="preview"
                    alt="Avatar"
                    width="100"
                    height="100"
                  />
                )}
              </div>
            </div>
            <div className="form-control">
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered"
              />
            </div>
            <button type="submit" className="btn btn-primary mt-4">更新</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
