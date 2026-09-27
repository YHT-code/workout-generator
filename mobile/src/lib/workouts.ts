export type WorkoutSplit = 'Push Pull Legs' | 'Upper Lower' | 'Full Body' | 'Strength' | 'Quick Session';
export type WorkoutGoal = 'Build muscle' | 'Get stronger' | 'Improve fitness';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type Equipment = 'Full gym' | 'Dumbbells' | 'Bodyweight';

export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  equipment: Exclude<Equipment, 'Full gym'> | 'Barbell' | 'Machine';
  sets: number;
  reps: string;
  restSeconds: number;
};

export type Workout = {
  id: string;
  title: string;
  split: WorkoutSplit;
  goal: WorkoutGoal;
  level: ExperienceLevel;
  equipment: Equipment;
  duration: number;
  exercises: Exercise[];
  createdAt: string;
  completedAt?: string;
};

export type WorkoutConfig = Pick<Workout, 'split' | 'goal' | 'level' | 'equipment' | 'duration'>;

type ExerciseSeed = Omit<Exercise, 'id' | 'sets' | 'reps' | 'restSeconds'> & { groups: WorkoutSplit[] };

const exercisePool: ExerciseSeed[] = [
  { name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', groups: ['Push Pull Legs', 'Upper Lower', 'Strength'] },
  { name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbells', groups: ['Push Pull Legs', 'Upper Lower', 'Full Body'] },
  { name: 'Push-Up', muscle: 'Chest', equipment: 'Bodyweight', groups: ['Push Pull Legs', 'Full Body', 'Quick Session'] },
  { name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell', groups: ['Push Pull Legs', 'Upper Lower', 'Strength'] },
  { name: 'Dumbbell Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbells', groups: ['Push Pull Legs', 'Upper Lower', 'Quick Session'] },
  { name: 'Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbells', groups: ['Push Pull Legs', 'Upper Lower'] },
  { name: 'Triceps Dip', muscle: 'Triceps', equipment: 'Bodyweight', groups: ['Push Pull Legs', 'Upper Lower', 'Quick Session'] },
  { name: 'Lat Pulldown', muscle: 'Back', equipment: 'Machine', groups: ['Push Pull Legs', 'Upper Lower'] },
  { name: 'Pull-Up', muscle: 'Back', equipment: 'Bodyweight', groups: ['Push Pull Legs', 'Upper Lower', 'Full Body'] },
  { name: 'Barbell Row', muscle: 'Back', equipment: 'Barbell', groups: ['Push Pull Legs', 'Upper Lower', 'Strength'] },
  { name: 'One-Arm Dumbbell Row', muscle: 'Back', equipment: 'Dumbbells', groups: ['Push Pull Legs', 'Upper Lower', 'Full Body'] },
  { name: 'Biceps Curl', muscle: 'Biceps', equipment: 'Dumbbells', groups: ['Push Pull Legs', 'Upper Lower', 'Quick Session'] },
  { name: 'Back Squat', muscle: 'Quads', equipment: 'Barbell', groups: ['Push Pull Legs', 'Upper Lower', 'Full Body', 'Strength'] },
  { name: 'Goblet Squat', muscle: 'Quads', equipment: 'Dumbbells', groups: ['Push Pull Legs', 'Upper Lower', 'Full Body', 'Quick Session'] },
  { name: 'Bodyweight Squat', muscle: 'Quads', equipment: 'Bodyweight', groups: ['Push Pull Legs', 'Full Body', 'Quick Session'] },
  { name: 'Romanian Deadlift', muscle: 'Hamstrings', equipment: 'Barbell', groups: ['Push Pull Legs', 'Upper Lower', 'Full Body', 'Strength'] },
  { name: 'Dumbbell Romanian Deadlift', muscle: 'Hamstrings', equipment: 'Dumbbells', groups: ['Push Pull Legs', 'Upper Lower', 'Full Body'] },
  { name: 'Walking Lunge', muscle: 'Glutes', equipment: 'Dumbbells', groups: ['Push Pull Legs', 'Upper Lower', 'Full Body', 'Quick Session'] },
  { name: 'Reverse Lunge', muscle: 'Glutes', equipment: 'Bodyweight', groups: ['Push Pull Legs', 'Full Body', 'Quick Session'] },
  { name: 'Deadlift', muscle: 'Posterior chain', equipment: 'Barbell', groups: ['Full Body', 'Strength'] },
  { name: 'Plank', muscle: 'Core', equipment: 'Bodyweight', groups: ['Full Body', 'Quick Session'] },
  { name: 'Dead Bug', muscle: 'Core', equipment: 'Bodyweight', groups: ['Full Body', 'Quick Session'] },
  { name: 'Mountain Climber', muscle: 'Conditioning', equipment: 'Bodyweight', groups: ['Full Body', 'Quick Session'] },
  { name: 'Dumbbell Thruster', muscle: 'Full body', equipment: 'Dumbbells', groups: ['Full Body', 'Quick Session'] },
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

function prescription(goal: WorkoutGoal, level: ExperienceLevel) {
  const levelBonus = level === 'Advanced' ? 1 : 0;
  if (goal === 'Get stronger') return { sets: 4 + levelBonus, reps: '4–6', restSeconds: 150 };
  if (goal === 'Improve fitness') return { sets: 3 + levelBonus, reps: '12–16', restSeconds: 45 };
  return { sets: 3 + levelBonus, reps: '8–12', restSeconds: 75 };
}

export function generateWorkout(config: WorkoutConfig): Workout {
  const exerciseCount = config.duration <= 25 ? 4 : config.duration <= 45 ? 6 : 8;
  const equipmentMatches = (exercise: ExerciseSeed) =>
    config.equipment === 'Full gym' || exercise.equipment === config.equipment || exercise.equipment === 'Bodyweight';
  let candidates = exercisePool.filter(
    (exercise) => exercise.groups.includes(config.split) && equipmentMatches(exercise),
  );

  if (candidates.length < exerciseCount) {
    candidates = [
      ...candidates,
      ...exercisePool.filter((exercise) => equipmentMatches(exercise) && !candidates.includes(exercise)),
    ];
  }

  const plan = prescription(config.goal, config.level);
  const exercises = shuffle(candidates)
    .slice(0, exerciseCount)
    .map((exercise, index) => ({ ...exercise, ...plan, id: `${Date.now()}-${index}` }));

  return {
    ...config,
    id: String(Date.now()),
    title: `${config.split} · ${config.duration} min`,
    exercises,
    createdAt: new Date().toISOString(),
  };
}

export const workoutOptions = {
  splits: ['Push Pull Legs', 'Upper Lower', 'Full Body', 'Strength', 'Quick Session'] as WorkoutSplit[],
  goals: ['Build muscle', 'Get stronger', 'Improve fitness'] as WorkoutGoal[],
  levels: ['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[],
  equipment: ['Full gym', 'Dumbbells', 'Bodyweight'] as Equipment[],
  durations: [20, 30, 45, 60],
};
