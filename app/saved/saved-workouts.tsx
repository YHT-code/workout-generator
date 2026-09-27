"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, Dumbbell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type SavedWorkout = { id:string; title:string; duration:number; equipment:string; exercises:Array<{name:string;sets:number;reps:string;rest:number}> };

export function SavedWorkouts() {
  const [items, setItems] = useState<SavedWorkout[] | null>(null);
  useEffect(() => { setItems(JSON.parse(localStorage.getItem("repforge-saved") || "[]")); }, []);
  function remove(id:string) { const next=(items || []).filter((item)=>item.id!==id); setItems(next); localStorage.setItem("repforge-saved",JSON.stringify(next)); }
  if (items === null) return <section className="saved-list"><div className="saved-card skeleton-card" /></section>;
  if (!items.length) return <section className="empty-state saved-empty"><h2>No saved sessions yet.</h2><p>Generate a workout, then tap the bookmark to keep it here.</p><Button asChild><Link href="/">Generate a workout</Link></Button></section>;
  return <section className="saved-list">{items.map((workout) => <article className="saved-card" key={workout.id}><div><p>SAVED SESSION</p><h2>{workout.title}</h2><span><Clock3 /> {workout.duration} min</span><span><Dumbbell /> {workout.equipment}</span></div><ol>{workout.exercises.slice(0,5).map((move)=><li key={move.name}><span>{move.name}</span><b>{move.sets} × {move.reps}</b></li>)}</ol><button type="button" onClick={()=>remove(workout.id)} aria-label={`Delete ${workout.title}`}><Trash2 /> Remove</button></article>)}</section>;
}
