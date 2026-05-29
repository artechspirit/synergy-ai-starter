⚠️ Extends root AI_CONTEXT.md. Expo / React Native execution rules.

## PATTERNS
- Navigation: Expo Router (file-based). Group `(tabs)`, `(auth)`, `(modals)`. `router.push`/`replace`.
- Primitives: `View`, `Text`, `Pressable`, `Image`, `FlashList`. 🚫 No `div`, `span`, `window`.
- Styling: `nativewind`/`react-native-css` + Tailwind scale. SafeArea via layout root.
- State: `@tanstack/react-query` API. `zustand` UI. `expo-secure-store`/`AsyncStorage` persist.
- Offline: Mutation queue + `@react-native-community/netinfo`. Sync on reconnect. Optimistic + rollback wajib.
- Device permissions: Camera/NFC/notifications/location wajib handle states `unknown`, `denied`, `granted`, dan recovery CTA.
- Native: Only Expo SDK / vetted `expo-*`/`react-native-*`. Wrap `Platform.OS`.
- Forms: Pengelolaan form di client-side wajib menggunakan **React Hook Form** + Zod resolver.
- Media: Pemuatan gambar wajib menggunakan **expo-image** untuk menjamin optimalisasi rendering performa tinggi dan native disk caching.

## 🚫 ANTI-PATTERNS
- Web DOM APIs (`window`, `localStorage`) → GANTI Expo equivalents
- Unoptimized lists (>20) → WAJIB `FlashList` + `keyExtractor`
- Heavy compute di render → PINDAH `useMemo`/`useCallback` / background
- Inline functions/styles di list → EKSTRAK `React.memo`
- Ignore SafeArea/Status bar → WAJIB handle root
- Menggunakan komponen `Image` bawaan React Native untuk gambar dinamis/berat → GANTI `expo-image`
- Mengelola state form manual menggunakan rentetan `useState` → GANTI React Hook Form + Zod
- Direct import `apps/web`/`apps/api` → GANTI `@repo/api-contracts` + fetch jika monorepo. Untuk repo non-monorepo, pakai API client/contract lokal yang disepakati.

## ✅ CHECKLIST
- [ ] Expo Router structure match
- [ ] Only RN primitives
- [ ] Lists optimized + memoized
- [ ] Offline queue + sync logic (if mutation)
- [ ] Device permission states handled (if using native capability)
- [ ] SafeArea/Status bar handled
- [ ] Types from `@repo/api-contracts` or approved local contract
- [ ] No web APIs / direct imports
- [ ] React Hook Form + Zod resolver active for forms
- [ ] Component expo-image used for optimized native image caching
