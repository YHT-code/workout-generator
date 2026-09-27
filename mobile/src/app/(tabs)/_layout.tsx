import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { useAppTheme } from '@/providers/theme-provider';

const icons: Record<string, string> = { index: '⌂', session: '▶', workouts: '≡' };

export default function TabsLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.surface,
          borderTopColor: 'transparent',
          height: 76,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, focused }) => (
          <Text style={{ color, fontSize: focused ? 24 : 21, fontWeight: '800' }}>{icons[route.name]}</Text>
        ),
      })}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="session" options={{ title: 'Session' }} />
      <Tabs.Screen name="workouts" options={{ title: 'Workouts' }} />
    </Tabs>
  );
}
