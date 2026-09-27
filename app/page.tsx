"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bookmark, Check, ChevronRight, Clock3, Copy, Dumbbell, Flame, Printer, RefreshCw, Sparkles, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import exerciseData from "@/data/exercises.json";
import { SiteHeader } from "@/components/site-header";
import { InformationPane, type PageModuleId, type WorkoutSplitId } from "@/components/information-pane";
import { DashboardView } from "@/components/dashboard-view";
import { BodyInfoView } from "@/components/body-info-view";
import { ReadyToMoveView, type Workout, type WorkoutMove } from "@/components/ready-to-move-view";
import { EmptyModuleView } from "@/components/empty-module-view";

type Choice = { value: string; label: string };
type Exercise = { name: string; area: "full" | "upper" | "lower" | "core"; equipment: "none" | "dumbbells" | "gym"; level: "beginner" | "intermediate" | "advanced"; strength: boolean; note: string; muscles?: string[] };

const SPLITS: Choice[] = [
  { value: "ppl", label: "PPL" },
  { value: "upper-lower", label: "Upper/Lower" },
  { value: "bro-split", label: "Bro split" },
  { value: "full-body", label: "Full body" },
  { value: "custom", label: "Customize" },
];

const PPL_FOCUS: Choice[] = [
  { value: "push", label: "Push (Chest/Delts/Tri)" },
  { value: "pull", label: "Pull (Back/Biceps)" },
  { value: "legs", label: "Legs (Quads/Hamstrings)" },
];

const UPPER_LOWER_FOCUS: Choice[] = [
  { value: "upper", label: "Upper body" },
  { value: "lower", label: "Lower body" },
];

const BRO_FOCUS: Choice[] = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "arms", label: "Arms" },
  { value: "legs", label: "Legs" },
];

const GOALS: Choice[] = [{ value: "strength", label: "Strength" }, { value: "fat-loss", label: "Fat loss" }, { value: "endurance", label: "Endurance" }, { value: "general", label: "General fitness" }];
const EQUIPMENT: Choice[] = [{ value: "none", label: "Bodyweight" }, { value: "dumbbells", label: "Dumbbells" }, { value: "gym", label: "Full gym" }];
const LEVELS: Choice[] = [{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "advanced", label: "Advanced" }];
const DURATIONS = [10, 20, 30, 45, 60];

