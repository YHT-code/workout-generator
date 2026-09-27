import * as Haptics from 'expo-haptics';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { radius, spacing } from '@/constants/theme';
import { useAppTheme } from '@/providers/theme-provider';

export function AppScreen({ children, scroll = true }: PropsWithChildren<{ scroll?: boolean }>) {
  const { colors } = useAppTheme();
  const content = <View style={styles.screenContent}>{children}</View>;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function ScreenHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: colors.secondary }]}>{eyebrow}</Text> : null}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function ThemeToggle() {
  const { mode, toggleMode } = useAppTheme();
  const [position] = useState(() => new Animated.Value(mode === 'dark' ? 1 : 0));

  useEffect(() => {
    Animated.spring(position, {
      toValue: mode === 'dark' ? 1 : 0,
      stiffness: 220,
      damping: 22,
      mass: 0.75,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [mode, position]);

  const translateX = position.interpolate({ inputRange: [0, 1], outputRange: [2, 28] });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel="Toggle light and dark theme"
      accessibilityState={{ checked: mode === 'dark' }}
      onPress={toggleMode}
      style={[styles.themeTrack, { backgroundColor: mode === 'dark' ? '#253745' : '#9BA8AB' }]}>
      <Animated.View
        style={[
          styles.themeKnob,
          { backgroundColor: mode === 'dark' ? '#CCD0CF' : '#253745', transform: [{ translateX }] },
        ]}>
        <Text style={{ color: mode === 'dark' ? '#06141B' : '#CCD0CF', fontSize: 13 }}>
          {mode === 'dark' ? '☾' : '☀'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const { colors } = useAppTheme();
  return <View style={[styles.card, { backgroundColor: colors.surface }, style]}>{children}</View>;
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}) {
  const { colors } = useAppTheme();
  const backgroundColor =
    variant === 'primary' ? colors.accent : variant === 'danger' ? colors.danger : colors.elevated;
  const textColor = variant === 'primary' ? colors.onAccent : variant === 'danger' ? '#FFFFFF' : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: disabled ? 0.45 : pressed ? 0.78 : 1 },
      ]}>
      <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

export function ChoiceChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.accent : colors.surface,
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <Text style={[styles.chipText, { color: selected ? colors.onAccent : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.sectionHeading}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.body, { color: colors.secondary }]}>{subtitle}</Text> : null}
    </View>
  );
}

export function Metric({ value, label }: { value: string | number; label: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.metric, { backgroundColor: colors.surface }]}>
      <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: colors.secondary }]}>{label}</Text>
    </View>
  );
}

export const typography = StyleSheet.create({
  h1: { fontSize: 34, lineHeight: 39, fontWeight: '800', letterSpacing: -1.1 },
  h2: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.5 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 22 },
  small: { fontSize: 13, lineHeight: 18 },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  screenContent: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 116, gap: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg },
  headerText: { flex: 1, gap: 2 },
  eyebrow: { fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -0.8 },
  themeTrack: { width: 58, height: 32, borderRadius: radius.pill, justifyContent: 'center' },
  themeKnob: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  button: { minHeight: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  buttonText: { fontSize: 15, fontWeight: '800', letterSpacing: 0.2 },
  chip: { minHeight: 42, borderRadius: radius.pill, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontSize: 14, fontWeight: '700' },
  sectionHeading: { gap: spacing.xs },
  sectionTitle: { fontSize: 20, lineHeight: 26, fontWeight: '800', letterSpacing: -0.3 },
  body: { fontSize: 14, lineHeight: 20 },
  metric: { flex: 1, minHeight: 92, borderRadius: radius.md, padding: spacing.md, justifyContent: 'space-between' },
  metricValue: { fontSize: 25, fontWeight: '800' },
  metricLabel: { fontSize: 12, fontWeight: '600' },
});
