import "../styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google"; // インポート

export const runtime = "edge";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
			// GoogleAnalyticsコンポーネントの追加
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? ""} />
    </html>
  );
}
