"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface Profile {
  name: string;
  email: string;
  youtube_playlist_url: string;
  note_likes: NoteLike[];
}

interface NoteLike {
  id: string;
  content: string;
}

const MyPage = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // セッションが認証済みで、ユーザー情報が存在する場合にのみ実行
    if (status === 'authenticated' && session?.user?.email) {
      const userEmail = session.user.email;  // userEmailはここでstring型と確認されている

      const fetchProfile = async () => {
        try {
          const { data } = await axios.get<Profile>(`https://vimemo.fly.dev/users/mypage`, { withCredentials: true });
          setProfile(data);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };

      fetchProfile();
    }
  }, [session, status]);  // session と status の変更を監視

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{profile?.name}</h1>
      <p>Email: {profile?.email}</p>
      <iframe src={profile?.youtube_playlist_url} frameBorder="0" allowFullScreen></iframe>
      <div>
        <h2>最新「いいね」したメモ一覧</h2>
        {profile?.note_likes?.map((note) => (
          <div key={note.id}>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPage;
