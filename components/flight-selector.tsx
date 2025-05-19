"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { CalendarIcon, PlaneTakeoff, KeyRound, Info } from "lucide-react"
import { format } from "date-fns"
import { getFlightInfo } from "@/lib/flightAPI"
import { FlightInfo } from "@/types/flight"
import FlightCard from "@/components/FlightCard"

// Attempt to get the default API key from environment variables, fallback to empty string
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
      let description = "Please enter flight number, select a date";
      if (!apiKeyToUse) {
        description += ", and provide an API key (the default key might be missing or exhausted).";
      } else {
        description += ".";
      }
      toast({
        title: "Missing information",
        description: description,
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
      toast({
        title: "Flight Info Fetched",
        description: `Successfully fetched data for ${flightNumber}.`,
      })
    } catch (error) {
      console.error("Error fetching flight info:", error)
      let errorMessage = "Failed to fetch flight information."
      if (error instanceof Error) {
        errorMessage = error.message
      }
       // Check if the error might be due to the default key and user hasn't provided one
      if (apiKeyToUse === DEFAULT_API_KEY && !userApiKey.trim() && error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('limit')) ) {
        errorMessage += " The default API key might have issues or reached its limit. Try entering your own API key.";
      }
      toast({
        title: "Error Fetching Flight Info",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in">
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="flight-number" className="text-sm font-medium">
              Flight Number
            </Label>
            <div className="relative">
              <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="flight-number"
                placeholder="e.g. BA1326"
                className="pl-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 focus:border-gray-400"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Flight Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 transition-all duration-200 focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 focus:border-gray-400",
                    !date && "text-gray-400",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-key" className="text-sm font-medium">
                API Key
              </Label>
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className="cursor-help">
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs bg-gray-800 text-white p-2 rounded-md shadow-lg">
                    <p className="text-xs">
                      A default free-tier API key is used. If it runs out or you have issues, you can enter your own AeroDataBox API key here. Your key won't be stored.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="api-key"
                type="password"
                placeholder="Using default key (optional override)"
                className="pl-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 focus:border-gray-400"
                value={userApiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full h-12 transition-all duration-300 text-white",
              "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Fetching Flight Info...
              </span>
            ) : (
              "Fetch Flight Info"
            )}
          </Button>
        </form>
      </div>

      {flightData && (
        <div className="p-8 pt-4 flex flex-col items-center space-y-4">
          <FlightCard flight={flightData} />
        </div>
      )}
    </div>
  )
}
