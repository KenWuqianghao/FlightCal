# Flight to Calendar App

An application to quickly fetch flight information and add it to your Google Calendar or download it as an .ics file for other calendar applications.

## Features

- **Flight Information Retrieval:** Enter a flight number and date to get details using the AeroDataBox API.
- **Airline Logo Display:** Shows the airline's logo based on its IATA code via the Travelpayouts Aviasales logo service.
- **Add to Google Calendar:** Generates a direct link to add the flight details to your Google Calendar.
- **Download .ics File:** Allows downloading flight details as an .ics file, compatible with Apple Calendar, Outlook, and other calendar clients.
- **Responsive Design:** Flight information is displayed in a clean, responsive card format.
- **API Key Flexibility:** Uses a default API key (provided by the app deployer) with an option for users to input their own AeroDataBox API key if needed.
- **Toast Notifications:** Provides user feedback for actions like fetching data, successful downloads, or errors.

## Tech Stack

- **Next.js (App Router):** React framework for server-side rendering and static site generation.
- **TypeScript:** For static typing and improved developer experience.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Shadcn/ui:** Re-usable UI components (like Button, Card, Input, Popover, Calendar, Toast, Tooltip).
- **Lucide React:** For icons.
- **date-fns:** For date formatting and calculations.
- **ics:** Library to generate iCalendar (.ics) files.
- **Vercel:** For deployment.

## Project Setup & Running Locally

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd <repository-name>
   ```
2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
3. **Set up Environment Variables:**
   Create a file named `.env.local` in the root of your project. Add the following environment variable, replacing `<your_default_api_key>` with the default AeroDataBox API key you want the application to use:

   ```env
   NEXT_PUBLIC_DEFAULT_AERO_DATABOX_API_KEY=<your_default_api_key>
   ```

   This key will be used by default. Users can optionally override it in the UI if this key reaches its limits or if they prefer to use their own.
4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Website Icon (Favicon)

- The application uses `public/flight-logo.png` as its website icon.
- Ensure this file exists in the `public` directory.
- The icon configuration is in `app/layout.tsx` within the `metadata.icons` object.

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/), the creators of Next.js.

1. **Push your code** to a Git repository (GitHub, GitLab, Bitbucket).
2. **Import your project** into Vercel.
3. **Configure Environment Variables** in Vercel project settings:
   - `NEXT_PUBLIC_DEFAULT_AERO_DATABOX_API_KEY`: Set this to your default AeroDataBox API key that will be used by the deployed application.
4. **Deploy!** Vercel will automatically build and deploy your Next.js application.

## API Key Usage

- The application requires an API key for the [AeroDataBox API](https://rapidapi.com/aerodatabox/api/aerodatabox) to fetch flight data.
- A default key is configured through the `NEXT_PUBLIC_DEFAULT_AERO_DATABOX_API_KEY` environment variable. Users will use this key by default.
- If the default key experiences issues (e.g., rate limits are hit), users have the option to enter their own AeroDataBox API key directly in the UI. This user-provided key is used for the session and is not stored by the application.
