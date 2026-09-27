import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton, AppScreen, ChoiceChip, ScreenHeader, SectionHeading, typography } from '@/components/design-system';
import { spacing } from '@/constants/theme';
import {
  Equipment,
  ExperienceLevel,
  WorkoutGoal,
  WorkoutSplit,
  generateWorkout,
  workoutOptions,
} from '@/lib/workouts';
import { useAppTheme } from '@/providers/theme-provider';
import { useWorkouts } from '@/providers/workout-provider';

export default function BuildWorkoutScreen() {
  const { colors } = useAppTheme();
  const { setCurrentWorkout } = useWorkouts();
  const [split, setSplit] = useState<WorkoutSplit>('Full Body');
  const [goal, setGoal] = useState<WorkoutGoal>('Build muscle');
  const [level, setLevel] = useState<ExperienceLevel>('Beginner');
  const [equipment, setEquipment] = useState<Equipment>('Full gym');
  const [duration, setDuration] = useState(45);

  const generate = () => {
    setCurrentWorkout(generateWorkout({ split, goal, level, equipment, duration }));
    router.replace('/workout/current');
  };

  return (
    <AppScreen>
      <ScreenHeader
        eyebrow="Personalize your plan"
        title="Build workout"
        action={
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={[styles.close, { backgroundColor: colors.surface }]}>
            <Text style={[styles.closeText, { color: colors.text }]}>×</Text>
          </Pressable>
        }
      />

      <Text style={[typography.body, { color: colors.secondary }]}>Choose what fits today. You can save or repeat the generated session afterward.</Text>

      <OptionSection title="Training split">
        {workoutOptions.splits.map((option) => (
          <ChoiceChip key={option} label={option} selected={split === option} onPress={() => setSplit(option)} />
        ))}
      </OptionSection>

      <OptionSection title="Primary goal">
        {workoutOptions.goals.map((option) => (
          <ChoiceChip key={option} label={option} selected={goal === option} onPress={() => setGoal(option)} />
        ))}
      </OptionSection>

      <OptionSection title="Experience">
        {workoutOptions.levels.map((option) => (
          <ChoiceChip key={option} label={option} selected={level === option} onPress={() => setLevel(option)} />
        ))}
      </OptionSection>

      <OptionSection title="Available equipment">
        {workoutOptions.equipment.map((option) => (
          <ChoiceChip key={option} label={option} selected={equipment === option} onPress={() => setEquipment(option)} />
        ))}
      </OptionSection>

      <OptionSection title="Session length">
        {workoutOptions.durations.map((option) => (
          <ChoiceChip key={option} label={`${option} min`} selected={duration === option} onPress={() => setDuration(option)} />
        ))}
      </OptionSection>

      <AppButton label="Generate my workout" onPress={generate} />
    </AppScreen>
  );
}

function OptionSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <SectionHeading title={title} />
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  close: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 29, lineHeight: 31, fontWeight: '400' },
  section: { gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
