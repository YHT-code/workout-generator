import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton, AppScreen, Card, ScreenHeader, ThemeToggle, typography } from '@/components/design-system';
import { spacing } from '@/constants/theme';
import { Workout } from '@/lib/workouts';
import { useAppTheme } from '@/providers/theme-provider';
import { useWorkouts } from '@/providers/workout-provider';

export default function WorkoutsScreen() {
  const { colors } = useAppTheme();
  const { savedWorkouts, setCurrentWorkout, deleteWorkout } = useWorkouts();

  const openWorkout = (workout: Workout) => {
    Haptics.selectionAsync();
    setCurrentWorkout(workout);
    router.push('/workout/current');
  };

  const confirmDelete = (workout: Workout) => {
    Alert.alert('Delete workout?', workout.title, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteWorkout(workout.id) },
    ]);
  };

  return (
    <AppScreen>
      <ScreenHeader eyebrow="Your library" title="Workouts" action={<ThemeToggle />} />

      {savedWorkouts.length ? (
        <View style={styles.list}>
          {savedWorkouts.map((workout) => (
            <Pressable key={workout.id} onPress={() => openWorkout(workout)} onLongPress={() => confirmDelete(workout)}>
              {({ pressed }) => (
                <Card style={{ opacity: pressed ? 0.72 : 1 }}>
                  <View style={styles.rowBetween}>
                    <View style={styles.flex}>
                      <Text style={[typography.h3, { color: colors.text }]}>{workout.title}</Text>
                      <Text style={[typography.small, { color: colors.secondary }]}>
                        {workout.exercises.length} exercises · {workout.level} · {workout.equipment}
                      </Text>
                    </View>
                    <Text style={[styles.chevron, { color: colors.secondary }]}>›</Text>
                  </View>
                  {workout.completedAt ? (
                    <Text style={[styles.complete, { color: colors.text }]}>✓ Completed</Text>
                  ) : null}
                </Card>
              )}
            </Pressable>
          ))}
          <Text style={[styles.tip, { color: colors.secondary }]}>Tip: press and hold a workout to delete it.</Text>
        </View>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>≡</Text>
          <Text style={[typography.h2, { color: colors.text }]}>Your library is empty</Text>
          <Text style={[typography.body, styles.center, { color: colors.secondary }]}>Save a generated workout to keep it available on this device.</Text>
          <AppButton label="Create first workout" onPress={() => router.push('/build')} />
        </Card>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  rowBetween: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  chevron: { fontSize: 32 },
  complete: { fontSize: 12, fontWeight: '800' },
  tip: { textAlign: 'center', fontSize: 12, marginTop: spacing.sm },
  emptyCard: { minHeight: 360, justifyContent: 'center', alignItems: 'center', gap: spacing.lg },
  emptyIcon: { fontSize: 42 },
  center: { textAlign: 'center', maxWidth: 300 },
});
