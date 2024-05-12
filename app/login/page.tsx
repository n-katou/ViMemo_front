"use client";
import axios from 'axios';
import { useState, FormEvent } from 'react';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://vimemo.fly.dev/api/v1/login', { email, password });
      console.log('Login successful:', response.data);
      window.location.href = '/';
      // Redirect or do something after login
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto my-10 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-800 py-6">ログイン</h1>
        <form onSubmit={handleSubmit} className="space-y-4 px-8 pb-8">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">パスワード</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            ログイン
          </button>
        </form>
        <div className="flex justify-center">
          <Link href="/auth/google" className="btn btn-accent">
            Googleでログイン
          </Link>
        </div>
        <div className="text-center mt-4">
          <Link href="/register" className="text-blue-600 hover:text-blue-800">
            登録ページへ
          </Link>
          {/* <br />
          <Link href="/password-reset" className="text-blue-600 hover:text-blue-800">
            パスワードを忘れた方
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
