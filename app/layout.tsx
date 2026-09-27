import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://workout-generator.tupai38.chatgpt.site"),
  title: { default: "RepForge — Free Workout Generator", template: "%s | RepForge" },
  description: "Generate a personalized home or gym workout in seconds, with exercises, sets, reps, rest times, warm-up, and cooldown.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "RepForge — Free Workout Generator", description: "Generate a personalized workout in seconds.", type: "website" },
  twitter: { card: "summary", title: "RepForge — Free Workout Generator", description: "Generate a personalized workout in seconds." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{const t=localStorage.getItem('repforge-theme');document.documentElement.dataset.theme=t||((matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark')}catch(e){document.documentElement.dataset.theme='dark'}`}}/></head><body>{children}<footer className="site-footer print:hidden"><div><strong>REPFORGE</strong><p>Train with a plan. Keep it simple.</p></div><nav aria-label="Footer navigation"><Link href="/about">About</Link><Link href="/privacy-policy">Privacy</Link><Link href="/disclaimer">Disclaimer</Link></nav><p>© {new Date().getFullYear()} RepForge</p></footer></body></html>;
}
