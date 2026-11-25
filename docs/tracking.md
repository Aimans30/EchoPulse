# Tracking on echopulse.media

Written 18 Nov 2026. Two things are tracked: **where each visitor came from** (kept on their device and attached to every lead and booking link) and **each conversion step** (one analytics event per step).

Code: `lib/attribution.ts`, `lib/analytics.ts`, `lib/links.ts` (`bookingUrl`), `components/AttributionTracker.tsx`.

## 1. Events

Sent to GA4 and Microsoft Clarity by `track()` in `lib/analytics.ts`. In development each one is printed to the browser console as `[analytics] name {params}`.

| Event | Fires when | Parameters |
|---|---|---|
| `free_edits_click` | A "Get 2 free edits" button or any link to `/free-edits` is clicked | `location`, `page` |
| `free_edits_submit` | The free-edits form is sent | `source`, `page`, `ft_*` |
| `book_call_click` | Any booking button or any link to Cal.com is clicked | `location`, `page` |
| `book_call_calendar_loaded` | The calendar appears in the booking modal | `seconds` |
| `book_call_modal_close` | The booking modal is closed | `calendar_loaded` |
| `plan_select` | A plan is chosen (pricing card, `/pricing` button, or a switch inside the intake form) | `plan`, `location`, `page` |
| `plan_intake_submit` | The plan questions are submitted | `plan`, `saved`, `page`, `ft_*` |
| `booking_confirmed` | `/booked` loads after a Cal.com booking | `via` (`modal` or `new_tab`), `booked_from`, `location`, `ft_*` |
| `case_study_cta_click` | A button on a case study page or the case study index | `location`, `cta` (`book_call` or `free_edits`), `page` |
| `work_wall_cta_click` | A button on `/work` | `location`, `cta`, `page` |
| `work_video_open` | A video is opened on `/work` or on an audience page | `video`, `brand`, `page` |
| `newsletter_submit` | A newsletter signup (source contains "newsletter") | `source`, `page`, `ft_*` |
| `lead_magnet_submit` | Any other email capture (shot list PDF) | `source`, `page`, `ft_*` |
| `cta_pilot_click` | A Pilot button that is not a plan choice | `location` |
| `scroll_depth` | 25, 50, 75, 100% of a page | `percent` |

`ft_*` is the first touch: `ft_source`, `ft_medium`, `ft_landing`, `ft_campaign` (when there was one), `ft_ref_type` (`ai`, `search`, `social`, `email`, `paid`, `referral`, `campaign`, `direct`).

Notes:

- A case study or work wall booking button fires two events: `book_call_click` (the site-wide funnel step) and the page event. Count bookings clicks from `book_call_click` only.
- No event carries a name, email, phone number or anything a visitor typed.
- Renamed events. Old names are translated inside `track()`, so components that still pass them need no change: `cta_call_click` is now `book_call_click`, `cta_free_edits_click` is now `free_edits_click`, `call_booked` is now `booking_confirmed`, and `cta_pilot_click` with a `..._free_edits` location is now `free_edits_click`. Free-edits form submits used to be `lead_magnet_submit`; they are now `free_edits_submit`.
- Links need no code to be tracked. `AttributionTracker` listens once for clicks on any link to Cal.com or `/free-edits`. To name a button, add `data-track-location="page_section"`. To fire an extra page-level event, add `data-track="event_name"`.

## 2. Where attribution is stored

On the visitor's device only. Paths, a referrer host (never the full URL), UTM values and a timestamp. No query strings, no IP address, no personal data.

| Storage | Key | Contents | Lifetime |
|---|---|---|---|
| sessionStorage | `ep_attr_session` | This visit's touch (`landing_path`, `referrer_host`, `referrer_type`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `first_seen_at`) and the last 8 page paths | Until the tab closes |
| localStorage | `ep_attr` | `first` (the first touch, never overwritten, ignored after 90 days) and `last` (the latest touch that was not a direct visit) | 90 days for `first` |
| both | `ep_book_click` | The last booking button clicked: `location`, `page`, time | Used for 6 hours |

