import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ShoppingBag, Star, Clock, Bike } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/lib/cart-store';
import { fmtFCFA } from '@swiftmali/ui/tokens';
import type { Database } from '@swiftmali/supabase/src/database.types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

const GOLD = '#C9A84C'; const NEUTRAL_950 = '#0E0D0B'; const NEUTRAL_700 = '#3D3B36'; const NEUTRAL_400 = '#888780'; const NEUTRAL_100 = '#ECEAE3';

const CATEGORIES = [
  { id: 'all', label: '🍽️ Tout' }, { id: 'Malien', label: '🍲 Malien' },
  { id: 'Fast-food', label: '🍔 Fast-food' }, { id: 'Ivoirien', label: '🐟 Ivoirien' },
  { id: 'Supermarché', label: '🛒 Super' }, { id: 'Boulangerie', label: '🥐 Boulan.' },
];

const CATEGORY_EMOJI: Record<string, string> = { 'Malien': '🍲', 'Ivoirien': '🐟', 'Fast-food': '🍔', 'Africain': '🍛', 'Supermarché': '🛒', 'Boulangerie': '🥐' };

export default function EatsHomeScreen() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const itemCount = useCartStore((s) => s.itemCount());

  async function fetchRestaurants(cat: string) {
    let query = supabase.from('restaurants').select('*').order('is_featured', { ascending: false }).order('rating', { ascending: false });
    if (cat !== 'all') query = query.eq('category', cat);
    const { data } = await query;
    setRestaurants(data ?? []);
  }

  useEffect(() => { void fetchRestaurants(category).finally(() => setLoading(false)); }, [category]);

  const onRefresh = async () => { setRefreshing(true); await fetchRestaurants(category); setRefreshing(false); };
  const filtered = search.trim() ? restaurants.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase())) : restaurants;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: NEUTRAL_100 }}>
      <View style={{ backgroundColor: NEUTRAL_950, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <View>
            <Text style={{ color: '#888780', fontSize: 12, fontWeight: '500', letterSpacing: 0.5 }}>BAMAKO · MALI</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 2 }}>Swift<Text style={{ color: GOLD }}>Eats</Text></Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/cart')} style={{ position: 'relative', padding: 8 }}>
            <ShoppingBag size={24} color="#FFFFFF" />
            {itemCount > 0 && (
              <View style={{ position: 'absolute', top: 2, right: 2, backgroundColor: GOLD, borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: NEUTRAL_950, fontSize: 10, fontWeight: '700' }}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
          <Search size={16} color={NEUTRAL_400} />
          <TextInput value={search} onChangeText={setSearch} placeholder="Restaurant, plat, quartier…" placeholderTextColor={NEUTRAL_400} style={{ flex: 1, color: '#FFFFFF', fontSize: 14 }} />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: '#FFFFFF', maxHeight: 52 }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.id} onPress={() => setCategory(cat.id)} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: category === cat.id ? GOLD : '#E5E3DC', backgroundColor: category === cat.id ? '#FDF8EC' : '#FFFFFF' }}>
            <Text style={{ fontSize: 12, fontWeight: category === cat.id ? '700' : '500', color: category === cat.id ? '#A5831A' : NEUTRAL_700 }}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={GOLD} /></View>
      ) : (
        <FlatList data={filtered} keyExtractor={(r) => r.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GOLD} />}
          contentContainerStyle={{ padding: 16, gap: 12 }} showsVerticalScrollIndicator={false}
          renderItem={({ item: r }) => (
            <TouchableOpacity onPress={() => router.push(`/restaurant/${r.slug}`)} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', opacity: r.is_open ? 1 : 0.6, borderWidth: 1, borderColor: '#E5E3DC' }} activeOpacity={0.92}>
              <View style={{ height: 160, backgroundColor: NEUTRAL_100, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 60 }}>{CATEGORY_EMOJI[r.category] ?? '🍽️'}</Text>
                {r.is_featured && <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: GOLD, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ fontSize: 11, fontWeight: '700', color: NEUTRAL_950 }}>⭐ Top</Text></View>}
                {!r.is_open && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14,13,11,0.5)', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13, backgroundColor: NEUTRAL_950, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 }}>Fermé</Text></View>}
              </View>
              <View style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: NEUTRAL_950, flex: 1 }}>{r.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}><Star size={12} color={GOLD} fill={GOLD} /><Text style={{ fontSize: 13, fontWeight: '600', color: NEUTRAL_700 }}>{r.rating.toFixed(1)}</Text></View>
                </View>
                <Text style={{ fontSize: 13, color: NEUTRAL_400, marginBottom: 10 }}>{r.category} · {r.commune}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {r.tags.slice(0, 3).map((tag) => (<View key={tag} style={{ backgroundColor: '#FDF8EC', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ fontSize: 11, color: '#A5831A', fontWeight: '600' }}>{tag}</Text></View>))}
                </View>
                <View style={{ flexDirection: 'row', gap: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: NEUTRAL_100 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Bike size={12} color={GOLD} /><Text style={{ fontSize: 12, color: NEUTRAL_400 }}>{r.delivery_fee === 0 ? 'Gratuit' : fmtFCFA(r.delivery_fee)}</Text></View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Clock size={12} color={NEUTRAL_400} /><Text style={{ fontSize: 12, color: NEUTRAL_400 }}>{Math.round((r.delivery_time_min + r.delivery_time_max) / 2)} min</Text></View>
                  <Text style={{ fontSize: 12, color: NEUTRAL_400, marginLeft: 'auto' }}>Min. {fmtFCFA(r.min_order)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<View style={{ alignItems: 'center', paddingVertical: 60 }}><Text style={{ fontSize: 48, marginBottom: 12 }}>🍽️</Text><Text style={{ fontWeight: '700', fontSize: 16, color: NEUTRAL_700 }}>Aucun restaurant trouvé</Text></View>}
        />
      )}
    </SafeAreaView>
  );
}
