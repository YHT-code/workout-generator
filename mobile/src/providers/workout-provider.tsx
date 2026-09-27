import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { readJson, writeJson } from '@/lib/storage';
import { Workout } from '@/lib/workouts';

export type BodyProfile = {
  name: string;
  weightKg: string;
  heightCm: string;
  age: string;
  activity: 'Light' | 'Moderate' | 'High';
};

const defaultProfile: BodyProfile = {
  name: '',
  weightKg: '',
  heightCm: '',
  age: '',
  activity: 'Moderate',
};

type WorkoutContextValue = {
  isReady: boolean;
  profile: BodyProfile;
  savedWorkouts: Workout[];
  currentWorkout: Workout | null;
  updateProfile: (profile: BodyProfile) => void;
  setCurrentWorkout: (workout: Workout | null) => void;
  saveWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  completeWorkout: (workout: Workout) => void;
};

const WorkoutContext = createContext<WorkoutContextValue | null>(null);
const PROFILE_KEY = 'repforge-native-profile';
const SAVED_KEY = 'repforge-native-saved';
const CURRENT_KEY = 'repforge-native-current';

export function WorkoutProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkoutState] = useState<Workout | null>(null);

  useEffect(() => {
    Promise.all([
      readJson(PROFILE_KEY, defaultProfile),
      readJson<Workout[]>(SAVED_KEY, []),
      readJson<Workout | null>(CURRENT_KEY, null),
    ]).then(([storedProfile, storedWorkouts, storedCurrent]) => {
      setProfile(storedProfile);
      setSavedWorkouts(storedWorkouts);
      setCurrentWorkoutState(storedCurrent);
      setIsReady(true);
    });
  }, []);

  const updateProfile = (next: BodyProfile) => {
    setProfile(next);
    writeJson(PROFILE_KEY, next);
  };

  const setCurrentWorkout = (workout: Workout | null) => {
    setCurrentWorkoutState(workout);
    writeJson(CURRENT_KEY, workout);
  };

  const saveWorkout = (workout: Workout) => {
    setSavedWorkouts((current) => {
      const next = [workout, ...current.filter((item) => item.id !== workout.id)];
      writeJson(SAVED_KEY, next);
      return next;
    });
  };

  const deleteWorkout = (id: string) => {
    setSavedWorkouts((current) => {
      const next = current.filter((item) => item.id !== id);
      writeJson(SAVED_KEY, next);
      return next;
    });
  };

  const completeWorkout = (workout: Workout) => {
    const completed = { ...workout, completedAt: new Date().toISOString() };
    saveWorkout(completed);
    setCurrentWorkout(null);
  };

  const value = {
    isReady,
    profile,
    savedWorkouts,
    currentWorkout,
    updateProfile,
    setCurrentWorkout,
    saveWorkout,
    deleteWorkout,
    completeWorkout,
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
}

export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkouts must be used inside WorkoutProvider');
  return context;
}
