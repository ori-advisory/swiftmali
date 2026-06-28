import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2, Clock, ChefHat, Bike, Package, Star } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { fmtFCFA } from '@swiftmali/ui/tokens';
import type { Database } from '@swiftmali/supabase/src/database.types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderStatus = Order['status'];

const GOLD = '#C9A84C'; const NEUTRAL_950 = '#0E0D0B'; const NEUTRAL_400 = '#888780'; const SUCCESS = '#1A7A4A';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: 'pending',    label: 'Commande reçue',         icon: Clock },
  { status: 'confirmed',  label: 'Confirmée par le resto', icon: CheckCircle2 },
  { status: 'preparing',  label: 'En préparation',         icon: ChefHat },
  { status: 'ready',      label: 'Prête pour collecte',    icon: Package },
  { status: 'picking_up', label: 'Livreur en route',       icon: Bike },
  { status: 'delivering', label: 'En chemin vers vous',    icon: Bike },
  { status: 'delivered',  label: 'Livré !',                icon: CheckCircle2 },
];

const STATUS_IDX: Partial<Record<OrderStatus, number>> = Object.fromEntries(STATUS_STEPS.map((s, i) => [s.status, i]));

export default function TrackScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    supabase.from('orders').select('*').eq('id', orderId).single().then(({ data }) => { setOrder(data); setLoading(false); });
    const channel = supabase.channel(`order-track-${orderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, ({ new: updated }) => setOrder(updated as Order))
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [orderId]);

  if (loading) return <SafeAreaView style={{ flex: 1, backgroundColor: '#ECEAE3', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={GOLD} /></SafeAreaView>;
  if (!order) return <SafeAreaView style={{ flex: 1, backgroundColor: '#ECEAE3', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text><Text style={{ fontWeight: '800', fontSize: 18, color: NEUTRAL_950 }}>Commande introuvable</Text><TouchableOpacity onPress={() => router.push('/')} style={{ marginTop: 20 }}><Text style={{ color: GOLD, fontWeight: '700' }}>Retour à l'accueil</Text></TouchableOpacity></SafeAreaView>;

  const currentIdx = STATUS_IDX[order.status] ?? 0;
  const isDelivered = order.status === 'delivered'; const isCancelled = order.status === 'cancelled';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ECEAE3' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16, backgroundColor: NEUTRAL_950 }}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={22} color="#FFFFFF" /></TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '800', color: '#FFFFFF' }}>Suivi de commande</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Text style={{ fontSize: 64, marginBottom: 12 }}>{isDelivered ? '🎉' : isCancelled ? '😞' : '🛵'}</Text>
          <Text style={{ fontSize: 24, fontWeight: '800', color: NEUTRAL_950 }}>{isDelivered ? 'Livré !' : isCancelled ? 'Annulée' : 'En cours…'}</Text>
          <Text style={{ color: NEUTRAL_400, fontSize: 13, marginTop: 4 }}>{order.order_number}</Text>
        </View>
        {!isCancelled && (
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E5E3DC' }}>
            {STATUS_STEPS.map((step, idx) => {
              const Icon = step.icon; const isPast = idx < currentIdx; const isCurrent = idx === currentIdx;
              return (
                <View key={step.status} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: idx < STATUS_STEPS.length - 1 ? 16 : 0 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: isPast ? '#E8F5EE' : isCurrent ? GOLD : '#F7F6F2' }}>
                    <Icon size={16} color={isPast ? SUCCESS : isCurrent ? NEUTRAL_950 : '#D7D3C8'} />
                  </View>
                  <Text style={{ fontSize: 14, flex: 1, fontWeight: isCurrent ? '700' : '500', color: isPast ? '#1A7A4A' : isCurrent ? NEUTRAL_950 : NEUTRAL_400 }}>{step.label}</Text>
                  {isCurrent && <View style={{ backgroundColor: '#FDF8EC', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}><Text style={{ fontSize: 11, fontWeight: '700', color: '#A5831A' }}>En cours</Text></View>}
                </View>
              );
            })}
          </View>
        )}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E5E3DC' }}>
          <Text style={{ fontWeight: '700', fontSize: 15, color: NEUTRAL_950, marginBottom: 12 }}>Récapitulatif</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}><Text style={{ color: NEUTRAL_400, fontSize: 14 }}>Sous-total</Text><Text style={{ color: NEUTRAL_950, fontSize: 14 }}>{fmtFCFA(order.subtotal)}</Text></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 4, borderTopWidth: 1, borderTopColor: '#F7F6F2' }}><Text style={{ fontWeight: '800', color: NEUTRAL_950, fontSize: 15 }}>Total</Text><Text style={{ fontWeight: '800', color: NEUTRAL_950, fontSize: 15 }}>{fmtFCFA(order.total)}</Text></View>
        </View>
        {isDelivered && (
          <View style={{ gap: 10 }}>
            <TouchableOpacity onPress={() => router.push('/')} style={{ backgroundColor: GOLD, borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
              <Star size={16} color={NEUTRAL_950} /><Text style={{ fontWeight: '800', fontSize: 15, color: NEUTRAL_950 }}>Noter la commande</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/')} style={{ backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E3DC' }}>
              <Text style={{ fontWeight: '700', fontSize: 15, color: NEUTRAL_950 }}>Commander à nouveau</Text>
            </TouchableOpacity>
          </View>
        )}
        {!isDelivered && !isCancelled && <Text style={{ textAlign: 'center', color: NEUTRAL_400, fontSize: 12 }}>Cette page se met à jour automatiquement</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}