const EXERCISES: Exercise[] = [
  { name: "Tempo push-up", area: "upper", equipment: "none", level: "beginner", strength: true, note: "Lower for 3 seconds, then press away." },
  { name: "Pike push-up", area: "upper", equipment: "none", level: "intermediate", strength: true, note: "Drive the crown of your head toward the floor." },
  { name: "Diamond push-up", area: "upper", equipment: "none", level: "advanced", strength: true, note: "Keep elbows close and hips level." },
  { name: "Bodyweight squat", area: "lower", equipment: "none", level: "beginner", strength: true, note: "Sit between your heels and stand tall." },
  { name: "Reverse lunge", area: "lower", equipment: "none", level: "beginner", strength: true, note: "Step back softly and drive through the front foot." },
  { name: "Split squat", area: "lower", equipment: "none", level: "intermediate", strength: true, note: "Drop straight down with a tall torso." },
  { name: "Skater squat", area: "lower", equipment: "none", level: "advanced", strength: true, note: "Control the descent on one leg." },
  { name: "Forearm plank", area: "core", equipment: "none", level: "beginner", strength: false, note: "Brace as if preparing for a punch." },
  { name: "Dead bug", area: "core", equipment: "none", level: "beginner", strength: false, note: "Keep the low back gently pressed down." },
  { name: "Hollow body hold", area: "core", equipment: "none", level: "intermediate", strength: false, note: "Shorten the lever if your back lifts." },
  { name: "V-up", area: "core", equipment: "none", level: "advanced", strength: false, note: "Reach hands and feet together with control." },
  { name: "Mountain climber", area: "full", equipment: "none", level: "beginner", strength: false, note: "Keep shoulders stacked over wrists." },
  { name: "Squat thrust", area: "full", equipment: "none", level: "intermediate", strength: false, note: "Step or jump back without dropping the hips." },
  { name: "Burpee", area: "full", equipment: "none", level: "advanced", strength: false, note: "Move smoothly and land quietly." },
  { name: "Dumbbell floor press", area: "upper", equipment: "dumbbells", level: "beginner", strength: true, note: "Pause the upper arms lightly on the floor." },
  { name: "One-arm dumbbell row", area: "upper", equipment: "dumbbells", level: "beginner", strength: true, note: "Pull your elbow toward your back pocket." },
  { name: "Arnold press", area: "upper", equipment: "dumbbells", level: "intermediate", strength: true, note: "Rotate smoothly without leaning back." },
  { name: "Renegade row", area: "upper", equipment: "dumbbells", level: "advanced", strength: true, note: "Widen your feet and keep hips square." },
  { name: "Goblet squat", area: "lower", equipment: "dumbbells", level: "beginner", strength: true, note: "Keep the weight close to your chest." },
  { name: "Dumbbell Romanian deadlift", area: "lower", equipment: "dumbbells", level: "beginner", strength: true, note: "Push the hips back with a long spine." },
  { name: "Dumbbell reverse lunge", area: "lower", equipment: "dumbbells", level: "intermediate", strength: true, note: "Keep most of your weight over the front leg." },
  { name: "Dumbbell thruster", area: "full", equipment: "dumbbells", level: "intermediate", strength: false, note: "Use leg drive to send the weights overhead." },
  { name: "Dumbbell snatch", area: "full", equipment: "dumbbells", level: "advanced", strength: false, note: "Keep the weight close and finish tall." },
  { name: "Suitcase march", area: "core", equipment: "dumbbells", level: "beginner", strength: false, note: "Resist leaning toward the weight." },
  { name: "Dumbbell dead bug", area: "core", equipment: "dumbbells", level: "intermediate", strength: false, note: "Hold one weight over the chest as limbs extend." },
  { name: "Chest press", area: "upper", equipment: "gym", level: "beginner", strength: true, note: "Set the handles at mid-chest and press evenly." },
  { name: "Lat pulldown", area: "upper", equipment: "gym", level: "beginner", strength: true, note: "Pull elbows down without swinging." },
  { name: "Cable face pull", area: "upper", equipment: "gym", level: "intermediate", strength: true, note: "Finish with hands beside your temples." },
  { name: "Barbell bench press", area: "upper", equipment: "gym", level: "intermediate", strength: true, note: "Keep feet planted and shoulder blades set." },
  { name: "Assisted pull-up", area: "upper", equipment: "gym", level: "intermediate", strength: true, note: "Lead with the chest and lower fully." },
  { name: "Barbell back squat", area: "lower", equipment: "gym", level: "intermediate", strength: true, note: "Brace before each rep and track knees over toes." },
  { name: "Leg press", area: "lower", equipment: "gym", level: "beginner", strength: true, note: "Lower only as far as your pelvis stays planted." },
  { name: "Cable pull-through", area: "lower", equipment: "gym", level: "beginner", strength: true, note: "Hinge back, then squeeze the glutes through." },
  { name: "Barbell deadlift", area: "full", equipment: "gym", level: "advanced", strength: true, note: "Push the floor away and keep the bar close." },
  { name: "Sled push", area: "full", equipment: "gym", level: "intermediate", strength: false, note: "Use short, powerful steps with a rigid trunk." },
  { name: "Cable woodchop", area: "core", equipment: "gym", level: "intermediate", strength: false, note: "Rotate through the upper back, not the knees." },
];

const ALL_EXERCISES = Array.from(
  new Map([...(exerciseData as Exercise[]), ...EXERCISES].map((move) => [move.name, move])).values(),
);
const STARTER_MOVES: WorkoutMove[] = ["Tempo push-up", "Bodyweight squat", "Reverse lunge", "Forearm plank"].map((name) => ({
  ...ALL_EXERCISES.find((move) => move.name === name)!, sets: 3, reps: "10–12", rest: 40,
}));

