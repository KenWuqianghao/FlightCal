Here's a complete architecture document for your flight-to-calendar web app using **Next.js** and optionally  **Supabase** . If Supabase is not needed (no login or persistence beyond runtime), you can remove it, and I'll show you both paths.

---

# ✈️ Flight to Calendar Web App Architecture

## 🗂 File & Folder Structure

```
/flight-to-calendar
├── app/                        # App router (Next.js 13+)
│   ├── page.tsx               # Landing page (input flight number + date)
│   ├── result/                # Result route to show flight info + calendar link
│   │   └── page.tsx
│   └── globals.css            # Global styles
├── components/                # Reusable UI components
│   ├── FlightForm.tsx         # Input form for flight number and date
│   ├── FlightInfo.tsx         # Display flight details after fetch
│   └── CalendarButton.tsx     # Button to add event to Google/Apple/Outlook
├── lib/
│   ├── flightAPI.ts           # Service to fetch flight data from external API
│   ├── calendar.ts            # Utility to generate calendar event links
│   └── supabase.ts            # Supabase client setup (if used)
├── types/                     # Shared TypeScript types
│   └── flight.ts              # Types for flight data
├── public/                    # Static files
│   └── favicon.ico
├── .env.local                 # Environment variables (API keys, etc.)
├── next.config.js             # Next.js config
├── tsconfig.json              # TypeScript config
└── package.json
```

---

## 🧩 What Each Part Does

### `/app/`

* Uses the  **Next.js App Router** .
* `page.tsx`: Home page with flight input form.
* `/result/page.tsx`: Page rendered after submitting the form, fetches and shows flight info and calendar buttons.
* Can be converted to a multi-step page or dynamic route (`/result/[flightId]`) if using Supabase to store/search previous queries.

### `/components/`

* `FlightForm.tsx`: Contains state for flight number & date. Calls the API route or flightAPI service on submit.
* `FlightInfo.tsx`: Displays flight details like departure/arrival time, airports.
* `CalendarButton.tsx`: Generates `.ics` links and calendar deep links (Google Calendar, Outlook, Apple).

### `/lib/`

* `flightAPI.ts`: Logic to call flight info API (e.g., AviationStack, FlightAware, etc.). Accepts flight number + date and returns structured data.
* `calendar.ts`: Converts flight data into calendar links (.ics or Google Calendar URL).
* `supabase.ts`: Optional. Sets up and exports Supabase client for use in server/client if user login or persistence is required.

### `/types/`

* `flight.ts`: Defines TypeScript interfaces like:

```ts
export interface FlightInfo {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
}
```

---

## 🧠 Where State Lives

| State               | Location                        | Notes                                                    |
| ------------------- | ------------------------------- | -------------------------------------------------------- |
| Flight form input   | `FlightForm`component         | Controlled inputs (React state)                          |
| Fetched flight data | `ResultPage`or `FlightInfo` | Either fetched in route or passed via props              |
| Calendar link       | `CalendarButton`              | Generated on-the-fly from flight info                    |
| Authenticated user  | Supabase client                 | Only if you support user logins and saved flight history |

---

## 🔗 How Services Connect

### Without Supabase

1. User enters flight number + date → handled in `FlightForm`.
2. On submit:
   * Calls `flightAPI.ts` (via server action or API route) to fetch flight info.
   * Pushes to `/result` route with query or context.
3. `FlightInfo` renders flight details.
4. `CalendarButton` generates add-to-calendar links (Google, Outlook, Apple).

### With Supabase (Optional Enhancements)

* Add login/signup using Supabase Auth.
* Store past queried flights in Supabase DB (for user dashboard/history).
* Use RLS (Row Level Security) to keep user data private.
* Fetch user's flight history on a `/dashboard` route.

---

## 🔐 Example Use of Supabase Auth

```ts
// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

Then in a route:

```ts
const { data: { user } } = await supabase.auth.getUser();
```

---

## 🌍 Flight API Recommendations

Choose based on pricing & data freshness:

* [AviationStack](https://aviationstack.com/)
* [AeroDataBox](https://rapidapi.com/aedbx-aedbx/api/aerodatabox)
* [FlightAware](https://flightaware.com/commercial/firehose/firehose_documentation.rvt)

---

## 🗓 Add-to-Calendar Options

* **Google Calendar** link:

```ts
`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${description}&location=${location}`
```

* **.ics** file generation: create downloadable `.ics` via Blob + anchor click.
* **Outlook & Apple** : support `.ics`.

Use `calendar.ts` to generate all formats from a `FlightInfo` object.

---

## 🧪 Future Ideas

* Track flight delays with polling/alerts.
* Add timezone support for local calendar accuracy.
* Save multiple flights to a trip bundle.
* Export full trip as `.ics` file.

---

Let me know if you want me to scaffold the whole codebase or a working starter repo too.
