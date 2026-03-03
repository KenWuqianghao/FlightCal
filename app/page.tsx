import { FlightSelector } from "@/components/flight-selector"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground relative overflow-hidden grain">
      {/* Energetic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-blob [animation-delay:4s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50"></div>
      </div>

      <div className="w-full max-w-xl z-10 flex flex-col items-center">
        {/* Animated Header */}
        <header className="flex flex-col items-center justify-center mb-16 text-center animate-in fade-in zoom-in slide-in-from-top-8 duration-1000 ease-out">
          <div className="mb-8 p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-md float-3d perspective-1000 preserve-3d">
             <svg className="w-12 h-12 text-primary text-glow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
            Flight Calendar
          </h1>
          <p className="text-primary/60 text-sm font-bold uppercase tracking-[0.3em] animate-pulse">
            Redefining Travel Planning
          </p>
        </header>

        {/* Content Container */}
        <div className="w-full perspective-1000 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <FlightSelector />
        </div>

        {/* Footer */}
        <footer className="mt-20 text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] animate-in fade-in duration-1000 delay-1000 fill-mode-both">
          Designed for excellence & elegance
        </footer>
      </div>
    </main>
  )
}
