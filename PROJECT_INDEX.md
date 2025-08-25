# PROJECT_INDEX — DitonaChat (read-only)
## Map (≤20 bullets)
- Runtime: package.json (dev/build/start) — dev على port 3000
- Next config: standalone (next.config.js)
- Styling: Tailwind/PostCSS (postcss.config.js, tailwind.config.js, src/app/globals.css)
- Landing: /home (src/app/home/page.tsx)
- Chat: /chat (src/app/chat/page.tsx)
- Peer header & filters (src/components/chat/*)
- Toolbar (src/components/chat/Toolbar.tsx)
- Messages (src/components/chat/ChatMessages.tsx)
- Quick dock (src/components/chat/LowerRightQuick.tsx)
- Age Gate: /api/age/allow يضبط ageok (src/app/api/age/allow/route.ts, src/middleware.ts)
- TURN/STUN: /api/turn ttl=300 + STUN fallback (src/app/api/turn/route.ts)
- WebRTC helpers (src/utils/webrtc.ts)
- Socket server (src/pages/api/socket.ts)
- Socket client util (src/utils/socket.ts)
- Settings (/settings)
- Auth/Prisma (src/lib/authOptions.ts, src/lib/db/prisma.ts)
- Stripe (src/lib/stripeConfig.ts, src/app/api/stripe/**)
- Rate-limit (src/server/rl.ts, src/server/limit-middleware.ts)

## Components
- `src/components/BoostMeButton.tsx`
- `src/components/chat/ChatComposer.tsx`
- `src/components/chat/ChatMessages.tsx`
- `src/components/chat/CountryFilter.tsx`
- `src/components/chat/CountryPicker.tsx`
- `src/components/chat/ErrorCatcher.tsx`
- `src/components/chat/GenderPicker.tsx`
- `src/components/chat/LikeButton.tsx`
- `src/components/chat/LowerRightQuick.tsx`
- `src/components/chat/PeerHeader.tsx`
- `src/components/chat/SafeListProbe.tsx`
- `src/components/chat/SelfPreview.tsx`
- `src/components/chat/TailwindSafelist.tsx`
- `src/components/chat/TinyToast.tsx`
- `src/components/chat/Toolbar.tsx`
- `src/components/CountryFilter.tsx`
- `src/components/Footer.tsx`
- `src/components/GenderFilter.tsx`
- `src/components/GenderToggle.tsx`
- `src/components/HeaderLite.tsx`
- `src/components/icons/MediaIcons.tsx`
- `src/components/PeerBadge.tsx`
- `src/components/shell/ChatShell.tsx`
- `src/components/shell/PageShell.tsx`
- `src/components/SyncProfile.tsx`
- `src/components/Toast.tsx`
- `src/components/ui/Toast.tsx`
- `src/components/UpsellModal.tsx`
- `src/components/VipUpsell.tsx`

## Hooks
- `src/hooks/useMatchingQueue.ts`
- `src/hooks/useSmartJoin.ts`
- `src/hooks/useSocketProbe.ts`
- `src/hooks/useSubscriptionAccess.ts`
- `src/hooks/useSwipeNav.ts`
- `src/hooks/useSwipe.ts`
- `src/hooks/useUserPreferences.ts`
- `src/hooks/useViewportInsets.ts`
- `src/hooks/useVip.ts`

## Utils
- `src/utils/adminGuard.ts`
- `src/utils/likes.ts`
- `src/utils/matching.ts`
- `src/utils/prefs.ts`
- `src/utils/rtcClient.ts`
- `src/utils/socket.ts`
- `src/utils/webrtc.ts`

## Lib
- `src/lib/age/otpStore.ts`
- `src/lib/authOptions.ts`
- `src/lib/config.ts`
- `src/lib/db/prisma.ts`
- `src/lib/db.ts`
- `src/lib/flags.ts`
- `src/lib/gesture/useDragPinch.ts`
- `src/lib/image.ts`
- `src/lib/kv.ts`
- `src/lib/matcher/mock.ts`
- `src/lib/match/mock.ts`
- `src/lib/match.ts`
- `src/lib/net/http.ts`
- `src/lib/otpStore.ts`
- `src/lib/otp.ts`
- `src/lib/peerTypes.ts`
- `src/lib/prefs.ts`
- `src/lib/rateLimit.ts`
- `src/lib/redis.ts`
- `src/lib/runtime.ts`
- `src/lib/socket/matcher.ts`
- `src/lib/stripeClient.ts`
- `src/lib/stripeConfig.ts`
- `src/lib/twilio.ts`
- `src/lib/vip.ts`

## Env Vars (from code)
```txt
AGE_BYPASS
AGE_VERIF_METHOD
APP_BASE_URL
DISABLE_REDIS
FEATURE_BLOCK_ON_VIOLATION
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
MATCHER_BASE_URL
MATCHER_WS_URL
NEXTAUTH_URL
NEXT_PUBLIC_AGE_BYPASS
NEXT_PUBLIC_AGE_VERIF_METHOD
NEXT_PUBLIC_BACKEND_URL
NEXT_PUBLIC_BASE_URL
NEXT_PUBLIC_FREE_ALL
NEXT_PUBLIC_FREE_ALL_UNTIL
NEXT_PUBLIC_RELAY_ONLY
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_STRIPE_PUBLIC_KEY
NEXT_PUBLIC_TURN_CREDENTIAL
NEXT_PUBLIC_TURN_URL
NEXT_PUBLIC_TURN_USERNAME
NEXT_PUBLIC_VIP_FREE_ALL
NODE_ENV
OTP_SECRET
PRISMA_LOG
RATE_LIMIT_DEFAULT
RATE_WINDOW_MS
RL_ADMIN_TOKEN
SAFE_MODE_DEFAULT
STRIPE_API_VERSION
STRIPE_BOOST_ME_DAILY_ID
STRIPE_ELITE_YEARLY_ID
STRIPE_MODE
STRIPE_PRICE_ID
STRIPE_PRO_WEEKLY_ID
STRIPE_PUBLIC_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_TEST_PUBLISHABLE_KEY
STRIPE_TEST_SECRET_KEY
STRIPE_VIP_MONTHLY_ID
STUN_URLS
TURN_CREDENTIAL
TURN_PASSWORD
TURN_TTL
TURN_URL
TURN_URLS
TURN_USER
TURN_USERNAME
UPSTASH_REDIS_REST_TOKEN
UPSTASH_REDIS_REST_URL
```

## Pages & Layouts (normalized)
- `/account`
- `/age`
- `/auth/signin`
- `/billing/cancel`
- `/billing/success`
- `/billing/test`
- `/chat`
- `/chat/[room]`
- `/chat-sanity`
- `/debug`
- `/gate`
- `/home`
- `/legal/privacy`
- `/legal/terms`
- `/login`
- `/match/debug`
- `/match-test`
- `/privacy`
- `/relay-probe`
- `/rtc/socket-test`
- `/settings`
- `/share`
- `/signup`
- `/subscribe`
- `/subscribe/cancel`
- `/subscribe/success`
- `/terms`
- `/test-call`
- `/vip`
- `/webrtc-diag`
- `/webrtc-perf-test`
- `/webrtc-test`
- `/xchat`

## API Endpoints (normalized)
- `/api/age/allow`
- `/api/age/confirm`
- `/api/age/cookie`
- `/api/age/request`
- `/api/age/verify`
- `/api/billing/portal`
- `/api/checkout`
- `/api/create-checkout-session`
- `/api/gate/ok`
- `/api/health`
- `/api/join`
- `/api/likes/toggle`
- `/api/match/cancel`
- `/api/match/enqueue`
- `/api/match/ping`
- `/api/match/status`
- `/api/me`
- `/api/metrics/ice`
- `/api/preferences/gender`
- `/api/profile`
- `/api/ratelimit-stats`
- `/api/redis/ping`
- `/api/relay-capture`
- `/api/rl`
- `/api/stripe/create-checkout-session`
- `/api/stripe/portal`
- `/api/stripe/prices`
- `/api/stripe/subscribe`
- `/api/stripe/webhook`
- `/api/subscription`
- `/api/subscription/debug`
- `/api/subscription/status`
- `/api/turn`
- `/api/webhooks/stripe`
