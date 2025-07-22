"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "./ui/card"

interface Driver {
  driver_number: number
  position: number
  full_name?: string
  team_name?: string
  team_color?: string
}

interface Session {
  meeting_name?: string
  session_name?: string
}

export default function DriversStandings() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [sessionInfo, setSessionInfo] = useState<Session>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const CACHE_KEY = 'f1_drivers_standings';

  useEffect(() => {
    async function fetchData() {
      try {
        // Try openf1 API first
        const sessionRes = await fetch("https://api.openf1.org/v1/sessions?session_key=latest")
        const sessionData = await sessionRes.json()
        const latestSession = sessionData[0] || {}
        setSessionInfo({
          meeting_name: latestSession.meeting_name,
          session_name: latestSession.session_name
        })

        // Get current positions
        const posRes = await fetch("https://api.openf1.org/v1/position?session_key=latest")
        const posData = await posRes.json()
        
        // Get latest position for each driver
        const latestPositions = posData.reduce((acc: any, curr: any) => {
          if (!acc[curr.driver_number] || new Date(curr.date) > new Date(acc[curr.driver_number].date)) {
            acc[curr.driver_number] = curr
          }
          return acc
        }, {})

        // Convert to array and get top 3
        const top3 = Object.values(latestPositions)
          .sort((a: any, b: any) => a.position - b.position)
          .slice(0, 3)

        // Get driver details
        const driversRes = await fetch("https://api.openf1.org/v1/drivers?session_key=latest")
        const driversData = await driversRes.json()

        // Combine data
        const enrichedDrivers = top3.map((pos: any) => {
          const driverInfo = driversData.find((d: any) => d.driver_number === pos.driver_number)
          return {
            driver_number: pos.driver_number,
            position: pos.position,
            full_name: driverInfo?.full_name,
            team_name: driverInfo?.team_name,
            team_color: driverInfo?.team_color
          }
        })

        setDrivers(enrichedDrivers)
        setLoading(false)
        setError(null)
        // Cache the result
        localStorage.setItem(CACHE_KEY, JSON.stringify({ drivers: enrichedDrivers, sessionInfo }))
      } catch (err) {
        // Fallback: Jolpi Ergast Proxy
        try {
          const ergastRes = await fetch("https://api.jolpi.ca/ergast/f1/current/last/results.json")
          const ergastData = await ergastRes.json()
          const race = ergastData.MRData?.RaceTable?.Races?.[0]
          if (race && race.Results) {
            setSessionInfo({ meeting_name: race.raceName, session_name: "Race" })
            const enrichedDrivers = race.Results.slice(0, 3).map((result: any) => ({
              driver_number: parseInt(result.number, 10),
              position: parseInt(result.position, 10),
              full_name: `${result.Driver.givenName} ${result.Driver.familyName}`,
              team_name: result.Constructor?.name,
              team_color: undefined // Ergast does not provide team color
            }))
            setDrivers(enrichedDrivers)
            setError(null)
            setLoading(false)
            // Cache the fallback result
            localStorage.setItem(CACHE_KEY, JSON.stringify({ drivers: enrichedDrivers, sessionInfo: { meeting_name: race.raceName, session_name: "Race" } }))
            return
          }
        } catch {
          // Try to load from cache
          const cached = localStorage.getItem(CACHE_KEY)
          if (cached) {
            try {
              const parsed = JSON.parse(cached)
              setDrivers(parsed.drivers || [])
              setSessionInfo(parsed.sessionInfo || {})
              setError(null)
            } catch {
              setError("Race data temporarily unavailable. Please try again later.")
            }
          } else {
            setError("Race data temporarily unavailable. Please try again later.")
          }
        }
        setLoading(false)
      }
    }

    fetchData()
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div>Loading standings...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{sessionInfo.meeting_name}</h2>
      </div>
      <div className="grid gap-4">
        {drivers.map((driver) => (
          <Card 
            key={driver.driver_number}
            className="relative overflow-hidden"
            style={{
              background: `linear-gradient(90deg, ${driver.team_color || '#666'} 0%, transparent 100%)`
            }}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">
                  {driver.position === 1 ? "🥇" : driver.position === 2 ? "🥈" : "🥉"}
                </span>
                <div>
                  <h6 className="font-bold">{driver.full_name || `Driver ${driver.driver_number}`}</h6>
                  <div className="text-sm opacity-75">{driver.team_name}</div>
                </div>
              </div>
              <h6 className="text-3xl font-bold">#{driver.driver_number}</h6>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 