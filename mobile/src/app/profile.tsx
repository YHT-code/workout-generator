import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton, AppScreen, ChoiceChip, ScreenHeader, SectionHeading, typography } from '@/components/design-system';
import { radius, spacing } from '@/constants/theme';
import { useAppTheme } from '@/providers/theme-provider';
import { BodyProfile, useWorkouts } from '@/providers/workout-provider';

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const { profile, updateProfile } = useWorkouts();
  const [form, setForm] = useState<BodyProfile>(profile);
  const bmi = useMemo(() => {
    const weight = Number(form.weightKg);
    const height = Number(form.heightCm) / 100;
    if (!weight || !height) return null;
    return (weight / (height * height)).toFixed(1);
  }, [form.heightCm, form.weightKg]);

  const setField = <K extends keyof BodyProfile>(key: K, value: BodyProfile[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = () => {
    updateProfile(form);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Profile saved', 'Your body information is stored securely on this device.', [
      { text: 'Done', onPress: () => router.back() },
    ]);
  };

  return (
    <AppScreen>
      <ScreenHeader
        eyebrow="Personal details"
        title="Body profile"
        action={
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={[styles.close, { backgroundColor: colors.surface }]}>
            <Text style={[styles.back, { color: colors.text }]}>‹</Text>
          </Pressable>
        }
      />

      {bmi ? (
        <View style={[styles.bmiCard, { backgroundColor: colors.elevated }]}>
          <View>
            <Text style={[styles.label, { color: colors.secondary }]}>ESTIMATED BMI</Text>
            <Text style={[styles.bmi, { color: colors.text }]}>{bmi}</Text>
          </View>
          <Text style={[typography.small, styles.bmiCopy, { color: colors.secondary }]}>A general reference only—not a medical assessment.</Text>
        </View>
      ) : null}

      <View style={styles.formSection}>
        <SectionHeading title="About you" />
        <Field label="Name" value={form.name} onChangeText={(value) => setField('name', value)} placeholder="Your name" />
        <View style={styles.twoColumns}>
          <Field label="Weight (kg)" value={form.weightKg} onChangeText={(value) => setField('weightKg', value)} keyboardType="decimal-pad" placeholder="70" containerStyle={styles.flex} />
          <Field label="Height (cm)" value={form.heightCm} onChangeText={(value) => setField('heightCm', value)} keyboardType="number-pad" placeholder="175" containerStyle={styles.flex} />
        </View>
        <Field label="Age" value={form.age} onChangeText={(value) => setField('age', value)} keyboardType="number-pad" placeholder="28" />
      </View>

      <View style={styles.formSection}>
        <SectionHeading title="Activity level" subtitle="Your typical weekly movement outside planned workouts." />
        <View style={styles.chips}>
          {(['Light', 'Moderate', 'High'] as BodyProfile['activity'][]).map((option) => (
            <ChoiceChip key={option} label={option} selected={form.activity === option} onPress={() => setField('activity', option)} />
          ))}
        </View>
      </View>

      <AppButton label="Save profile" onPress={save} />
    </AppScreen>
  );
}

function Field({ label, containerStyle, ...props }: React.ComponentProps<typeof TextInput> & { label: string; containerStyle?: object }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={colors.secondary}
        selectionColor={colors.accent}
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  close: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 36, lineHeight: 39 },
  bmiCard: { borderRadius: radius.lg, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  bmi: { fontSize: 38, fontWeight: '800' },
  bmiCopy: { flex: 1 },
  formSection: { gap: spacing.md },
  field: { gap: spacing.sm },
  fieldLabel: { fontSize: 13, fontWeight: '700' },
  input: { height: 52, borderRadius: radius.md, paddingHorizontal: spacing.lg, fontSize: 16 },
  twoColumns: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
