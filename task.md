Here's a **granular, testable, step-by-step plan** to build your MVP using the architecture described. Each task is atomic, focused, and easy to validate. This plan assumes no Supabase (for MVP), but I'll mark optional Supabase steps as **[Optional]** so you can include them later.

---

# ✅ MVP Build Plan (Flight to Calendar)

## 🏁 Phase 1: Project Setup

### 1. **Initialize Next.js app with TypeScript**

* **Start** : You have nothing.
* **End** : `npx create-next-app@latest flight-to-calendar` runs successfully with TypeScript.

### 2. **Enable App Router & Tailwind CSS**

* **Start** : Clean Next.js project.
* **End** : Tailwind CSS is configured, and `app/page.tsx` uses it.

### 3. **Add `globals.css` and clean boilerplate**

* **Start** : Default boilerplate in `app/page.tsx`.
* **End** : Empty home page with clean layout, minimal Tailwind styles, and working development server.

---

## 📤 Phase 2: Input Form (Flight Info Input)

### 4. **Create `<FlightForm />` component with flight number + date input**

* **Start** : Empty `components/FlightForm.tsx`.
* **End** : Form renders with flight number (text) and date (date picker). Local state works.

### 5. **Lift form state to `page.tsx` and log values on submit**

* **Start** : `FlightForm` only handles internal state.
* **End** : Parent page manages state and logs `flightNumber` and `flightDate` on submit.

### 6. **Add input validation and disable submit until valid**

* **Start** : Submit button always active.
* **End** : Form only submits if flight number and date are filled correctly. Show inline errors.

---

## 🌐 Phase 3: Fetch Flight Data

### 7. **Create `lib/flightAPI.ts` with mock function**

* **Start** : `flightAPI.ts` is empty.
* **End** : Function `getFlightInfo(flightNumber: string, date: string)` returns mocked flight data.

### 8. **Call `getFlightInfo()` on submit and show result JSON**

* **Start** : Form just logs input.
* **End** : After submit, JSON of mocked flight data is rendered on screen.

### 9. **Replace mock with real flight API call**

* **Start** : `flightAPI.ts` uses mock data.
* **End** : Calls real API (e.g., AeroDataBox) using `.env.local` for API key. Handles error states.

---

## 📄 Phase 4: Display Flight Info

### 10. **Create `<FlightInfo />` component to display flight details**

* **Start** : You display raw JSON.
* **End** : Show formatted info like origin, destination, departure/arrival time.

### 11. **Format timestamps to human-readable local time**

* **Start** : Timestamps are raw UTC or ISO.
* **End** : Times show in local format (e.g., `3:40 PM – Apr 2`), using `date-fns` or `luxon`.

---

## 🗓️ Phase 5: Add-to-Calendar Functionality

### 12. **Create `lib/calendar.ts` with Google Calendar link generator**

* **Start** : `calendar.ts` is empty.
* **End** : Function `getGoogleCalendarLink(flight: FlightInfo)` returns a working URL.

### 13. **Create `<CalendarButton />` component for Google Calendar**

* **Start** : No button.
* **End** : Button appears and opens Google Calendar with pre-filled event.

### 14. **Add .ics download support for Apple/Outlook**

* **Start** : Only Google Calendar is supported.
* **End** : Generates `.ics` file, downloads when user clicks "Add to Apple/Outlook".

---

## 🧪 Phase 6: UX & Routing

### 15. **Move calendar functionality to `/result` route**

* **Start** : Everything happens on home page.
* **End** : Form submits and redirects to `/result` with flight info shown.

### 16. **Pass state to `/result` using URL query (or `searchParams`)**

* **Start** : Flight info not persisted between pages.
* **End** : `/result` reads `flightNumber` and `date` from URL and re-fetches flight info.

---

## 👤 Phase 7: Optional Supabase Auth (for user login)

### 17. **[Optional] Set up Supabase client in `lib/supabase.ts`**

* **Start** : No Supabase setup.
* **End** : Supabase initialized with env vars.

### 18. **[Optional] Add login/signup using Supabase Auth UI**

* **Start** : No login functionality.
* **End** : Users can sign up or log in via email/password.

### 19. **[Optional] Store fetched flights in Supabase per user**

* **Start** : Flight queries are ephemeral.
* **End** : Each flight search is saved and queryable per user.

---

## 🎁 Phase 8: Polish & Final MVP Test

### 20. **Test full flow: input → result → calendar**

* **Start** : Features are built independently.
* **End** : User can go from form to event added in Google/Apple calendar.

### 21. **Add loading + error states to form + results**

* **Start** : No user feedback during async ops.
* **End** : Show spinner while loading, and friendly errors on failure.

### 22. **Deploy to Vercel**

* **Start** : Local-only app.
* **End** : Live deployment with `.env.production` set up correctly.

---

Let me know if you'd like these tasks output as JSON or a task queue for automation with an LLM agent.
