"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Flame,
  Clock3,
  TimerReset,
  Dumbbell,
  Check,
  Copy,
  Printer,
  Bookmark,
  RefreshCw,
  ArrowLeft,
  Sliders,
  Plus,
  X,
  Search,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import exerciseData from "@/data/exercises.json";

export type Exercise = {
  name: string;
  area: "full" | "upper" | "lower" | "core";
  equipment: "none" | "dumbbells" | "gym";
  level: "beginner" | "intermediate" | "advanced";
  strength: boolean;
  note: string;
  muscles?: string[];
};

export type WorkoutMove = Exercise & {
  sets: number;
  reps: string;
  rest: number;
};

export type Workout = {
  id: string;
  title: string;
  duration: number;
  level: string;
  equipment: string;
  warmup: string[];
  exercises: WorkoutMove[];
  cooldown: string[];
  recommendedExercises?: WorkoutMove[];
  recommendedWarmup?: string[];
  recommendedCooldown?: string[];
};

export type MobilityMove = {
  name: string;
  durationOrReps: string;
  category: string;
  description: string;
};

const WARMUP_LIBRARY: MobilityMove[] = [
  { name: "Fast march + arm circles", durationOrReps: "60 sec", category: "Full body", description: "Gradually elevates core temperature and mobilizes the shoulders." },
  { name: "Squat to reach", durationOrReps: "60 sec", category: "Hips & Spine", description: "Hips sink into a deep squat, then reach overhead into extension." },
  { name: "Walkout / Inchworm", durationOrReps: "60 sec", category: "Hamstrings & Shoulders", description: "Hinge from hips, walk hands forward into plank, and walk back." },
  { name: "Cat-cow mobility flow", durationOrReps: "45 sec", category: "Spine & Core", description: "Rhythmic spinal flexion and extension to lubricate vertebrae." },
  { name: "World's greatest stretch", durationOrReps: "60 sec", category: "Hips & Spine", description: "Deep lunge with thoracic rotation to open hips and upper back." },
  { name: "High knees & butt kicks", durationOrReps: "45 sec", category: "Cardio Prep", description: "Rhythmic steps pumping blood into quads, calves, and ankles." },
  { name: "Arm swings & torso twists", durationOrReps: "45 sec", category: "Upper Body", description: "Open chest horizontally and rotate smoothly through thoracic spine." },
  { name: "Glute bridge activation", durationOrReps: "45 sec", category: "Glutes & Core", description: "Drive through heels, squeeze glutes at top to wake up hip extensors." },
  { name: "Lateral lunges", durationOrReps: "45 sec", category: "Hips & Groin", description: "Shift weight side to side to prime adductors, knees, and ankles." },
  { name: "Ankle & wrist circles", durationOrReps: "30 sec", category: "Joint Mobility", description: "Controlled rotational circles to prepare distal joints for loading." },
  { name: "Bird-dog reaches", durationOrReps: "45 sec", category: "Spine & Core", description: "Opposite arm and leg reach with steady braced midline." },
  { name: "Jumping jacks / Step jacks", durationOrReps: "45 sec", category: "Cardio Prep", description: "Light bounding to prime feet, Achilles, and heart rate." },
];

