# SwiftMali

**Écosystème logistique et de livraison pour le Mali** — 4 verticales sous une marque commune.

| | Produit | Description | URL |
|---|---------|-------------|-----|
| 🍽️ | **SwiftEats** | Food delivery — restaurants & supermarchés de Bamako | eats.ori-advisory.com |
| 📦 | **SwiftDeliver** | Livraison de colis avec tarification dynamique distance/poids | deliver.ori-advisory.com |
| 🏢 | **SwiftBiz** | Portail B2B logistique avec suivi de flotte et analytics | biz.ori-advisory.com |
| 💄 | **SwiftBeauty** | Personal shopper international beauté (Amazon, Sephora, Aromazone…) | beauty.ori-advisory.com |

## Stack
- **Monorepo** : pnpm workspaces + Turborepo
- **Web** : Next.js 15 (App Router) → Vercel
- **Mobile** : Expo 53 (React Native) → iOS + Android
- **Backend** : Supabase (PostgreSQL + Auth + Realtime)
- **Paiements** : CinetPay (Orange Money + Wave — Moov n'existe pas au Mali)

## Démarrage rapide
```bash
git clone https://github.com/ori-advisory/swiftmali.git
cd swiftmali
pnpm install
cp .env.example apps/eats-web/.env.local
pnpm dev:eats   # → http://localhost:3001
```

*SwiftMali — © 2026 ORI Advisory*
