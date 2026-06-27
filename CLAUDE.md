# SwiftMali — CLAUDE.md

## Verticales
| Produit | URL | Statut |
|---------|-----|--------|
| SwiftEats | eats.ori-advisory.com | Phase 1 ✅ |
| SwiftDeliver | deliver.ori-advisory.com | Phase 2 🔜 |
| SwiftBiz | biz.ori-advisory.com | Phase 3 🔜 |
| SwiftBeauty | beauty.ori-advisory.com | Phase 4 🔜 |

## Stack
- Monorepo: pnpm workspaces + Turborepo
- Web: Next.js 15 (App Router) → Vercel
- Mobile: Expo 53 + NativeWind → iOS + Android
- Backend: Supabase (PostgreSQL + Auth + Realtime)
- Paiements: CinetPay — Orange Money + Wave (Moov n'existe PAS au Mali)
- Maps: Mapbox GL

## Commandes
```bash
pnpm dev:eats          # SwiftEats web :3001
cd apps/mobile && pnpm dev  # Expo Go (scanner QR)
pnpm build             # Build tout
pnpm db:push           # Migrations Supabase
pnpm db:types          # Regen types DB
```

## Design tokens
- Or: #C9A84C (gold-400)
- Noir: #0E0D0B (neutral-950)
- Fond: #ECEAE3 (neutral-100)
- Typo: Syne (display) + DM Sans (body)

## Paiements Mali
Uniquement Orange Money et Wave. Pas de Moov.
CinetPay: `orange_money` | `wave` | `cash`

## Git
- user.name = "ori-advisory"
- user.email = "mamadou.keita@ori-advisory.com"
