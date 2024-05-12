// pages/_app.tsx
import type { AppProps } from "next/app";
import Header from '../components/Header';

import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
