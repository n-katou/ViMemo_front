"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

interface Profile {
  name: string;
  email: string;
}

const MyPage = () => {
  const { user } = useFirebaseAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const idToken = await user.getIdToken();
        const response = await axios.post('https://vimemo.fly.dev/api/authenticate', {
          id_token: idToken
        });
        setProfile(response.data);
      }
    };

    fetchUserData();
  }, [user]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile.name}</h1>
      <p>Email: {profile.email}</p>
    </div>
  );
};

export default MyPage;
