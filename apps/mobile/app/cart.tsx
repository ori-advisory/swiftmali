import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react-native';
import { useCartStore } from '@/lib/cart-store';
import { supabase } from '@/lib/supabase';
import { fmtFCFA, PAYMENT_METHODS, type PaymentMethod } from '@swiftmali/ui/tokens';

const GOLD = '#C9A84C'; const NEUTRAL_950 = '#0E0D0B'; const NEUTRAL_400 = '#888780'; const DELIVERY_FEE = 500;

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('orange_money');
  const [commune, setCommune] = useState(''); const [address, setAddress] = useState(''); const [loading, setLoading] = useState(false);
  const sub = subtotal(); const total = sub + DELIVERY_FEE;

  async function handleOrder() {
    if (!address || !commune) { Alert.alert('Adresse manquante', 'Veuillez renseigner votre adresse de livraison.'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { Alert.alert('Connexion requise', 'Veuillez vous connecter pour passer commande.'); router.push('/auth'); return; }
    setLoading(true);
    try {
      const { data: order, error } = await supabase.from('orders').insert({
        customer_id: user.id, restaurant_id: items[0]!.restaurantId, status: 'pending',
        subtotal: sub, delivery_fee: DELIVERY_FEE, total, payment_method: paymentMethod,
        payment_status: 'pending', delivery_address: address, delivery_commune: commune,
      }).select().single();
      if (error || !order) throw error;
      await supabase.from('order_items').insert(items.map((i) => ({ order_id: order.id, menu_item_id: i.id, name: i.name, price: i.price, quantity: i.quantity })));
      clearCart();
      router.replace(`/track/${order.id}`);
    } catch { Alert.alert('Erreur', 'Impossible de créer la commande. Réessayez.'); }
    finally { setLoading(false); }
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ECEAE3', alignItems: 'center', justifyContent: 'center' }}>
        <ShoppingBag size={56} color="#E5E3DC" />
        <Text style={{ fontSize: 20, fontWeight: '800', color: NEUTRAL_950, marginTop: 16 }}>Panier vide</Text>
        <Text style={{ color: NEUTRAL_400, marginTop: 8, textAlign: 'center' }}>Ajoutez des plats depuis un restaurant.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24, backgroundColor: GOLD, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 }}>
          <Text style={{ fontWeight: '700', fontSize: 15, color: NEUTRAL_950 }}>Parcourir les restaurants</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ECEAE3' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E3DC' }}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={22} color={NEUTRAL_950} /></TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: NEUTRAL_950 }}>Votre panier</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E3DC' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F7F6F2' }}>
            <Text style={{ fontWeight: '700', fontSize: 15, color: NEUTRAL_950 }}>{items[0]?.restaurantName}</Text>
            <TouchableOpacity onPress={clearCart} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Trash2 size={14} color="#CC2E2E" /><Text style={{ color: '#CC2E2E', fontSize: 13, fontWeight: '600' }}>Vider</Text>
            </TouchableOpacity>
          </View>
          {items.map((item) => (
            <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: '#F7F6F2' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', color: NEUTRAL_950, fontSize: 14 }}>{item.name}</Text>
                <Text style={{ color: NEUTRAL_400, fontSize: 12, marginTop: 2 }}>{fmtFCFA(item.price)} / unité</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#ECEAE3', alignItems: 'center', justifyContent: 'center' }}><Minus size={13} color={NEUTRAL_950} /></TouchableOpacity>
                <Text style={{ fontWeight: '700', fontSize: 15, color: NEUTRAL_950, minWidth: 16, textAlign: 'center' }}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center' }}><Plus size={13} color={NEUTRAL_950} /></TouchableOpacity>
              </View>
              <Text style={{ fontWeight: '700', fontSize: 13, color: NEUTRAL_950, minWidth: 72, textAlign: 'right' }}>{fmtFCFA(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, gap: 10, borderWidth: 1, borderColor: '#E5E3DC' }}>
          <Text style={{ fontWeight: '700', fontSize: 15, color: NEUTRAL_950 }}>Adresse de livraison</Text>
          <TextInput value={address} onChangeText={setAddress} placeholder="Rue, quartier, repère…" placeholderTextColor={NEUTRAL_400} style={{ backgroundColor: '#ECEAE3', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: NEUTRAL_950 }} />
          <TextInput value={commune} onChangeText={setCommune} placeholder="Commune (I, II, III…)" placeholderTextColor={NEUTRAL_400} style={{ backgroundColor: '#ECEAE3', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: NEUTRAL_950 }} />
        </View>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, gap: 8, borderWidth: 1, borderColor: '#E5E3DC' }}>
          <Text style={{ fontWeight: '700', fontSize: 15, color: NEUTRAL_950, marginBottom: 4 }}>Paiement</Text>
          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity key={pm.id} onPress={() => setPaymentMethod(pm.id as PaymentMethod)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 2, borderColor: paymentMethod === pm.id ? GOLD : '#E5E3DC', backgroundColor: paymentMethod === pm.id ? '#FDF8EC' : '#FFFFFF' }}>
              <Text style={{ fontSize: 22 }}>{pm.icon}</Text>
              <View style={{ flex: 1 }}><Text style={{ fontWeight: '700', fontSize: 14, color: NEUTRAL_950 }}>{pm.label}</Text><Text style={{ fontSize: 12, color: NEUTRAL_400 }}>{pm.sub}</Text></View>
              {paymentMethod === pm.id && <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center' }}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: NEUTRAL_950 }} /></View>}
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E5E3DC' }}>
          <Text style={{ fontWeight: '700', fontSize: 15, color: NEUTRAL_950, marginBottom: 10 }}>Récapitulatif</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}><Text style={{ color: NEUTRAL_400, fontSize: 14 }}>Sous-total</Text><Text style={{ color: NEUTRAL_950, fontSize: 14 }}>{fmtFCFA(sub)}</Text></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 4, borderTopWidth: 1, borderTopColor: '#F7F6F2' }}><Text style={{ fontWeight: '800', color: NEUTRAL_950, fontSize: 15 }}>Total</Text><Text style={{ fontWeight: '800', color: NEUTRAL_950, fontSize: 15 }}>{fmtFCFA(total)}</Text></View>
        </View>
        <TouchableOpacity onPress={handleOrder} disabled={loading} style={{ backgroundColor: GOLD, borderRadius: 16, paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
          {loading ? <ActivityIndicator color={NEUTRAL_950} /> : <><ShoppingBag size={18} color={NEUTRAL_950} /><Text style={{ fontWeight: '800', fontSize: 16, color: NEUTRAL_950 }}>Confirmer · {fmtFCFA(total)}</Text></>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
