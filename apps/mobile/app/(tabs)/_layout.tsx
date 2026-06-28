import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { UtensilsCrossed, Bike, Briefcase, Sparkles } from 'lucide-react-native';

const GOLD = '#C9A84C';
const NEUTRAL = '#888780';

function TabIcon({ icon: Icon, focused, label }: { icon: typeof UtensilsCrossed; focused: boolean; label: string }) {
  return (
    <View className="items-center gap-0.5 pt-1">
      <Icon size={22} color={focused ? GOLD : NEUTRAL} strokeWidth={focused ? 2.5 : 1.8} />
      <Text style={{ fontSize: 10, fontWeight: focused ? '700' : '500', color: focused ? GOLD : NEUTRAL, letterSpacing: 0.2 }}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E3DC', borderTopWidth: 1, height: 72, paddingBottom: 12, paddingTop: 4 }, tabBarShowLabel: false }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon icon={UtensilsCrossed} focused={focused} label="Eats" /> }} />
      <Tabs.Screen name="deliver" options={{ tabBarIcon: ({ focused }) => <TabIcon icon={Bike} focused={focused} label="Deliver" /> }} />
      <Tabs.Screen name="biz" options={{ tabBarIcon: ({ focused }) => <TabIcon icon={Briefcase} focused={focused} label="Biz" /> }} />
      <Tabs.Screen name="beauty" options={{ tabBarIcon: ({ focused }) => <TabIcon icon={Sparkles} focused={focused} label="Beauty" /> }} />
    </Tabs>
  );
}