Rules:

- The first page view of a visit creates the touch. `/booked` and pages inside an iframe never do.
- AI referrers: `chatgpt.com`, `chat.openai.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai` (as referrer host, or as `utm_source`, which ChatGPT adds itself) are classified `referrer_type: "ai"`.
- The 90-day localStorage copy is written only when the visitor has allowed analytics, or is outside the UK and EU (judged by browser time zone) and has not declined, and has no Global Privacy Control signal. The per-visit sessionStorage copy is always written.
- If storage is blocked, an in-memory copy lasts until the page is reloaded.

## 3. How a lead shows its origin

Forms send `attribution: getAttribution()` to `/api/lead`. The route validates it (known keys only, strings only, length caps, paths must start with `/`, query strings removed) and adds the visitor's country from the `x-vercel-ip-country` header. The IP address is not read by this code.

Slack (`#leads`), one line under Source:

```
Came from: landed on /blog/real-estate-video-editing-cost · referrer google.com (search) · utm source=test, campaign=x · AI referrer: no · country US · pages /blog/real-estate-video-editing-cost > /pricing > /free-edits
```

Asana task notes, a block at the end:

```
Where this lead came from
Landing page: /blog/real-estate-video-editing-cost
Referrer: google.com (search)
UTM: source=test, campaign=x
AI referrer: no
First seen: 2026-11-18T10:02:11.000Z
Pages this visit: /blog/real-estate-video-editing-cost > /pricing > /free-edits
Submitted from: /free-edits
Country: US
```

Forms that send it today: the plan intake form and the shot list form. Not yet: the free-edits form and the blog newsletter form (see section 6).

## 4. Booking links

Every Cal.com link is built by `bookingUrl()` or `staticBookingUrl()` in `lib/links.ts`. Server-rendered anchors keep a working static href and are upgraded at the moment of the click.

| Parameter on the Cal.com URL | Meaning |
|---|---|
| `utm_source` | The visitor's first `utm_source`, else the referring host, else `direct` |
| `utm_medium` | Their first `utm_medium`, else the referrer type (`search`, `ai`, `social`...) |
| `utm_campaign` | Their first `utm_campaign`, when there was one |
| `utm_term` | The page they first landed on |
| `utm_content` | The button that was clicked |
| `metadata[ep_source]`, `metadata[ep_medium]`, `metadata[ep_landing]`, `metadata[ep_page]`, `metadata[ep_location]`, `metadata[ep_plan]` | The same facts, plus the page the button was on, for the Cal.com webhook |

Blog links keep their own tagging (`utm_source=blog`, `utm_medium=<card>`, `utm_campaign=<post slug>`); only the `metadata[...]` fields are added to them.

`/api/cal-webhook` reads `payload.metadata` and, when the `ep_*` fields are there, adds a "Came from" line to the Slack message and the Asana task.

Bookings made in a new tab: the click is remembered in `ep_book_click`, and `/booked` reports `booking_confirmed` with `booked_from` set to the page whose button was clicked and `via: new_tab`. It used to report `/booked`.

## 5. What the owner must set up outside the code

1. **GA4 custom dimensions** (Admin, Custom definitions, event scope): `location`, `page`, `plan`, `cta`, `via`, `booked_from`, `source`, `video`, `brand`, `ft_source`, `ft_medium`, `ft_landing`, `ft_campaign`, `ft_ref_type`. Without these the parameters are collected but cannot be used in reports.
2. **GA4 key events** (Admin, Events): mark `booking_confirmed`, `free_edits_submit` and `plan_intake_submit`. If `call_booked` was marked before, it no longer arrives; mark `booking_confirmed` in its place.
3. **GA4 unwanted referrals** (Data stream, Configure tag settings, List unwanted referrals): add `cal.com`, so a visitor returning from Cal.com to `/booked` does not start a new session credited to Cal.com.
4. **Cal.com redirect**: on the event type, Advanced, "Redirect on booking", set `https://echopulse.media/booked`. `booking_confirmed` cannot fire without it.
5. **Cal.com webhook**: Settings, Developer, Webhooks, subscriber URL `https://echopulse.media/api/cal-webhook`, with `CAL_WEBHOOK_SECRET` set in the site's environment.
6. **Privacy page**: section 3 of `/privacy` should mention the `ep_attr`, `ep_attr_session` and `ep_book_click` entries. Not edited here because it is legal copy.

