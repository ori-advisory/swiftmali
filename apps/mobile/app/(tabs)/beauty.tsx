import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles } from 'lucide-react-native';

export default function BeautyTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ECEAE3', alignItems: 'center', justifyContent: 'center' }}>
      <Sparkles size={56} color="#C9A84C" />
      <Text style={{ fontSize: 22, fontWeight: '800', color: '#0E0D0B', marginTop: 16 }}>SwiftBeauty</Text>
      <Text style={{ fontSize: 14, color: '#888780', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>Personal shopper beauté international.{'\n'}Disponible bientôt.</Text>
    </SafeAreaView>
  );
}
