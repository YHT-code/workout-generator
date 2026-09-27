import type { MetadataRoute } from "next";
const base="https://workout-generator.tupai38.chatgpt.site";
export default function sitemap():MetadataRoute.Sitemap{return ["","/exercises","/guides","/guides/bodyweight-workout","/guides/30-minute-dumbbell-workout","/about","/privacy-policy","/disclaimer"].map((route)=>({url:`${base}${route}`,lastModified:new Date("2026-09-27"),changeFrequency:route.includes("guides")?"monthly":"weekly",priority:route===""?1:route==="/exercises"?0.9:0.6}))}