function labelFor(options: Choice[], value: string) { return options.find((item) => item.value === value)?.label ?? value; }

function OptionGroup({ label, value, options, onChange }: { label: string; value: string; options: Choice[]; onChange: (value: string) => void }) {
  return <fieldset className="space-y-3"><legend className="field-label">{label}</legend><RadioGroup value={value} onValueChange={onChange} className="option-grid">{options.map((option) => <label key={option.value} className="option-card"><RadioGroupItem value={option.value} className="sr-only" /><span>{option.label}</span></label>)}</RadioGroup></fieldset>;
}

function matchesSplit(move: Exercise, split: WorkoutSplitId, focus: string): boolean {
  if (split === "full-body" || split === "custom") return true;
  const muscles = move.muscles || [];
  const area = move.area;
  const name = move.name.toLowerCase();

  if (split === "ppl") {
    if (focus === "push") {
      return (
        muscles.some((m) => ["chest", "triceps", "shoulders", "upper chest"].includes(m)) ||
        name.includes("push") ||
        name.includes("press")
      );
    }
    if (focus === "pull") {
      return (
        muscles.some((m) => ["back", "lats", "biceps", "rear shoulders", "upper back"].includes(m)) ||
        name.includes("pull") ||
        name.includes("row")
      );
    }
    if (focus === "legs") {
      return area === "lower" || muscles.some((m) => ["quads", "glutes", "hamstrings", "calves", "adductors"].includes(m));
    }
  }

  if (split === "upper-lower") {
    if (focus === "upper") {
      return area === "upper" || muscles.some((m) => ["chest", "triceps", "shoulders", "back", "lats", "biceps", "arms"].includes(m));
    }
    if (focus === "lower") {
      return area === "lower" || muscles.some((m) => ["quads", "glutes", "hamstrings", "calves", "adductors"].includes(m));
    }
  }

  if (split === "bro-split") {
    if (focus === "chest") return muscles.some((m) => ["chest", "upper chest"].includes(m)) || name.includes("bench") || name.includes("push-up") || name.includes("fly");
    if (focus === "back") return muscles.some((m) => ["back", "lats", "upper back"].includes(m)) || name.includes("row") || name.includes("pulldown") || name.includes("pull-up");
    if (focus === "shoulders") return muscles.some((m) => ["shoulders", "rear shoulders"].includes(m)) || name.includes("press") || name.includes("face pull");
    if (focus === "arms") return muscles.some((m) => ["biceps", "triceps", "arms"].includes(m)) || name.includes("diamond") || name.includes("curl") || name.includes("push-up");
    if (focus === "legs") return area === "lower" || muscles.some((m) => ["quads", "glutes", "hamstrings", "calves"].includes(m));
  }

  return true;
}

function buildWorkout(
  goal: string,
  equipment: string,
  duration: number,
  level: string,
  split: WorkoutSplitId,
  splitFocus: string,
  previous: string[]
) {
  const availableEquipment = equipment === "gym" ? ["none", "dumbbells", "gym"] : equipment === "dumbbells" ? ["none", "dumbbells"] : ["none"];
  let pool = ALL_EXERCISES.filter((move) => availableEquipment.includes(move.equipment) && matchesSplit(move, split, splitFocus));
  if (pool.length < 3) {
    pool = ALL_EXERCISES.filter((move) => availableEquipment.includes(move.equipment));
  }
  const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 } as const;
  const filteredByLevel = pool.filter((move) => levelOrder[move.level] <= levelOrder[level as keyof typeof levelOrder]);
  if (filteredByLevel.length >= 3) pool = filteredByLevel;

  if (goal === "strength") pool.sort((a, b) => Number(b.strength) - Number(a.strength));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const desired = Math.max(3, Math.min(8, Math.round(duration / 7)));
  let selected = shuffled.filter((move) => !previous.includes(move.name)).slice(0, desired);
  if (selected.length < desired) selected = [...selected, ...shuffled.filter((move) => !selected.includes(move))].slice(0, desired);
  const sets = duration <= 10 ? 2 : duration <= 30 ? 3 : 4;
  const reps = goal === "strength" ? "6–10" : goal === "endurance" ? "40 sec" : goal === "fat-loss" ? "35 sec" : "10–12";
  const rest = goal === "strength" ? 75 : goal === "endurance" ? 25 : 40;
  return selected.map((move) => ({ ...move, sets, reps, rest }));
}

