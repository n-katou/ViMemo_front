"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validationLoginSchema } from "@/src/validationSchema";

interface LoginForm {
  email: string;
  password: string;
}

const Page = () => {
  const { data: session } = useSession();
  const [resError, setResError] = useState<Error>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onChange",
    resolver: zodResolver(validationLoginSchema),
  });

  useEffect(() => {
    if (session) {
      router.push('/logout');
    }
  }, [session, router]);

  const handleLogin = async (data: LoginForm) => {
    const { email, password } = data;
    const res = await fetch("/api/signIn", {
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
    });

    if (res.ok) {
      signIn("credentials", { email, password });
    } else {
      const errorResponse = await res.json();
      setResError(new Error(errorResponse.errors));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('https://vimemo.fly.dev/oauth/google', {
        method: 'GET',
        headers: {
          'Frontend-Request': 'true'
        }
      });
      const data = await response.json();
      if (response.ok) {
        window.location.href = data.oauthUrl;
      } else {
        console.error('Failed to get OAuth URL:', data);
      }
    } catch (error) {
      console.error('Error fetching OAuth URL:', error);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen text-sm items-center justify-center">
      <div className="flex flex-col items-center justify-center p-10 border-2 rounded-2xl">
        <p className="text-2xl font-bold mb-5">ログイン画面</p>
        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col items-center">
          <div className="text-xs font-bold text-red-400 mb-4">
            {resError && resError.message}
          </div>
          <label htmlFor="email">
            <p>メールアドレス</p>
            <input type="text" id="email" {...register("email")} className="border-2 w-[300px] h-[35px] px-2 mb-2" />
            <div className="text-xs font-bold text-red-400 mb-2">
              {errors.email?.message && <span>{errors.email.message}</span>}
            </div>
          </label>
          <label htmlFor="password">
            <p>パスワード</p>
            <input type="password" id="password" {...register("password")} className="border-2 w-[300px] h-[35px] px-2 mb-2" />
            <div className="text-xs font-bold text-red-400 mb-2">
              {errors.password?.message && <span>{errors.password.message}</span>}
            </div>
          </label>
          <button type="submit" className="text-white bg-gray-700 w-[300px] h-[35px] mt-2">
            ログイン
          </button>
        </form>
        <hr className="my-4 border-gray-300 w-[300px]" />
        <div className="flex flex-col items-center">
          {/* <button onClick={() => signIn("github")} className="bg-white text-black border-2 w-[300px] h-[35px] mb-2">
            Githubでログイン
          </button> */}
          <button onClick={handleGoogleLogin} className="bg-white text-black border-2 w-[300px] h-[35px] mb-2">
            {/* <button onClick={() => signIn("google")} className="bg-white text-black border-2 w-[300px] h-[35px] mb-2"> */}
            Googleでログイン
          </button>
          <Link href="/signup" className="mt-2">
            新規登録はこちら
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
