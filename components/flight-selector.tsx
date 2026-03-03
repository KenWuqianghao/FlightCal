"use client"

import type React from "react"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { CalendarIcon, PlaneTakeoff, KeyRound, Info, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { getFlightInfo } from "@/lib/flightAPI"
import { FlightInfo } from "@/types/flight"
import FlightCard from "@/components/FlightCard"

const DEFAULT_API_KEY = process.env.NEXT_PUBLIC_DEFAULT_AERO_DATABOX_API_KEY || "";

export function FlightSelector() {
  const [flightNumber, setFlightNumber] = useState("")
  const [date, setDate] = useState<Date>()
  const [userApiKey, setUserApiKey] = useState("")
  const [flightData, setFlightData] = useState<FlightInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const apiKeyToUse = userApiKey.trim() || DEFAULT_API_KEY;

    if (!flightNumber || !date || !apiKeyToUse) {
      toast({
        title: "Incomplete details",
        description: "Please enter your flight number and departure date.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setFlightData(null)
    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const data = await getFlightInfo(flightNumber, formattedDate, apiKeyToUse)
      setFlightData(data)
    } catch (error) {
      console.error("Error fetching flight info:", error)
      toast({
        title: "Flight not found",
        description: "We couldn't retrieve information for this flight. Please check the flight number and date.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
      <div className="glass-card rounded-[2.5rem] p-10 shadow-[0_48px_80px_-16px_rgba(0,0,0,0.8)] border border-white/5 relative overflow-hidden tilt-3d">
        {/* Top Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60"></div>

        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label htmlFor="flight-number" className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 ml-1">
                Flight Number
              </Label>
              <div className="relative group transition-transform hover:scale-[1.02] duration-300">
                <PlaneTakeoff className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 transition-colors group-focus-within:text-primary group-hover:text-primary/40" />
                <Input
                  id="flight-number"
                  placeholder="e.g. BA1326"
                  className="bg-white/5 border-white/10 h-16 pl-14 rounded-2xl text-xl font-bold tracking-tight transition-all duration-300 focus:bg-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 placeholder:text-white/10"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 ml-1">
                Departure Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left h-16 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/40 px-5 transition-all duration-300 group hover:scale-[1.02]",
                      !date && "text-white/20",
                      date && "text-white text-xl font-bold"
                    )}
                  >
                    <CalendarIcon className="mr-4 h-5 w-5 text-white/20 transition-colors group-hover:text-primary/40" />
                    {date ? format(date, "MMM d, yyyy") : "When are you flying?"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-3xl" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                    className="p-4"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between ml-1">
              <Label htmlFor="api-key" className="text-xs font-black uppercase tracking-[0.2em] text-primary/40">
                API Key (Optional)
              </Label>
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className="cursor-help">
                    <Info className="h-4 w-4 text-white/20 hover:text-primary/60 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-zinc-900 border-white/10 text-white/80 p-3 rounded-xl shadow-2xl max-w-xs">
                    <p className="text-xs font-medium leading-relaxed">
                      We use a shared key, but you can provide your own from AeroDataBox if needed.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative group transition-transform hover:scale-[1.01] duration-300">
              <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 transition-colors group-focus-within:text-primary group-hover:text-primary/40" />
              <Input
                id="api-key"
                type="password"
                placeholder="Optional override"
                className="bg-white/5 border-white/10 h-16 pl-14 rounded-2xl font-bold transition-all duration-300 focus:bg-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 placeholder:text-white/10"
                value={userApiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full h-18 py-8 rounded-3xl text-xl font-black transition-all duration-500 transform active:scale-95 shadow-[0_20px_40px_rgba(217,110,96,0.3)]",
              "bg-gradient-to-br from-primary via-[#E07A6D] to-primary hover:shadow-[0_25px_60px_rgba(217,110,96,0.5)] border-t border-white/30 hover:scale-[1.02] tracking-tight uppercase"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Searching...
              </span>
            ) : (
              "Track Flight"
            )}
          </Button>
        </form>
      </div>

      {flightData && (
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 fill-mode-both perspective-1000">
          <FlightCard flight={flightData} />
        </div>
      )}
    </div>
  )
}
