import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bike } from 'lucide-react-native';

export default function DeliverTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ECEAE3', alignItems: 'center', justifyContent: 'center' }}>
      <Bike size={56} color="#C9A84C" />
      <Text style={{ fontSize: 22, fontWeight: '800', color: '#0E0D0B', marginTop: 16 }}>SwiftDeliver</Text>
      <Text style={{ fontSize: 14, color: '#888780', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>Envoyez un colis n'importe où à Bamako.{'\n'}Disponible bientôt.</Text>
    </SafeAreaView>
  );
}
