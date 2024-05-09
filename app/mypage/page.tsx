"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

interface Profile {
  name: string;
  email: string;
}

const MyPage = () => {
  const { user, idToken, login, logout } = useFirebaseAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user && user.email) { // ユーザーがログインしており、メールアドレスがnullでないことを確認
      const fetchData = async () => {
        try {
          const response = await axios.post(`https://vimemo.fly.dev/api/userdata`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            }
          });
          setProfile(response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchData();
    } else {
      // メールアドレスがnullの場合の処理
      console.log('User is not logged in or email is null');
      setProfile(null);
    }
  }, [user, idToken]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.name}</h1>
      <p>Email: {profile?.email}</p>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default MyPage;
