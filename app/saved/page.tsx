import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SavedWorkouts } from "./saved-workouts";

export const metadata: Metadata = { title: "Saved Workouts", description: "View workout routines saved on this device with RepForge." };
export default function SavedPage() { return <main><SiteHeader /><section className="subpage-hero compact"><p className="eyebrow"><span /> YOUR TRAINING FILE</p><h1>Saved workouts.</h1><p>Stored only in this browser, ready when you are.</p></section><SavedWorkouts /></main>; }
