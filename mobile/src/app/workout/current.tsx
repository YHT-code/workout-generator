import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton, AppScreen, Card, ScreenHeader, typography } from '@/components/design-system';
import { radius, spacing } from '@/constants/theme';
import { useAppTheme } from '@/providers/theme-provider';
import { useWorkouts } from '@/providers/workout-provider';

export default function CurrentWorkoutScreen() {
  const { colors } = useAppTheme();
  const { currentWorkout, saveWorkout, completeWorkout } = useWorkouts();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  if (!currentWorkout) {
    return (
      <AppScreen>
        <ScreenHeader title="Workout" />
        <Card style={styles.emptyCard}>
          <Text style={[typography.h2, { color: colors.text }]}>No active workout</Text>
          <AppButton label="Build a workout" onPress={() => router.replace('/build')} />
          <AppButton label="Back to home" variant="secondary" onPress={() => router.replace('/(tabs)')} />
        </Card>
      </AppScreen>
    );
  }

  const toggleExercise = (id: string) => {
    Haptics.selectionAsync();
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const finish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeWorkout(currentWorkout);
    Alert.alert('Session complete', 'Strong work. Your completed workout has been saved.', [
      { text: 'Done', onPress: () => router.replace('/(tabs)') },
    ]);
  };

  const progress = Math.round((completed.size / currentWorkout.exercises.length) * 100);

  return (
    <AppScreen>
      <ScreenHeader
        eyebrow={`${currentWorkout.duration} min · ${currentWorkout.level}`}
        title={currentWorkout.split}
        action={
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={[styles.close, { backgroundColor: colors.surface }]}>
            <Text style={[styles.back, { color: colors.text }]}>‹</Text>
          </Pressable>
        }
      />

      <Card style={{ backgroundColor: colors.elevated }}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={[styles.label, { color: colors.secondary }]}>SESSION PROGRESS</Text>
            <Text style={[typography.h2, { color: colors.text }]}>{completed.size} of {currentWorkout.exercises.length} exercises</Text>
          </View>
          <Text style={[styles.progressValue, { color: colors.text }]}>{progress}%</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.accent }]} />
        </View>
      </Card>

      <View style={styles.list}>
        {currentWorkout.exercises.map((exercise, index) => {
          const isComplete = completed.has(exercise.id);
          return (
            <Pressable key={exercise.id} onPress={() => toggleExercise(exercise.id)}>
              {({ pressed }) => (
                <Card style={{ opacity: pressed ? 0.75 : isComplete ? 0.62 : 1 }}>
                  <View style={styles.exerciseRow}>
                    <View style={[styles.number, { backgroundColor: isComplete ? colors.accent : colors.elevated }]}>
                      <Text style={[styles.numberText, { color: isComplete ? colors.onAccent : colors.text }]}>{isComplete ? '✓' : index + 1}</Text>
                    </View>
                    <View style={styles.flex}>
                      <Text style={[typography.h3, { color: colors.text, textDecorationLine: isComplete ? 'line-through' : 'none' }]}>{exercise.name}</Text>
                      <Text style={[typography.small, { color: colors.secondary }]}>{exercise.muscle} · {exercise.equipment}</Text>
                    </View>
                  </View>
                  <View style={styles.prescription}>
                    <Text style={[styles.prescriptionText, { color: colors.text }]}>{exercise.sets} sets</Text>
                    <Text style={[styles.prescriptionText, { color: colors.text }]}>{exercise.reps} reps</Text>
                    <Text style={[styles.prescriptionText, { color: colors.text }]}>{exercise.restSeconds}s rest</Text>
                  </View>
                </Card>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.actions}>
        <AppButton label="Save workout" variant="secondary" onPress={() => saveWorkout(currentWorkout)} />
        <AppButton label={completed.size === currentWorkout.exercises.length ? 'Finish session' : 'Mark all complete'} onPress={() => {
          if (completed.size === currentWorkout.exercises.length) finish();
          else setCompleted(new Set(currentWorkout.exercises.map((exercise) => exercise.id)));
        }} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  close: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 36, lineHeight: 39 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: spacing.xs },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  progressValue: { fontSize: 24, fontWeight: '800' },
  progressTrack: { height: 8, borderRadius: radius.pill, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radius.pill },
  list: { gap: spacing.md },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  number: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  numberText: { fontSize: 15, fontWeight: '800' },
  flex: { flex: 1, gap: 2 },
  prescription: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  prescriptionText: { fontSize: 12, fontWeight: '700' },
  actions: { gap: spacing.sm },
  emptyCard: { minHeight: 300, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
});
