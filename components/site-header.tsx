import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return <header className="site-header"><Link href="/" className="brand" aria-label="RepForge home"><span className="brand-mark"><Dumbbell aria-hidden="true" /></span><span>REPFORGE</span></Link><div className="header-actions"><nav aria-label="Primary navigation"><Link href="/exercises">Exercises</Link><Link href="/guides">Guides</Link><Link href="/saved">Saved</Link></nav><ThemeToggle/></div></header>;
}
