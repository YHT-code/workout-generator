import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Workout Guides", description: "Practical workout guides for bodyweight, dumbbell, beginner, and time-efficient training." };
const guides=[{href:"/guides/bodyweight-workout",tag:"NO EQUIPMENT",time:"6 min read",title:"The simple bodyweight workout that scales with you",copy:"How to build a balanced session anywhere — and make it harder without adding equipment."},{href:"/guides/30-minute-dumbbell-workout",tag:"DUMBBELLS",time:"5 min read",title:"A complete 30-minute dumbbell workout",copy:"One pair of dumbbells, six moves, and a clear plan for strength without wasting time."}];
export default function GuidesPage(){return <main><SiteHeader/><section className="subpage-hero"><p className="eyebrow"><span/> TRAINING GUIDES</p><h1>Less noise. Better sessions.</h1><p>Practical guidance you can use in your next workout.</p></section><section className="guide-grid">{guides.map((guide,index)=><Link href={guide.href} className="guide-card" key={guide.href}><span>0{index+1}</span><div><p>{guide.tag} · <Clock3/> {guide.time}</p><h2>{guide.title}</h2><p>{guide.copy}</p></div><ArrowUpRight/></Link>)}</section></main>}
