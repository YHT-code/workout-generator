import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { ExerciseLibrary } from "./exercise-library";

export const metadata: Metadata = { title: "Exercise Library", description: "Browse 56 bodyweight, dumbbell, and full-gym exercises by training area and difficulty." };

export default function ExercisesPage() {
  return <main><SiteHeader /><section className="subpage-hero"><p className="eyebrow"><span /> EXERCISE LIBRARY</p><h1>Find your next move.</h1><p>Clear cues for every exercise used by the generator.</p></section><ExerciseLibrary /></main>;
}
