import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton, AppScreen, Card, ScreenHeader, ThemeToggle, typography } from '@/components/design-system';
import { spacing } from '@/constants/theme';
import { useAppTheme } from '@/providers/theme-provider';
import { useWorkouts } from '@/providers/workout-provider';

export default function SessionScreen() {
  const { colors } = useAppTheme();
  const { currentWorkout } = useWorkouts();

  return (
    <AppScreen>
      <ScreenHeader eyebrow="Your training" title="Session" action={<ThemeToggle />} />

      {currentWorkout ? (
        <Card style={{ backgroundColor: colors.elevated }}>
          <Text style={[styles.overline, { color: colors.secondary }]}>READY WHEN YOU ARE</Text>
          <Text style={[typography.h1, { color: colors.text }]}>{currentWorkout.title}</Text>
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: colors.text }]}>{currentWorkout.exercises.length} exercises</Text>
            <Text style={[styles.meta, { color: colors.text }]}>{currentWorkout.goal}</Text>
            <Text style={[styles.meta, { color: colors.text }]}>{currentWorkout.equipment}</Text>
          </View>
          <AppButton label="Open workout" onPress={() => router.push('/workout/current')} />
          <AppButton label="Build a different plan" variant="secondary" onPress={() => router.push('/build')} />
        </Card>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>▶</Text>
          <Text style={[typography.h2, { color: colors.text }]}>No session queued</Text>
          <Text style={[typography.body, styles.center, { color: colors.secondary }]}>Generate a workout and it will stay here, ready for your next training session.</Text>
          <AppButton label="Build a workout" onPress={() => router.push('/build')} />
        </Card>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  overline: { fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  meta: { fontSize: 12, fontWeight: '700' },
  emptyCard: { minHeight: 360, justifyContent: 'center', alignItems: 'center', gap: spacing.lg },
  emptyIcon: { fontSize: 40 },
  center: { textAlign: 'center', maxWidth: 300 },
});
