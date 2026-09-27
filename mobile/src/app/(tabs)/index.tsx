import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  AppButton,
  AppScreen,
  Card,
  Metric,
  ScreenHeader,
  SectionHeading,
  ThemeToggle,
  typography,
} from '@/components/design-system';
import { spacing } from '@/constants/theme';
import { useAppTheme } from '@/providers/theme-provider';
import { useWorkouts } from '@/providers/workout-provider';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { profile, savedWorkouts, currentWorkout } = useWorkouts();
  const completed = savedWorkouts.filter((workout) => workout.completedAt).length;
  const totalMinutes = savedWorkouts
    .filter((workout) => workout.completedAt)
    .reduce((total, workout) => total + workout.duration, 0);
  const firstName = profile.name.trim().split(' ')[0];

  return (
    <AppScreen>
      <ScreenHeader eyebrow="Workout Generator" title={firstName ? `Welcome, ${firstName}` : 'Train with intention'} action={<ThemeToggle />} />

      <Card style={{ backgroundColor: colors.elevated }}>
        <Text style={[styles.heroLabel, { color: colors.secondary }]}>TODAY&apos;S FOCUS</Text>
        <Text style={[typography.h1, { color: colors.text }]}>A better session starts with a clear plan.</Text>
        <Text style={[typography.body, { color: colors.secondary }]}>Build a routine around your time, equipment, and training goal.</Text>
        <AppButton label={currentWorkout ? 'Resume current workout' : 'Build today’s workout'} onPress={() => router.push(currentWorkout ? '/workout/current' : '/build')} />
      </Card>

      <View style={styles.metricRow}>
        <Metric value={completed} label="Sessions finished" />
        <Metric value={totalMinutes} label="Minutes trained" />
        <Metric value={savedWorkouts.length} label="Plans saved" />
      </View>

      <View style={styles.section}>
        <SectionHeading title="Quick actions" subtitle="Everything you need for the next session." />
        <View style={styles.actionGrid}>
          <Card style={styles.actionCard}>
            <Text style={styles.actionIcon}>＋</Text>
            <Text style={[typography.h3, { color: colors.text }]}>Build a session</Text>
            <Text style={[typography.small, { color: colors.secondary }]}>Generate a plan in under a minute.</Text>
            <AppButton label="Start building" variant="secondary" onPress={() => router.push('/build')} />
          </Card>
          <Card style={styles.actionCard}>
            <Text style={styles.actionIcon}>◎</Text>
            <Text style={[typography.h3, { color: colors.text }]}>Body profile</Text>
            <Text style={[typography.small, { color: colors.secondary }]}>Keep your training details current.</Text>
            <AppButton label="Update profile" variant="secondary" onPress={() => router.push('/profile')} />
          </Card>
        </View>
      </View>

      {savedWorkouts[0] ? (
        <View style={styles.section}>
          <SectionHeading title="Latest workout" />
          <Card>
            <View style={styles.rowBetween}>
              <View style={styles.flex}>
                <Text style={[typography.h3, { color: colors.text }]}>{savedWorkouts[0].title}</Text>
                <Text style={[typography.small, { color: colors.secondary }]}>
                  {savedWorkouts[0].exercises.length} exercises · {savedWorkouts[0].goal}
                </Text>
              </View>
              <Text style={[styles.duration, { color: colors.text }]}>{savedWorkouts[0].duration}m</Text>
            </View>
          </Card>
        </View>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.7 },
  metricRow: { flexDirection: 'row', gap: spacing.sm },
  section: { gap: spacing.md },
  actionGrid: { gap: spacing.md },
  actionCard: { gap: spacing.sm },
  actionIcon: { fontSize: 28 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  duration: { fontSize: 22, fontWeight: '800' },
});
