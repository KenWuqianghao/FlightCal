"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AirplaneTakeoff, Key, Info, CircleNotch, CalendarBlank } from "@phosphor-icons/react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { getFlightInfo } from "@/lib/flightAPI"
import { FlightInfo } from "@/types/flight"
import MagneticButton from "@/components/MagneticButton"

const DEFAULT_API_KEY = process.env.NEXT_PUBLIC_DEFAULT_AERO_DATABOX_API_KEY || ""

const spring = { type: "spring" as const, stiffness: 300, damping: 30 }

const formFieldVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay: 0.7 + i * 0.12 },
  }),
}

interface FlightSelectorProps {
  onFlightFound: (data: FlightInfo) => void
  hasResult: boolean
}

export function FlightSelector({ onFlightFound, hasResult }: FlightSelectorProps) {
  const [flightNumber, setFlightNumber] = useState("")
  const [date, setDate] = useState<Date>()
  const [userApiKey, setUserApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const apiKeyToUse = userApiKey.trim() || DEFAULT_API_KEY

    if (!flightNumber || !date || !apiKeyToUse) {
      toast({
        title: "Incomplete details",
        description: "Please enter your flight number and departure date.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const data = await getFlightInfo(flightNumber, formattedDate, apiKeyToUse)
      onFlightFound(data)
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
    <motion.div
      layout
      transition={spring}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-surface rounded-2xl transition-all duration-300",
        hasResult ? "p-5 lg:p-5" : "p-8 lg:p-10"
      )}
    >
      <form onSubmit={handleSubmit} className={hasResult ? "space-y-3" : "space-y-8"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            custom={0}
            variants={formFieldVariants}
            initial="hidden"
            animate="visible"
            className={hasResult ? "space-y-1.5" : "space-y-3"}
          >
            <Label
              htmlFor="flight-number"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground ml-1"
            >
              Flight Number
            </Label>
            <div className="relative group">
              <AirplaneTakeoff
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-primary",
                  hasResult ? "h-4 w-4" : "h-5 w-5"
                )}
                weight="duotone"
              />
              <Input
                id="flight-number"
                placeholder="e.g. BA1326"
                aria-required="true"
                className={cn(
                  "bg-white/[0.04] border-white/[0.08] rounded-xl font-medium tracking-tight transition-all duration-200 focus:bg-white/[0.07] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 placeholder:text-white/15",
                  hasResult ? "h-10 pl-10 text-sm" : "h-14 pl-12 text-lg"
                )}
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
              />
            </div>
          </motion.div>

          <motion.div
            custom={1}
            variants={formFieldVariants}
            initial="hidden"
            animate="visible"
            className={hasResult ? "space-y-1.5" : "space-y-3"}
          >
            <Label className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground ml-1">
              Departure Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  aria-label="Select departure date"
                  className={cn(
                    "w-full justify-start text-left rounded-xl bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07] hover:border-primary/30 transition-all duration-200 group",
                    hasResult ? "h-10 px-3 text-sm" : "h-14 px-4",
                    !date && "text-white/15",
                    date && !hasResult && "text-white text-lg font-medium",
                    date && hasResult && "text-white text-sm font-medium"
                  )}
                >
                  <CalendarBlank
                    className={cn(
                      "mr-2 text-white/20 transition-colors group-hover:text-primary/50",
                      hasResult ? "h-4 w-4" : "h-5 w-5 mr-3"
                    )}
                    weight="duotone"
                  />
                  {date ? format(date, "MMM d, yyyy") : "When are you flying?"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-background border-white/[0.08] rounded-xl overflow-hidden shadow-2xl backdrop-blur-3xl"
                align="end"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="p-4"
                />
              </PopoverContent>
            </Popover>
          </motion.div>
        </div>

        {/* API key — hidden when compact */}
        <AnimatePresence>
          {!hasResult && (
            <motion.div
              initial={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, overflow: "hidden" }}
              transition={spring}
              className="space-y-3"
            >
              <div className="flex items-center justify-between ml-1">
                <Label
                  htmlFor="api-key"
                  className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/60"
                >
                  API Key (Optional)
                </Label>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="cursor-help" aria-label="API Key Information">
                      <Info
                        className="h-4 w-4 text-white/20 hover:text-primary/60 transition-colors"
                        weight="duotone"
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-card border-white/[0.08] text-white/80 p-3 rounded-lg shadow-2xl max-w-xs"
                    >
                      <p className="text-xs leading-relaxed">
                        We use a shared key, but you can provide your own from AeroDataBox if needed.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative group">
                <Key
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 transition-colors group-focus-within:text-primary"
                  weight="duotone"
                />
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Optional override"
                  className="bg-white/[0.04] border-white/[0.08] h-14 pl-12 rounded-xl font-medium transition-all duration-200 focus:bg-white/[0.07] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 placeholder:text-white/15"
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: hasResult ? 0 : 1.2 }}
        >
          <MagneticButton
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className={cn(
              "w-full rounded-xl font-semibold transition-all duration-300 active:scale-[0.98]",
              "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_8px_24px_rgba(212,96,62,0.25)] hover:shadow-[0_12px_32px_rgba(212,96,62,0.35)] tracking-tight",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              hasResult ? "h-10 text-sm" : "h-14 text-base"
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2" aria-live="polite">
                <CircleNotch className="h-4 w-4 animate-spin" weight="bold" />
                Searching...
              </span>
            ) : (
              "Track Flight"
            )}
          </MagneticButton>
        </motion.div>
      </form>
    </motion.div>
  )
}
