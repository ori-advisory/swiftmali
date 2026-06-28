import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@swiftmali/supabase/types';
import type { CartItem } from '@/lib/cart-store';

interface OrderPayload {
  items: CartItem[];
  paymentMethod: 'orange_money' | 'wave' | 'cash';
  deliveryAddress: string;
  deliveryCommune: string;
  deliveryFee: number;
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value, options }) => { cookieStore.set(name, value, options); }); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { items, paymentMethod, deliveryAddress, deliveryCommune, deliveryFee } = await req.json() as OrderPayload;
  if (!items?.length) return NextResponse.json({ error: 'Panier vide' }, { status: 400 });

  const restaurantId = items[0]?.restaurantId;
  if (!restaurantId) return NextResponse.json({ error: 'Restaurant invalide' }, { status: 400 });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + deliveryFee;

  const { data: order, error: orderError } = await supabase.from('orders').insert({
    customer_id: user.id, restaurant_id: restaurantId, status: 'pending',
    subtotal, delivery_fee: deliveryFee, total, payment_method: paymentMethod,
    payment_status: 'pending', delivery_address: deliveryAddress, delivery_commune: deliveryCommune,
  }).select().single();

  if (orderError || !order) {
    console.error('Order creation error:', orderError);
    return NextResponse.json({ error: 'Impossible de créer la commande' }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from('order_items').insert(
    items.map((item) => ({ order_id: order.id, menu_item_id: item.id, name: item.name, price: item.price, quantity: item.quantity }))
  );

  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id);
    return NextResponse.json({ error: 'Erreur lors de l\'enregistrement des plats' }, { status: 500 });
  }

  // TODO: initier transaction CinetPay pour orange_money / wave
  return NextResponse.json({ orderId: order.id, orderNumber: order.order_number });
}
