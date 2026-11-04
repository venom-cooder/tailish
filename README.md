# Tailish

Marketing site, content library, shop and pet-parent portal for **Tailish** — an AI-guided pet care and veterinary service for dogs and cats, launching in Indore.

Built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4. Every screen is wired to a typed API client that currently returns realistic mock data, so the whole product is clickable today and switches to a real backend with a single environment variable.

```bash
npm install
npm run dev          # http://localhost:3000
```

---

## Contents

- [Pointing it at a real backend](#pointing-it-at-a-real-backend)
- [Connecting WhatsApp](#connecting-whatsapp)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [The API layer](#the-api-layer)
- [Routes](#routes)
- [Design system](#design-system)
- [Replacing the artwork](#replacing-the-artwork)
- [Next.js 16 notes](#nextjs-16-notes)
- [Scripts](#scripts)
- [Before launch](#before-launch)

---

## Pointing it at a real backend

**This is a one-place change.** Set `NEXT_PUBLIC_API_BASE_URL` and every call in the app switches from mock data to REST against that origin.

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.tailish.in/v1
```

The switch happens in [`lib/api/client.ts`](lib/api/client.ts):

```ts
export async function call<T>(spec: CallSpec<T>): Promise<T> {
  if (!USE_REAL_API) {
    return spec.mock();          // mock adapter
  }
  // …otherwise fetch(buildUrl(spec.path, spec.query), { method, headers, body })
}
```

Every endpoint is declared once, with both halves side by side:

```ts
// lib/api/pets.ts
list: () =>
  call<Pet[]>({
    method: "GET",
    path: "/pets",
    mock: () => getState().pets,
  }),
```

So when the backend ships, you delete nothing and rewrite nothing — the REST descriptor is already there. Keeping the mock implementations is useful anyway: they keep local development, preview deploys and tests working without a server.

**What you get for free when you flip the switch**

- Bearer-token auth (`setAuthToken` is called by `api.auth.verifyOtp`, read on every request).
- A uniform `ApiError` with `status`, `code`, `message` and `details`, surfaced through `toErrorMessage()` and rendered by the shared `<ErrorState>`.
- Loading, empty and error states already wired on every data-backed surface via the `useAsync` / `useMutation` hooks.

**What the backend must match**

The response shapes in [`lib/types/index.ts`](lib/types/index.ts). That file is the contract — it's the thing to hand to whoever builds the API.

---

## Connecting WhatsApp

Also a one-place change. Set the number and every button, link and QR code on the site repoints automatically:

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210     # E.164, no "+"
NEXT_PUBLIC_WHATSAPP_DEFAULT_TEXT="Hi Tailish! I'd like help with my pet's care."
```

Everything resolves through [`lib/whatsapp.ts`](lib/whatsapp.ts) → `getWhatsAppLink({ text })`, which produces `https://wa.me/<number>?text=<encoded>`.

**Components**

| Component | Use |
|---|---|
| `<WhatsAppButton text="…" label="…" />` | Green pill button, opens in a new tab |
| `<WhatsAppLink />` | Inline text link, for dense navigation |
| `<WhatsAppQR size={180} />` | QR code with the brand mark at its centre |
| `<WhatsAppQRMini />` | Compact QR, used in the footer |
| `<WhatsAppFloat />` | Floating action button, site-wide |

**Where they appear**

- Header: "Chat on WhatsApp"
- Home hero: "Start on WhatsApp" + a dedicated QR section
- Vet Care, Book Visit, Ask Tailish, product detail, cart, checkout: "Continue on WhatsApp" with context-specific prefilled text
- Contact page: prominent QR
- Footer: link + mini QR
- Every page: `<WhatsAppFloat />`

Prefilled messages live in `whatsappMessages` in the same file, so the copy stays consistent and the backend can route on it once a real WhatsApp agent is connected. The floating button picks its message from the current route.

---

## Environment variables

Copy `.env.example` to `.env.local`. **All are optional** — the app runs fully without them.

| Variable | Default | Effect |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | _(empty)_ | Empty → mock adapter. Set → real REST calls. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919876543210` | Target for every WhatsApp link and QR. |
| `NEXT_PUBLIC_WHATSAPP_DEFAULT_TEXT` | _(see config)_ | Fallback prefilled message. |
| `NEXT_PUBLIC_SITE_URL` | `https://tailish.in` | Canonical URLs, sitemap, Open Graph, share links. |
| `NEXT_PUBLIC_MOCK_LATENCY_MS` | `320` | Simulated latency in the browser, so loading states are exercised. Ignored on the server and when a real API is configured. |

---

## Project structure

```
app/
  (site)/              Marketing, content and shop — shared header/footer
  app/                 Pet-parent portal (authenticated, noindex)
  login/               Phone + OTP sign-in
  p/[shareToken]/      Public read-only shared Health Passport
  sitemap.ts
  robots.ts
components/
  ui/                  shadcn-style primitives (button, card, dialog, tabs…)
  site/                Header, footer, navigation data
  home/                Homepage sections
  shop/                Product card, grid, cart drawer, add-to-cart
  portal/              Portal shell, reminders, weight chart, pet form
  whatsapp/            Button, QR, floating action button
  shared/              Section, states, source badge, passport card, prose
  brand/               Logo, social icons
  motion/              Reveal-on-scroll
lib/
  api/                 Typed API client — one file per endpoint group
  types/               The data model (the backend contract)
  mock/                Realistic fixtures + an in-memory mutable store
  hooks/               useAsync, useMutation
  config.ts            Every environment-configurable value
  whatsapp.ts          Link builder and message catalogue
scripts/
  generate-art.mjs     Generates the placeholder artwork
  check-icons.mjs      Verifies every lucide icon import resolves
```

---

## The API layer

Import the client, never `fetch` directly:

```ts
import { api } from "@/lib/api";

const pets = await api.pets.list();
const cart = await api.commerce.addToCart(productId, 2);
```

Groups: `auth`, `account`, `pets`, `passport`, `ai`, `services`, `commerce`, `reminders`, `content`, `leads`.

Every endpoint from the specification is implemented, including ones whose UI is still marked "coming soon" — they return mock data today and need no frontend work when the backend lands.

<details>
<summary>Full endpoint list</summary>

**Auth** — `POST /auth/request-otp`, `POST /auth/verify-otp`, `GET /auth/session`, `POST /auth/logout`

**Account** — `GET|PATCH /me`; CRUD `/addresses`; CRUD `/family-delegates`; `GET|PATCH /settings/notifications`; `GET /notifications`, `PATCH /notifications/:id`, `POST /notifications/read-all`

**Pets** — `GET|POST /pets`, `GET|PATCH /pets/:id`

**Passport** — `GET|POST /pets/:id/vaccinations`, `/weights`, `/conditions`, `/medications`, `/documents` (multipart upload); `GET /pets/:id/timeline`; `POST /pets/:id/share`, `DELETE /pets/:id/share/:token`; `GET /p/:shareToken` (public)

**AI & care** — `POST /ask`, `POST /symptom-intake`, `GET /food-safety?item=`, `GET /nutrition/:petId`, `GET /nearby?type=&area=`

**Services** — `GET /services`, `GET /services/:slug`, `GET /providers`, `GET /slots`, `GET|POST /bookings`, `GET|PATCH /bookings/:id`

**Commerce** — `GET /categories`, `GET /categories/:slug`, `GET /products`, `GET /products/:slug`, `GET /cart`, `POST /cart/items`, `PATCH|DELETE /cart/items/:id`, `POST /cart/coupon`, `POST /checkout`, `GET /orders`, `GET /orders/:id`, `POST /orders/:id/reorder`, `GET /payments/:id/status`

**Reminders** — `GET /reminders`, `PATCH /reminders/:id` (done / snooze / reschedule)

**Content** — `GET /guides`, `GET /guides/:slug`, `GET /breeds`, `GET /breeds/:id`, `GET /plans`

**Leads** — `POST /waitlist`, `POST /partners/apply`, `POST /contact`

</details>

### Record provenance

Every clinical record carries a `source` field:

| Value | Badge | Meaning |
|---|---|---|
| `vet_verified` | Vet verified | Recorded by a registered veterinarian |
| `document_verified` | Document verified | Extracted from a document and checked by the care desk |
| `ai_extracted_draft` | Draft — needs review | Read automatically, not yet human-checked |
| `parent_entered` | Parent entered | Typed in by the pet parent |

The UI always shows it (`<SourceBadge>`). A pet parent should never have to guess whether a fact was asserted by a vet or typed in at midnight.

### Mock store

`lib/mock/store.ts` holds in-memory mutable state so the demo behaves like a real app within a session — add to cart, book a visit, mark a reminder done. Cart, session, orders, bookings, pets and addresses are mirrored to `localStorage`; "Reset demo data" in the portal sidebar clears it. None of this ships once `NEXT_PUBLIC_API_BASE_URL` is set.

Mock dates are anchored to a fixed `TODAY_ISO` constant in `lib/mock/clock.ts` — deterministic by necessity, since a moving clock breaks both prerendering and hydration.

### Demo credentials

Sign in at `/login` with any 10-digit number and the code **`6318`**. The hint is rendered only when no real backend is configured.

---

## Routes

**Marketing** — `/`, `/vet-care` (+ `/book-visit`, `/home-visit`, `/video-consult`, `/vaccination`, `/diagnostics`), `/how-it-works`, `/health-passport`, `/pricing`, `/about`, `/guides`, `/guides/[slug]`, `/nearby`, `/contact`, `/privacy`, `/terms`

**Shop** — `/shop`, `/shop/[category]`, `/shop/product/[slug]`, `/cart`, `/checkout`, `/checkout/success`

**Portal** — `/login`, `/app`, `/app/pets`, `/app/pets/new`, `/app/pets/[id]`, `/app/pets/[id]/edit`, `/app/pets/[id]/share`, `/app/ask`, `/app/care`, `/app/orders`, `/app/orders/[id]`, `/app/addresses`, `/app/family`, `/app/notifications`, `/app/profile`

**Public** — `/p/[shareToken]` (read-only shared passport)

### Safety posture

Ask Tailish never diagnoses. It gathers context, attaches the pet's own records, and routes. Messages matching emergency patterns (`classifyUrgency` in `lib/mock/ai.ts`) bypass the normal reply entirely and return a hospital referral. The disclaimer banner on `/app/ask` is not dismissible, and the booking flow puts an emergency escape hatch above the form rather than inside it. Keep this behaviour when wiring the real model.

---

## Design system

Tokens are defined once in `app/globals.css` under Tailwind v4's `@theme`:

| Token | Value | Use |
|---|---|---|
| `brand-900` | `#0F3F44` | Deep sections, footer, dark CTA bands |
| `brand-700` | `#1A5A63` | Brand primary, headings on light |
| `brand-500` | `#2E7A82` | Mid teal |
| `brand-50` | `#EAF2F1` | Light tint cards and sections |
| `accent-500` | `#E86E2B` | Primary CTAs |
| `accent-600` | `#D15F20` | CTA hover |
| `gold-500` | `#C8972F` | Secondary accent, dividers |
| `cream` | `#F7F4EE` | Alternate page background |
| `ink` | `#14323A` | Headings |
| `muted` | `#5A6B70` | Body text |

Use them as normal Tailwind utilities: `bg-brand-900`, `text-accent-500`, `border-hairline`.

Headings are **Sora**, body is **Inter**, both loaded via `next/font/google`. The wordmark is live text (`components/brand/logo.tsx`), not an image — a paw replaces the dot of a dotless `ı`, and a tail curls off the `h`.

**Motion** — `<Reveal>` fades sections in on scroll via `IntersectionObserver`. Cards lift, images zoom, nav dropdowns expand on hover and focus. All of it collapses under `prefers-reduced-motion`, which is handled centrally in `globals.css` — including the reveal utilities, so a visitor with reduced motion enabled sees content immediately rather than a blank page.

**Accessibility** — semantic landmarks, a skip link, visible focus rings on every interactive surface, labelled form fields with error text wired through `aria-invalid`, `aria-live` on result counts, keyboard-reachable dropdowns, and alt text on meaningful images (decorative ones are `alt=""`).

---

## Replacing the artwork

`public/images/**` is generated illustration, not photography — deliberately, so the site is self-contained with no remote image hosts and nothing to break offline. It is meant to be replaced.

Swap files in place and nothing else needs to change; paths are referenced from the mock data and components:

```
public/images/hero-pet.svg          Homepage hero
public/images/pets/*.svg            Pet avatars
public/images/avatars/*.svg         Vet and parent avatars
public/images/products/*.svg        One plate per shop category
public/images/categories/*.svg      Category cards
public/images/guides/*.svg          Guide covers
public/images/breeds/*.svg          Breed profiles
```

To regenerate or restyle them, edit `scripts/generate-art.mjs` and run `npm run art`.

If you move to remote images, add the host to `images.remotePatterns` in `next.config.ts`.

---

## Next.js 16 notes

This project runs with **Cache Components** and **Partial Prefetching** enabled. Two consequences worth knowing before you edit:

**1. No synchronous IO in a render body.** `new Date()`, `Date.now()`, `Math.random()` and `crypto.randomUUID()` all fail the prerender. Use the fixed clock in `lib/mock/clock.ts` and the monotonic `nextId()` in `lib/utils.ts`. Runtime clock reads inside event handlers and effects are fine.

**2. Runtime data must sit inside `<Suspense>`.** That includes `params`, `searchParams` and `usePathname()`. The pattern used throughout is a static shell wrapping a suspended child:

```tsx
export default function Page({ params }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
```

The portal (`app/app/layout.tsx`) opts out with `export const instant = false` instead: its shell genuinely depends on the current route, and since every portal screen is authenticated, noindex and client-fetched, there is nothing to gain from a static shell there.

To turn these features off, remove `cacheComponents` and `partialPrefetching` from `next.config.ts`.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run art` | Regenerate `public/images` |
| `npm run check:icons` | Verify every `lucide-react` import resolves |

`check:icons` exists because lucide removed its third-party brand glyphs; social marks are drawn in `components/brand/social-icons.tsx` instead. Run it after adding icons — a missing export is a build failure, not a type error.

---

## Before launch

- [ ] Set `NEXT_PUBLIC_API_BASE_URL` to the real backend
- [ ] Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the WhatsApp Business number
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain
- [ ] Replace `public/images/**` with real photography
- [ ] Replace the placeholder contact details in `lib/config.ts` (phone, email, address, social URLs)
- [ ] Have a lawyer review `/privacy` and `/terms` — the drafts are thorough but not legal advice
- [ ] Replace the demo stats on the homepage (`siteConfig.stats`) with real numbers, or remove them
- [ ] Add a real `opengraph-image`
- [ ] Confirm every veterinarian's council registration number before publishing their profile