## 6. Not verified, and known gaps

Not verified (no real booking or lead was made during this work):

- That Cal.com stores `utm_*` on the booking and copies `metadata[...]` URL parameters into the webhook payload. If it does not, the Slack line for bookings stays empty; the UTM values are still visible wherever Cal.com shows them.
- That the Cal.com event currently redirects to `/booked`, and whether Cal.com passes any parameters on that redirect (the code does not depend on it).
- That `x-vercel-ip-country` is present in production (it is a Vercel header; the code also accepts Cloudflare's `cf-ipcountry`).
- The real Slack and Asana output. The formatting was checked by running the functions directly, not by posting.
- GA4 itself. Events were checked in the dev console only.

Known gaps:

- `components/FreeEditsForm.tsx` and `components/BlogEmailCapture.tsx` do not send `attribution` yet. One line each: add `attribution: getAttribution()` to the JSON body.
- `components/LeadMagnet.tsx` posts to `/api/lead-magnet`, which only writes the email to the server log. That lead reaches neither Slack nor Asana.
- Visitors who decline analytics, or who have Global Privacy Control on, produce no events. Their origin still arrives on the lead, because the lead is sent by the visitor.
- The booking modal loads its calendar once per page and keeps it. If a visitor opens it from a second button without reloading, the Cal.com URL still names the first button. `booking_confirmed` names the latest one.
- `/booked` counts one booking per tab session, and counts a visit to `/booked` made by hand.
- Step-by-step events inside the free-edits form (`free_edits_step`, `free_edits_error`) and video opens in the homepage work section (`components/OurWork.tsx`) are not tracked.
- Country is on the lead but is not sent to GA4 as a user property.
- `/order`, `/onboard` and checkout do not carry attribution.

## Search landing pages (added 25 Nov 2026)

`/affordable-personal-branding-for-founders` and `/done-for-you-social-media-management` are reached from search and AI answers only (not linked from the nav, footer or homepage). Every button on them carries a `location` with the page's prefix: `pb_` for personal branding, `smm_` for social media management.

| Button | `location` |
| --- | --- |
| Hero, book a call | `pb_hero_primary` / `smm_hero_primary` |
| Hero, free edits | `pb_hero_secondary_free_edits` / `smm_hero_secondary_free_edits` |
| Under the price table | `pb_compare_book`, `pb_compare_free_edits` (and `smm_...`) |
| Under the FAQ | `pb_faq_book`, `pb_faq_free_edits` (and `smm_...`) |
| Proof links | `pb_proof` / `smm_proof` |

How to see who converted from these pages in GA4:
1. **Bookings:** Explore, Free form. Event name = `booking_confirmed`. Break down by `booked_from` (the page whose button was clicked) and `ft_landing` (the first page of the visit). A row with `ft_landing` = one of these paths is a buyer who arrived on that page, even if they booked from another page later.
2. **Free edits sent:** same exploration with event `free_edits_submit`, broken down by `ft_landing`.
3. **Which button:** event `book_call_click` or `free_edits_click`, broken down by `location`.
4. **Traffic:** Reports, Engagement, Landing page, filter the two paths. AI referrals show as source chatgpt.com, perplexity.ai and so on.
`booked_from`, `ft_landing` and `location` must be registered as custom dimensions (see the setup list above) for the breakdowns to appear.
