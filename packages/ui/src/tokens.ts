export const colors = {
  gold50:'#FDF8EC', gold100:'#F7EFD1', gold200:'#F0DFA0', gold400:'#C9A84C', gold600:'#A5831A',
  n50:'#F7F6F2', n100:'#ECEAE3', n200:'#E5E3DC', n400:'#888780', n700:'#3D3B36', n900:'#1A1917', n950:'#0E0D0B',
  white:'#FFFFFF', success:'#1A7A4A', warning:'#D4720C', error:'#CC2E2E', info:'#378ADD',
} as const;

export const radius = { sm:4, md:8, lg:14, xl:20, xxl:28, pill:9999 } as const;
export const spacing = { xs:4, sm:8, md:12, lg:16, xl:20, '2xl':24, '3xl':32, '4xl':40, '5xl':48 } as const;

export function fmtFCFA(amount: number): string {
  const rounded = Math.round(amount / 50) * 50;
  return rounded.toLocaleString('fr-FR').replace(/\s/g, ' ') + ' FCFA';
}
export function fmtNum(n: number): string { return Math.round(n).toLocaleString('fr-FR'); }
export function fmtDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60), m = Math.round(minutes % 60);
  return `${h} h${m > 0 ? ` ${String(m).padStart(2, '0')}` : ''}`;
}
export function fmtKm(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

// Moov Money n'existe PAS au Mali — uniquement Orange Money et Wave
export const PAYMENT_METHODS = [
  { id: 'orange_money', label: 'Orange Money', icon: '🟠', sub: 'Paiement instantané' },
  { id: 'wave',         label: 'Wave',         icon: '🌊', sub: 'Paiement instantané' },
  { id: 'cash',         label: 'Espèces',      icon: '💵', sub: 'À la livraison' },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['id'];