const COOLDOWN_LIBRARY: MobilityMove[] = [
  { name: "Child’s pose", durationOrReps: "45 sec", category: "Back & Hips", description: "Deep abdominal breathing with hips grounded to heels." },
  { name: "Half-kneeling hip stretch", durationOrReps: "45 sec / side", category: "Hip Flexors", description: "Gentle posterior pelvic tilt to release front of the hips." },
  { name: "Slow breathing + forward fold", durationOrReps: "60 sec", category: "Hamstrings & Spine", description: "Soft knees, letting upper body hang and nervous system calm down." },
  { name: "Pigeon pose / Figure-four", durationOrReps: "45 sec / side", category: "Glutes & Hips", description: "Unlocks tension in deep rotators and outer hip." },
  { name: "Doorway chest & bicep stretch", durationOrReps: "45 sec", category: "Chest & Shoulders", description: "Forearm on door frame, step through to gently stretch pecs." },
  { name: "Overhead triceps & lats stretch", durationOrReps: "30 sec / side", category: "Arms & Lats", description: "Reach elbow overhead and lean torso gently to the side." },
  { name: "Seated hamstring stretch", durationOrReps: "45 sec", category: "Hamstrings", description: "Reach toward toes keeping back straight and breath steady." },
  { name: "Quad stretch (standing/side)", durationOrReps: "45 sec / side", category: "Quads & Hips", description: "Draw heel toward glutes, keep knees aligned and core tall." },
  { name: "Downward dog calf pedal", durationOrReps: "45 sec", category: "Calves & Feet", description: "Alternate pressing heels toward floor to lengthen posterior chain." },
  { name: "Butterfly stretch", durationOrReps: "45 sec", category: "Inner Thighs", description: "Soles together, tall spine, gently pressing knees downward." },
  { name: "Supine spinal twist", durationOrReps: "45 sec / side", category: "Lower Back", description: "Arms wide, allow knees to fall softly to one side while relaxing." },
  { name: "Cobra / Sphinx stretch", durationOrReps: "45 sec", category: "Abdominals & Spine", description: "Gentle chest lift off the floor to open anterior chain." },
];

interface ReadyToMoveViewProps {
  workout: Workout | null;
  totalSets: number;
  saved: boolean;
  copied: boolean;
  onNavigateToBuilder: () => void;
  onRegenerate?: () => void;
  onSave: () => void;
  onCopy: () => void;
  onUpdateWorkout?: (workout: Workout) => void;
  onDiscard?: () => void;
  onNavigateToHome?: () => void;
  onSaveWorkoutAndGoHome?: () => void;
}

