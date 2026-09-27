"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import exerciseData from "@/data/exercises.json";

const FILTERS = ["all", "full", "upper", "lower", "core"];

export function ExerciseLibrary() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const filtered = useMemo(() => exerciseData.filter((exercise) => (area === "all" || exercise.area === area) && `${exercise.name} ${exercise.muscles.join(" ")} ${exercise.equipment}`.toLowerCase().includes(query.toLowerCase())), [area, query]);
  return <section className="library-section">
    <div className="library-toolbar"><label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Search exercises</span><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by exercise or muscle…" /></label><div className="filter-row" aria-label="Filter by area">{FILTERS.map((filter) => <button key={filter} type="button" className={area === filter ? "active" : ""} onClick={() => setArea(filter)}>{filter === "all" ? "All" : filter}</button>)}</div></div>
    <p className="result-count">{filtered.length} exercises</p>
    <div className="exercise-grid">{filtered.map((exercise) => <article key={exercise.id} className="library-card"><div><span>{exercise.equipment === "none" ? "BODYWEIGHT" : exercise.equipment.toUpperCase()}</span><span>{exercise.level.toUpperCase()}</span></div><h2>{exercise.name}</h2><p>{exercise.note}</p><footer>{exercise.muscles.join(" · ")}<strong>~{exercise.seconds}s / set</strong></footer></article>)}</div>
    {filtered.length === 0 && <div className="empty-state"><h2>No matches yet</h2><p>Try a broader search or another training area.</p></div>}
  </section>;
}
