import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
export default function NotFound(){return <main><SiteHeader/><section className="not-found"><p>404</p><h1>That page missed the rep.</h1><span>The workout generator is still right where you left it.</span><Button asChild><Link href="/"><ArrowLeft/> Back to generator</Link></Button></section></main>}