export function ReadyToMoveView({
  workout,
  totalSets,
  saved,
  copied,
  onNavigateToBuilder,
  onRegenerate,
  onSave,
  onCopy,
  onUpdateWorkout,
  onDiscard,
  onNavigateToHome,
  onSaveWorkoutAndGoHome,
}: ReadyToMoveViewProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalTargetSection, setModalTargetSection] = useState<"main" | "warmup" | "cooldown">("main");
  const [modalSearch, setModalSearch] = useState("");
  const [modalFilter, setModalFilter] = useState<string>("all");

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isAddModalOpen) {
        setIsAddModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAddModalOpen]);

  function openAddModalFor(section: "main" | "warmup" | "cooldown") {
    setModalTargetSection(section);
    setModalSearch("");
    setModalFilter("all");
    setIsAddModalOpen(true);
  }

  // Filter available items based on target section
  const availableExercises = useMemo(() => {
    if (modalTargetSection !== "main") return [];
    const list = exerciseData as Exercise[];
    return list.filter((item) => {
      const matchesArea = modalFilter === "all" || item.area === modalFilter;
      const q = modalSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.muscles && item.muscles.some((m) => m.toLowerCase().includes(q))) ||
        item.equipment.toLowerCase().includes(q);
      return matchesArea && matchesQuery;
    });
  }, [modalTargetSection, modalFilter, modalSearch]);

  const availableWarmupMoves = useMemo(() => {
    if (modalTargetSection !== "warmup") return [];
    return WARMUP_LIBRARY.filter((item) => {
      const matchesCat = modalFilter === "all" || item.category === modalFilter;
      const q = modalSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [modalTargetSection, modalFilter, modalSearch]);

  const availableCooldownMoves = useMemo(() => {
    if (modalTargetSection !== "cooldown") return [];
    return COOLDOWN_LIBRARY.filter((item) => {
      const matchesCat = modalFilter === "all" || item.category === modalFilter;
      const q = modalSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [modalTargetSection, modalFilter, modalSearch]);

  if (!workout) {
    return (
      <div className="module-page-container">
        <section className="intro">
          <div>
            <p className="eyebrow"><span /> READY TO MOVE · WORKOUT SESSION</p>
            <h1>READY TO MOVE<br /><em>NO ACTIVE SESSION</em></h1>
          </div>
          <p>No workout generated yet. Configure your split and preferences in the builder to create your custom session.</p>
        </section>

        <div className="ready-page-shell">
          <div className="empty-module-shell">
            <div className="empty-state">
              <Flame className="w-12 h-12 text-amber-500 opacity-90 mb-3" />
              <h2>READY TO MOVE</h2>
              <p>Build your session first to generate a structured workout here.</p>
              <div className="mt-6">
                <Button onClick={onNavigateToBuilder} className="gap-2">
                  <Sliders className="w-4 h-4" />
                  <span>Open Session Builder</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function handleDiscard() {
    if (onDiscard) {
      onDiscard();
    } else {
      onNavigateToBuilder();
    }
  }

  function handleSaveAndGoHome() {
    if (onSaveWorkoutAndGoHome) {
      onSaveWorkoutAndGoHome();
    } else {
      onSave();
      if (onNavigateToHome) {
        onNavigateToHome();
      }
    }
  }

  function handleSwapExercise(index: number) {
    if (!workout || !onUpdateWorkout) return;
    const current = workout.exercises[index];
    const currentNames = workout.exercises.map((e) => e.name);
    const candidates = (exerciseData as Exercise[]).filter(
      (e) =>
        !currentNames.includes(e.name) &&
        (e.equipment === current.equipment || e.equipment === "none" || current.equipment === "gym")
    );
    if (candidates.length === 0) return;
    const nextMove = candidates[Math.floor(Math.random() * candidates.length)];
    const updatedExercises = [...workout.exercises];
    updatedExercises[index] = {
      ...nextMove,
      sets: current.sets,
      reps: current.reps,
      rest: current.rest,
    };
    onUpdateWorkout({ ...workout, exercises: updatedExercises });
  }

  function handleRemoveExercise(index: number) {
    if (!workout || !onUpdateWorkout || workout.exercises.length <= 1) return;
    const updatedExercises = workout.exercises.filter((_, i) => i !== index);
    onUpdateWorkout({ ...workout, exercises: updatedExercises });
  }

  function handleAddSelectedExercise(exercise: Exercise) {
    if (!workout || !onUpdateWorkout) return;
    const newMove: WorkoutMove = {
      ...exercise,
      sets: 3,
      reps: "10–12",
      rest: 40,
    };
    onUpdateWorkout({ ...workout, exercises: [...workout.exercises, newMove] });
    setIsAddModalOpen(false);
  }

  function handleAddWarmupMove(item: MobilityMove) {
    if (!workout || !onUpdateWorkout) return;
    const moveStr = `${item.name} · ${item.durationOrReps}`;
    onUpdateWorkout({
      ...workout,
      warmup: [...workout.warmup, moveStr],
    });
    setIsAddModalOpen(false);
  }

  function handleRemoveWarmup(index: number) {
    if (!workout || !onUpdateWorkout || workout.warmup.length <= 1) return;
    const next = workout.warmup.filter((_, i) => i !== index);
    onUpdateWorkout({ ...workout, warmup: next });
  }

  function handleClearWarmup() {
    if (!workout || !onUpdateWorkout) return;
    const recommended =
      workout.recommendedWarmup && workout.recommendedWarmup.length > 0
        ? workout.recommendedWarmup
        : workout.duration === 10
        ? ["Fast march · 45 sec", "Squat to reach · 45 sec"]
        : ["Fast march + arm circles · 60 sec", "Squat to reach · 60 sec", "Walkout · 60 sec"];
    onUpdateWorkout({
      ...workout,
      warmup: [...recommended],
    });
  }

  function handleAddCooldownMove(item: MobilityMove) {
    if (!workout || !onUpdateWorkout) return;
    const moveStr = `${item.name} · ${item.durationOrReps}`;
    onUpdateWorkout({
      ...workout,
      cooldown: [...workout.cooldown, moveStr],
    });
    setIsAddModalOpen(false);
  }

  function handleRemoveCooldown(index: number) {
    if (!workout || !onUpdateWorkout || workout.cooldown.length <= 1) return;
    const next = workout.cooldown.filter((_, i) => i !== index);
    onUpdateWorkout({ ...workout, cooldown: next });
  }

  function handleClearCooldown() {
    if (!workout || !onUpdateWorkout) return;
    const recommended =
      workout.recommendedCooldown && workout.recommendedCooldown.length > 0
        ? workout.recommendedCooldown
        : workout.duration === 10
        ? ["Slow breathing + forward fold · 60 sec"]
        : ["Child’s pose · 45 sec", "Half-kneeling hip stretch · 45 sec / side"];
    onUpdateWorkout({
      ...workout,
      cooldown: [...recommended],
    });
  }

  function handleSetSets(index: number, newSets: number) {
    if (!workout || !onUpdateWorkout) return;
    const sets = Math.max(1, Math.min(12, newSets));
    const updatedExercises = [...workout.exercises];
    updatedExercises[index] = { ...workout.exercises[index], sets };
    onUpdateWorkout({ ...workout, exercises: updatedExercises });
  }

  function handleAdjustSets(index: number, delta: number) {
    if (!workout || !onUpdateWorkout) return;
    const current = workout.exercises[index];
    const newSets = Math.max(1, Math.min(12, current.sets + delta));
    const updatedExercises = [...workout.exercises];
    updatedExercises[index] = { ...current, sets: newSets };
    onUpdateWorkout({ ...workout, exercises: updatedExercises });
  }

  function handleSetReps(index: number, reps: string) {
    if (!workout || !onUpdateWorkout) return;
    const updatedExercises = [...workout.exercises];
    updatedExercises[index] = { ...workout.exercises[index], reps };
    onUpdateWorkout({ ...workout, exercises: updatedExercises });
  }

  function handleClearToRecommended() {
    if (!workout || !onUpdateWorkout) return;
    const recommended = workout.recommendedExercises;
    if (recommended && recommended.length > 0) {
      onUpdateWorkout({
        ...workout,
        exercises: recommended.map((m) => ({ ...m })),
      });
    }
  }

  return (
    <div className="module-page-container">
      <section className="intro print:hidden">
        <div>
          <p className="eyebrow"><span /> READY TO MOVE · WORKOUT SESSION</p>
          <h1>YOUR WORKOUT SESSION<br /><em>READY TO MOVE</em></h1>
        </div>
        <p>Complete training routine with warm-up, programmed working sets, and cool-down.</p>
      </section>

      <div className="ready-page-shell">
        {/* Navigation Bar */}
        <div className="ready-nav-bar print:hidden">
          <Button
            onClick={onNavigateToBuilder}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Session Builder</span>
          </Button>
        </div>

        {/* Dedicated Workout Card */}
        <section className="result-panel" aria-label="Workout routine">
          <div className="result-topline print:hidden">
            <p>
              <Flame aria-hidden="true" /> READY TO MOVE
            </p>
            <div className="result-actions">
              <button
                type="button"
                onClick={onCopy}
                aria-label="Copy workout"
                title="Copy workout"
              >
                {copied ? <Check /> : <Copy />}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                aria-label="Print workout"
                title="Print workout"
              >
                <Printer />
              </button>
              <button
                type="button"
                onClick={onSave}
                aria-label="Save workout"
                title="Save workout"
                className={saved ? "saved" : ""}
              >
                {saved ? <Check /> : <Bookmark />}
              </button>
            </div>
          </div>

          {/* Clean Stats Bar (Title removed) */}
          <div className="workout-heading pt-2 pb-4">
            <div className="workout-stats mt-0">
              <span>
                <Clock3 /> {workout.duration} min
              </span>
              <span>
                <TimerReset /> {totalSets} work sets
              </span>
              <span>
                <Dumbbell /> {workout.equipment}
              </span>
            </div>
          </div>

          {/* Warm-Up Section */}
          <div className="section-rule">
            <span>WARM-UP</span>
            <i />
          </div>
          <div className="prep-list">
            {workout.warmup.map((move, index) => (
              <div key={`${move}-${index}`} className="prep-card">
                <div className="prep-card-content">
                  <b>0{index + 1}</b>
                  <span>{move}</span>
                </div>
                {onUpdateWorkout && workout.warmup.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveWarmup(index)}
                    className="prep-card-remove print:hidden"
                    title="Remove movement"
                    aria-label={`Remove ${move}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {onUpdateWorkout && (
            <div className="main-work-actions print:hidden">
              <button
                type="button"
                onClick={() => openAddModalFor("warmup")}
                className="add-exercise-btn"
                title="Browse and add warm-up exercise"
              >
                <Plus className="w-4 h-4" />
                <span>Add Exercise</span>
              </button>
              <button
                type="button"
                onClick={handleClearWarmup}
                className="clear-exercises-btn"
                title="Reset warm-up to system recommended movements"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          )}

          {/* Main Work Section */}
          <div className="section-rule mt-6">
            <span>MAIN WORK</span>
            <i />
          </div>
          <ol className="exercise-list">
            {workout.exercises.map((move, index) => (
              <li key={`${workout.id}-${move.name}-${index}`}>
                <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="exercise-copy">
                  <div className="flex items-center gap-2">
                    <h3>{move.name}</h3>
                    {onUpdateWorkout && (
                      <button
                        type="button"
                        onClick={() => handleSwapExercise(index)}
                        className="print:hidden text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border/50 hover:border-primary transition-colors cursor-pointer"
                        title="Swap with another exercise"
                        aria-label={`Swap ${move.name}`}
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span className="text-[0.65rem]">Swap</span>
                      </button>
                    )}
                  </div>
                  <p>{move.note}</p>
                </div>

                {/* Customizable Sets and Reps */}
                <div className="prescription">
                  <div className="flex flex-col items-end gap-1.5">
                    {/* Sets Customization */}
                    <div className="flex items-center gap-1">
                      {onUpdateWorkout && (
                        <button
                          type="button"
                          onClick={() => handleAdjustSets(index, -1)}
                          className="print:hidden w-5 h-5 rounded border border-border/70 flex items-center justify-center text-xs font-bold hover:border-primary hover:text-primary transition-colors cursor-pointer"
                          title="Decrease sets"
                          aria-label="Decrease sets"
                        >
                          -
                        </button>
                      )}
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={move.sets}
                        onChange={(e) => handleSetSets(index, parseInt(e.target.value) || 1)}
                        className="w-10 h-7 text-center font-bold text-sm bg-transparent border border-border/70 rounded px-1 focus:border-primary outline-none"
                        title="Number of sets"
                        aria-label="Sets"
                      />
                      {onUpdateWorkout && (
                        <button
                          type="button"
                          onClick={() => handleAdjustSets(index, 1)}
                          className="print:hidden w-5 h-5 rounded border border-border/70 flex items-center justify-center text-xs font-bold hover:border-primary hover:text-primary transition-colors cursor-pointer"
                          title="Increase sets"
                          aria-label="Increase sets"
                        >
                          +
                        </button>
                      )}
                      <span className="text-[0.68rem] font-bold text-muted-foreground uppercase ml-0.5">sets</span>
                    </div>

                    {/* Reps Customization */}
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground text-xs mr-0.5">×</span>
                      <input
                        type="text"
                        value={move.reps}
                        onChange={(e) => handleSetReps(index, e.target.value)}
                        className="w-20 h-7 text-center font-semibold text-xs bg-transparent border border-border/70 rounded px-1.5 focus:border-primary outline-none"
                        placeholder="10-12"
                        title="Customize reps or duration"
                        aria-label="Reps"
                      />
                      <span className="text-[0.68rem] font-bold text-muted-foreground uppercase ml-0.5">reps</span>
                    </div>

                    {/* Rest time & Remove action */}
                    <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{move.rest}s rest</span>
                      {onUpdateWorkout && workout.exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(index)}
                          className="print:hidden text-muted-foreground hover:text-red-500 cursor-pointer p-0.5 rounded transition-colors"
                          title="Remove exercise"
                          aria-label={`Remove ${move.name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Add Exercise & Red Clear Button for Main Work */}
          {onUpdateWorkout && (
            <div className="main-work-actions print:hidden">
              <button
                type="button"
                onClick={() => openAddModalFor("main")}
                className="add-exercise-btn"
                title="Browse and add exercise to workout"
              >
                <Plus className="w-4 h-4" />
                <span>Add Exercise</span>
              </button>
              <button
                type="button"
                onClick={handleClearToRecommended}
                className="clear-exercises-btn"
                title="Reset main work to system recommended exercises"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          )}

          {/* Cooldown Section */}
          <div className="section-rule mt-6">
            <span>COOLDOWN</span>
            <i />
          </div>
          <div className="prep-list cooldown-list">
            {workout.cooldown.map((move, index) => (
              <div key={`${move}-${index}`} className="prep-card">
                <div className="prep-card-content">
                  <b>0{index + 1}</b>
                  <span>{move}</span>
                </div>
                {onUpdateWorkout && workout.cooldown.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCooldown(index)}
                    className="prep-card-remove print:hidden"
                    title="Remove cooldown stretch"
                    aria-label={`Remove ${move}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {onUpdateWorkout && (
            <div className="main-work-actions print:hidden">
              <button
                type="button"
                onClick={() => openAddModalFor("cooldown")}
                className="add-exercise-btn"
                title="Browse and add cooldown stretch"
              >
                <Plus className="w-4 h-4" />
                <span>Add Exercise</span>
              </button>
              <button
                type="button"
                onClick={handleClearCooldown}
                className="clear-exercises-btn"
                title="Reset cooldown to system recommended stretches"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          )}

          {/* Bottom Actions: Save Workout and Soft-Red Discard Button beside each other */}
          <div className="ready-bottom-actions print:hidden">
            <button
              type="button"
              onClick={handleSaveAndGoHome}
              className="save-workout-btn"
              title="Save workout and return to Home"
            >
              <Bookmark className="w-4 h-4" />
              <span>Save Workout</span>
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="discard-workout-btn"
              title="Discard workout and return to Build your session"
            >
              <Trash2 className="w-4 h-4" />
              <span>Discard</span>
            </button>
          </div>
        </section>
      </div>

      {/* Pop-up Window / Modal for Adding Exercises (Warm-Up, Main Work, or Cooldown) */}
      {isAddModalOpen && (
        <div
          className="exercise-modal-backdrop print:hidden"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="exercise-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-exercise-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="modal-exercise-title">
                  {modalTargetSection === "warmup"
                    ? "Choose a Warm-Up Exercise"
                    : modalTargetSection === "cooldown"
                    ? "Choose a Cooldown Stretch"
                    : "Choose an Exercise"}
                </h3>
                <p>
                  {modalTargetSection === "warmup"
                    ? "Browse dynamic mobility movements to add to your warm-up"
                    : modalTargetSection === "cooldown"
                    ? "Browse recovery stretches to add to your cool-down"
                    : "Browse library to add moves to your routine"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="modal-close-btn"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="modal-search-row">
              <Search className="w-4 h-4 text-muted-foreground ml-3 mr-2" />
              <input
                type="text"
                placeholder={
                  modalTargetSection === "warmup"
                    ? "Search warm-up movements..."
                    : modalTargetSection === "cooldown"
                    ? "Search cooldown stretches..."
                    : "Search by name, area, or muscle..."
                }
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                autoFocus
              />
              {modalSearch && (
                <button
                  type="button"
                  onClick={() => setModalSearch("")}
                  className="p-1 mr-2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Row */}
            <div className="modal-filter-row">
              {modalTargetSection === "main" ? (
                (["all", "upper", "lower", "core", "full"] as const).map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setModalFilter(area)}
                    className={`modal-filter-btn ${modalFilter === area ? "active" : ""}`}
                  >
                    {area === "all" ? "All" : area.toUpperCase()}
                  </button>
                ))
              ) : modalTargetSection === "warmup" ? (
                ["all", "Full body", "Hips & Spine", "Spine & Core", "Cardio Prep", "Upper Body"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setModalFilter(cat)}
                    className={`modal-filter-btn ${modalFilter === cat ? "active" : ""}`}
                  >
                    {cat === "all" ? "All" : cat}
                  </button>
                ))
              ) : (
                ["all", "Back & Hips", "Hip Flexors", "Hamstrings", "Glutes & Hips", "Chest & Shoulders"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setModalFilter(cat)}
                    className={`modal-filter-btn ${modalFilter === cat ? "active" : ""}`}
                  >
                    {cat === "all" ? "All" : cat}
                  </button>
                ))
              )}
            </div>

            <div className="modal-exercise-list">
              {/* Main Work Exercises List */}
              {modalTargetSection === "main" && (
                availableExercises.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No matching exercises found.
                  </div>
                ) : (
                  availableExercises.map((exercise) => {
                    const isAdded = workout.exercises.some((e) => e.name === exercise.name);
                    return (
                      <div key={exercise.name} className="modal-exercise-card">
                        <div className="modal-card-info">
                          <h4>{exercise.name}</h4>
                          <p>{exercise.note}</p>
                          <div className="modal-card-tags">
                            <span className="badge-area">{exercise.area}</span>
                            <span className="badge-equip">
                              {exercise.equipment === "none" ? "bodyweight" : exercise.equipment}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddSelectedExercise(exercise)}
                          className={`modal-card-add-btn ${isAdded ? "added" : ""}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAdded ? "Add again" : "Add"}</span>
                        </button>
                      </div>
                    );
                  })
                )
              )}

              {/* Warm-Up Movements List */}
              {modalTargetSection === "warmup" && (
                availableWarmupMoves.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No matching warm-up movements found.
                  </div>
                ) : (
                  availableWarmupMoves.map((move) => {
                    const isAdded = workout.warmup.some((w) => w.startsWith(move.name));
                    return (
                      <div key={move.name} className="modal-exercise-card">
                        <div className="modal-card-info">
                          <h4>{move.name}</h4>
                          <p>{move.description}</p>
                          <div className="modal-card-tags">
                            <span className="badge-area">{move.category}</span>
                            <span className="badge-equip">{move.durationOrReps}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddWarmupMove(move)}
                          className={`modal-card-add-btn ${isAdded ? "added" : ""}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAdded ? "Add again" : "Add"}</span>
                        </button>
                      </div>
                    );
                  })
                )
              )}

              {/* Cooldown Stretches List */}
              {modalTargetSection === "cooldown" && (
                availableCooldownMoves.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No matching cooldown stretches found.
                  </div>
                ) : (
                  availableCooldownMoves.map((move) => {
                    const isAdded = workout.cooldown.some((c) => c.startsWith(move.name));
                    return (
                      <div key={move.name} className="modal-exercise-card">
                        <div className="modal-card-info">
                          <h4>{move.name}</h4>
                          <p>{move.description}</p>
                          <div className="modal-card-tags">
                            <span className="badge-area">{move.category}</span>
                            <span className="badge-equip">{move.durationOrReps}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddCooldownMove(move)}
                          className={`modal-card-add-btn ${isAdded ? "added" : ""}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAdded ? "Add again" : "Add"}</span>
                        </button>
                      </div>
                    );
                  })
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
