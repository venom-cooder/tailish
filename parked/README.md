# Parked routes

Nothing here is built, routed, type-checked or published. It is working code
that was taken off the live site because **the thing it described did not
exist yet**.

Until November 2026 the published site ran entirely on `lib/mock` — there was
no backend at all. AxisIQ → Sites → Sign-in & API had no user pool and no API
routes, so every page under here was showing invented data to real visitors:

- a shop with priced products and no checkout,
- vets and clinics in Indore that nobody had partnered with,
- a pet portal holding two dogs, Bruno and Misty, that loaded into *every*
  visitor's browser,
- a sign-in that accepted any phone number with the code `6318`.

These were removed rather than fixed because a login that lets anyone in, and
medical records for animals that do not exist, are worse than a missing page.

## What is in here

| Path | Why it is parked |
|------|------------------|
| `app/app/*` | The pet portal. Needs real auth and a real pets API. |
| `app/login` | Hard-coded OTP. Needs a Website Accounts user pool. |
| `app/p` | Health Passport share links. Needs server-issued tokens. |
| `app/(site)/cart`, `app/(site)/checkout` | No payment provider is connected. |
| `app/(site)/shop` | Catalogue and prices were invented. |
| `app/(site)/nearby` | Clinic listings were invented. |
| `app/(site)/vet-care` | Real services, but booking went nowhere. |
| `app/(site)/pricing` | Prices were never confirmed. |

## Bringing one back

A route is only live once the data behind it is real. The order matters:

1. Build the backend first — an AxisIQ Function, exposed through
   Sites → Sign-in & API → **API routes**, so the browser calls a same-origin
   path and no key is ever shipped to the client.
2. Point the site at it by setting `NEXT_PUBLIC_API_BASE_URL`. That one
   variable swaps `lib/api`'s mock adapter for real REST across every call.
3. Move the folder back:

   ```sh
   git mv "parked/app/(site)/pricing" "app/(site)/pricing"
   ```

4. Restore its links. The CTAs that used to point here now open WhatsApp
   instead — search for `whatsappMessages` to find them.
5. Delete the mock data the route depended on. `lib/mock/content.ts` is
   genuine written copy and should stay; `pets.ts`, `account.ts`, `catalog.ts`
   and `services.ts` are fabrications and must not come back with the route.

Run `npm run typecheck` after step 3 — `parked/` is excluded from `tsconfig.json`,
so nothing in here is checked until it is moved out, and the first typecheck
after a move is what tells you which props and imports have drifted.
