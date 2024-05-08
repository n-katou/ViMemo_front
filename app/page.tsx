"use client";

import React from 'react';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';

const AuthPage = () => {
  const { user, login, logout, error, idToken } = useFirebaseAuth();

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return (
      <div>
        <button onClick={login}>ログイン</button>
      </div>
    );
  }

  return (
    <div>
      <div>User: {user.displayName}</div>
      <div>Email: {user.email}</div>
      <div>ID Token: {idToken}</div> {/* IDトークンを表示 */}
      <button onClick={logout}>ログアウト</button>
    </div>
  );
};

export default AuthPage;