export default function Home() {
  const [currentModule, setCurrentModule] = useState<PageModuleId>("home");
  const [split, setSplit] = useState<WorkoutSplitId>("full-body");
  const [splitFocus, setSplitFocus] = useState<string>("all");
  const [goal, setGoal] = useState("general");
  const [equipment, setEquipment] = useState("none");
  const [duration, setDuration] = useState(30);
  const [level, setLevel] = useState("beginner");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastNames = useRef<string[]>([]);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const totalSets = useMemo(() => workout ? workout.exercises.reduce((sum, move) => sum + move.sets, 0) : 0, [workout]);

  function handleSplitSelect(newSplit: string) {
    const s = newSplit as WorkoutSplitId;
    setSplit(s);
    if (s === "custom") {
      setSplitFocus("custom");
      const moves = buildWorkout(goal, equipment, duration, level, "custom", "all", lastNames.current);
      lastNames.current = moves.map((move) => move.name);
      const defaultWarmup = duration === 10 ? ["Fast march · 45 sec", "Squat to reach · 45 sec"] : ["Fast march + arm circles · 60 sec", "Squat to reach · 60 sec", "Walkout · 60 sec"];
      const defaultCooldown = duration === 10 ? ["Slow breathing + forward fold · 60 sec"] : ["Child’s pose · 45 sec", "Half-kneeling hip stretch · 45 sec / side"];
      setWorkout({
        id: `${Date.now()}`,
        title: `${duration}-minute Custom personalized session`,
        duration,
        level: labelFor(LEVELS, level),
        equipment: labelFor(EQUIPMENT, equipment),
        warmup: defaultWarmup,
        exercises: moves,
        cooldown: defaultCooldown,
        recommendedExercises: moves.map((m) => ({ ...m })),
        recommendedWarmup: [...defaultWarmup],
        recommendedCooldown: [...defaultCooldown],
      });
      setSaved(false);
      setCurrentModule("ready-to-move");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    if (s === "ppl") setSplitFocus("push");
    else if (s === "upper-lower") setSplitFocus("upper");
    else if (s === "bro-split") setSplitFocus("chest");
    else setSplitFocus("all");
  }

  function handleModuleSelect(moduleId: PageModuleId, selectedSplit?: WorkoutSplitId) {
    setCurrentModule(moduleId);
    if (selectedSplit) {
      handleSplitSelect(selectedSplit);
    }
  }

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const registration = context.registerTool({
      name: "generate_workout",
      title: "Generate workout",
      description: "Generate a workout and show it in RepForge using the requested goal, equipment, duration, level, and workout split.",
      inputSchema: { type:"object", properties:{ goal:{type:"string",enum:GOALS.map((item)=>item.value)}, equipment:{type:"string",enum:EQUIPMENT.map((item)=>item.value)}, duration:{type:"number",enum:DURATIONS}, level:{type:"string",enum:LEVELS.map((item)=>item.value)}, split:{type:"string",enum:SPLITS.map((item)=>item.value)} }, required:["goal","equipment","duration","level"], additionalProperties:false },
      annotations: { readOnlyHint:false, untrustedContentHint:false },
      execute(input) {
        if (!input || typeof input !== "object") throw new Error("Workout settings are required.");
        const request = input as {goal:string;equipment:string;duration:number;level:string;split?:WorkoutSplitId};
        setGoal(request.goal); setEquipment(request.equipment); setDuration(request.duration); setLevel(request.level);
        const activeSplit = request.split || "full-body";
        const moves=buildWorkout(request.goal,request.equipment,request.duration,request.level,activeSplit,"all",lastNames.current); lastNames.current=moves.map((move)=>move.name);
        const defaultWarmup = request.duration === 10 ? ["Fast march · 45 sec", "Squat to reach · 45 sec"] : ["Fast march + arm circles · 60 sec", "Squat to reach · 60 sec", "Walkout · 60 sec"];
        const defaultCooldown = request.duration === 10 ? ["Slow breathing + forward fold · 60 sec"] : ["Child’s pose · 45 sec", "Half-kneeling hip stretch · 45 sec / side"];
        const next={id:`${Date.now()}`,title:`${request.duration}-minute ${labelFor(SPLITS, activeSplit)} ${labelFor(GOALS,request.goal).toLowerCase()}`,duration:request.duration,level:labelFor(LEVELS,request.level),equipment:labelFor(EQUIPMENT,request.equipment),warmup:defaultWarmup,exercises:moves,cooldown:defaultCooldown,recommendedExercises:moves.map((m)=>({...m})),recommendedWarmup:[...defaultWarmup],recommendedCooldown:[...defaultCooldown]};
        setWorkout(next); setSaved(false);
        setCurrentModule("ready-to-move");
        return {id:next.id,title:next.title,exerciseCount:moves.length};
      },
    },{signal:lifecycle.signal});
    void Promise.resolve(registration).catch(()=>{});
    return ()=>lifecycle.abort();
  }, []);

  function generate() {
    const moves = buildWorkout(goal, equipment, duration, level, split, splitFocus, lastNames.current);
    lastNames.current = moves.map((move) => move.name);

    const splitLabel = labelFor(SPLITS, split);
    const focusLabel =
      split === "ppl" ? labelFor(PPL_FOCUS, splitFocus) :
      split === "upper-lower" ? labelFor(UPPER_LOWER_FOCUS, splitFocus) :
      split === "bro-split" ? labelFor(BRO_FOCUS, splitFocus) : "";

    const titleSuffix = focusLabel ? `${splitLabel} (${focusLabel})` : splitLabel;

    const defaultWarmup = duration === 10 ? ["Fast march · 45 sec", "Squat to reach · 45 sec"] : ["Fast march + arm circles · 60 sec", "Squat to reach · 60 sec", "Walkout · 60 sec"];
    const defaultCooldown = duration === 10 ? ["Slow breathing + forward fold · 60 sec"] : ["Child’s pose · 45 sec", "Half-kneeling hip stretch · 45 sec / side"];

    setWorkout({
      id: `${Date.now()}`,
      title: `${duration}-minute ${titleSuffix} ${labelFor(GOALS, goal).toLowerCase()}`,
      duration,
      level: labelFor(LEVELS, level),
      equipment: labelFor(EQUIPMENT, equipment),
      warmup: defaultWarmup,
      exercises: moves,
      cooldown: defaultCooldown,
      recommendedExercises: moves.map((m) => ({ ...m })),
      recommendedWarmup: [...defaultWarmup],
      recommendedCooldown: [...defaultCooldown],
    });
    setSaved(false);
    setCurrentModule("ready-to-move");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  function handleDiscard() {
    setCurrentModule("build-session");
  }
  function saveWorkout() { if (!workout) return; const existing = JSON.parse(localStorage.getItem("repforge-saved") || "[]") as Workout[]; localStorage.setItem("repforge-saved", JSON.stringify([workout, ...existing.filter((item) => item.id !== workout.id)])); setSaved(true); }
  function handleSaveWorkoutAndGoHome() {
    saveWorkout();
    setCurrentModule("home");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  async function copyWorkout() { if (!workout) return; const text = [workout.title, ...workout.warmup, ...workout.exercises.map((move) => `${move.name}: ${move.sets} × ${move.reps}, ${move.rest}s rest`), ...workout.cooldown].join("\n"); await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }

  return <main>
    <div className="print:hidden"><SiteHeader /></div>
    <InformationPane currentModule={currentModule} onSelectModule={handleModuleSelect} activeSplit={split} />

    {(currentModule === "home" || currentModule === "dashboard") && (
      <DashboardView onNavigate={setCurrentModule} />
    )}

    {(currentModule === "profile" || currentModule === "body-info") && (
      <BodyInfoView onNavigateToBuilder={() => setCurrentModule("build-session")} />
    )}

    {currentModule === "session" && (
      <EmptyModuleView moduleKey="session" onBackToHome={() => setCurrentModule("home")} />
    )}

    {currentModule === "list-of-workout" && (
      <EmptyModuleView moduleKey="list-of-workout" onBackToHome={() => setCurrentModule("home")} />
    )}

    {currentModule === "ready-to-move" && (
      <ReadyToMoveView
        workout={workout}
        totalSets={totalSets}
        saved={saved}
        copied={copied}
        onNavigateToBuilder={() => setCurrentModule("build-session")}
        onRegenerate={generate}
        onSave={saveWorkout}
        onCopy={copyWorkout}
        onUpdateWorkout={setWorkout}
        onDiscard={handleDiscard}
        onNavigateToHome={() => setCurrentModule("home")}
        onSaveWorkoutAndGoHome={handleSaveWorkoutAndGoHome}
      />
    )}

    {currentModule === "build-session" && (
      <>
        <section className="intro print:hidden">
          <div>
            <p className="eyebrow"><span /> MODULE 03 · BUILD YOUR SESSION</p>
            <h1>YOUR NEXT WORKOUT<br /><em>NO GUESSWORK</em></h1>
          </div>
          <p>Pick what you have. Tell us how long. Get a complete session you can start now.</p>
        </section>
        <div className="generator-shell">
          <section className="controls-panel print:hidden" aria-labelledby="builder-title">
            <div className="panel-heading">
              <div><span>03</span><h2 id="builder-title">Build your session</h2></div>
              <p>Customize your split & routine</p>
            </div>
            <div className="control-stack">
              <OptionGroup label="Workout split" value={split} options={SPLITS} onChange={handleSplitSelect} />

              {split === "ppl" && (
                <OptionGroup label="PPL Day Focus" value={splitFocus} options={PPL_FOCUS} onChange={setSplitFocus} />
              )}
              {split === "upper-lower" && (
                <OptionGroup label="Target Region" value={splitFocus} options={UPPER_LOWER_FOCUS} onChange={setSplitFocus} />
              )}
              {split === "bro-split" && (
                <OptionGroup label="Target Muscle Group" value={splitFocus} options={BRO_FOCUS} onChange={setSplitFocus} />
              )}

              <OptionGroup label="Training goal" value={goal} options={GOALS} onChange={setGoal} />
              <OptionGroup label="Equipment" value={equipment} options={EQUIPMENT} onChange={setEquipment} />
              <fieldset className="space-y-3">
                <legend className="field-label">Time available</legend>
                <div className="duration-grid">
                  {DURATIONS.map((minutes) => (
                    <button key={minutes} type="button" onClick={() => setDuration(minutes)} className={duration === minutes ? "active" : ""} aria-pressed={duration === minutes}>
                      <strong>{minutes}</strong><span>MIN</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <OptionGroup label="Fitness level" value={level} options={LEVELS} onChange={setLevel} />
            </div>
            <Button onClick={generate} size="lg" className="generate-button">
              <Sparkles aria-hidden="true" /> Generate workout <ChevronRight aria-hidden="true" />
            </Button>
            <p className="disclaimer-note">General fitness suggestions only — not medical advice. <Link href="/disclaimer">Read the safety note.</Link></p>
          </section>
        </div>
      </>
    )}
  </main>;
}
