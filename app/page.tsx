import { FlightSelector } from "@/components/flight-selector"
import GlobeWrapper from "@/components/GlobeWrapper"

export default function Home() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      {/* Globe - right side on desktop, full background on mobile */}
      <div className="absolute inset-0 lg:left-[45%] opacity-30 lg:opacity-100 transition-opacity duration-800">
        <GlobeWrapper />
      </div>

      {/* Content grid */}
      <div className="relative z-10 grid min-h-[100dvh] grid-cols-1 lg:grid-cols-[1fr_0.6fr]">
        {/* Left column - form */}
        <div className="flex flex-col justify-center w-full px-4 py-8 lg:px-16 lg:py-12">
          {/* Runway accent line */}
          <div
            className="w-12 h-[2px] bg-primary mb-8 origin-left"
            style={{ animation: 'scaleX 0.6s ease-out 0.3s both' }}
          />

          <header className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
              FlightCal
            </h1>
            <p className="text-muted-foreground text-sm tracking-wide">
              Search your flight. Export to calendar.
            </p>
          </header>

          <FlightSelector />

          <footer className="mt-16 text-white/15 text-[10px] font-medium uppercase tracking-[0.2em]">
            Precision aviation tools
          </footer>
        </div>

        {/* Right column - globe space (desktop only) */}
        <div className="hidden lg:block" aria-hidden="true" />
      </div>

      <style>{`
        @keyframes scaleX {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </main>
  )
}
