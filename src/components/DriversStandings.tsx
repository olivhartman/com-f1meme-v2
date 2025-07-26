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

interface PositionData {
  driver_number: number
  position: number
  date: string
}

interface DriverData {
  driver_number: number
  full_name?: string
  team_name?: string
  team_color?: string
}

export default function DriversStandings() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [sessionInfo, setSessionInfo] = useState<Session>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const CACHE_KEY = 'f1_drivers_standings';

  useEffect(() => {
    async function fetchData() {
      try {
        // Check if we need to invalidate cache (new race detected)
        const checkForNewRace = async () => {
          try {
            const currentYear = new Date().getFullYear()
            const racesRes = await fetch(`https://api.jolpi.ca/ergast/f1/${currentYear}.json`)
            const racesData = await racesRes.json()
            
            if (racesData.MRData?.RaceTable?.Races?.length > 0) {
              const races = racesData.MRData.RaceTable.Races
              const now = new Date()
              
              // Find the most recent completed race
              for (let i = races.length - 1; i >= 0; i--) {
                const raceDate = new Date(races[i].date)
                const raceEndTime = new Date(raceDate.getTime() + (3 * 60 * 60 * 1000))
                if (raceEndTime < now) {
                  // Check if this is a different race than what we have cached
                  const cached = localStorage.getItem(CACHE_KEY)
                  if (cached) {
                    try {
                      const parsed = JSON.parse(cached)
                      if (parsed.sessionInfo?.meeting_name !== races[i].raceName) {
                        console.log('[DriversStandings] New race detected, clearing cache')
                        localStorage.removeItem(CACHE_KEY)
                        return true // New race detected
                      }
                    } catch {
                      // Invalid cache, remove it
                      localStorage.removeItem(CACHE_KEY)
                    }
                  }
                  break
                }
              }
            }
          } catch (err) {
            console.error('[DriversStandings] Error checking for new race:', err)
          }
          return false
        }

        // Check for new race first
        const hasNewRace = await checkForNewRace()

        // First, try to get the most recent completed race from Ergast API
        const currentYear = new Date().getFullYear()
        const racesRes = await fetch(`https://api.jolpi.ca/ergast/f1/${currentYear}.json`)
        const racesData = await racesRes.json()
        
        let latestCompletedRace = null
        if (racesData.MRData?.RaceTable?.Races?.length > 0) {
          const races = racesData.MRData.RaceTable.Races
          const now = new Date()
          
          // Find the most recent completed race
          for (let i = races.length - 1; i >= 0; i--) {
            const raceDate = new Date(races[i].date)
            // Add 3 hours to account for race duration
            const raceEndTime = new Date(raceDate.getTime() + (3 * 60 * 60 * 1000))
            if (raceEndTime < now) {
              latestCompletedRace = races[i]
              break
            }
          }
        }

        if (latestCompletedRace) {
          console.log('[DriversStandings] Latest completed race:', latestCompletedRace.raceName)
          
          // Try to get results from Ergast first (usually faster than openf1)
          try {
            const resultsRes = await fetch(`https://api.jolpi.ca/ergast/f1/${currentYear}/${latestCompletedRace.round}/results.json`)
            const resultsData = await resultsRes.json()
            const race = resultsData.MRData?.RaceTable?.Races?.[0]
            
            if (race && race.Results) {
              setSessionInfo({ 
                meeting_name: race.raceName, 
                session_name: "Race" 
              })
              
              const enrichedDrivers = race.Results.slice(0, 3).map((result: any) => ({
                driver_number: parseInt(result.number, 10),
                position: parseInt(result.position, 10),
                full_name: `${result.Driver.givenName} ${result.Driver.familyName}`,
                team_name: result.Constructor?.name,
                team_color: undefined // Ergast doesn't provide team color
              }))
              
              setDrivers(enrichedDrivers)
              setLoading(false)
              setError(null)
              setLastUpdated(new Date().toISOString())
              
              // Cache the result
              localStorage.setItem(CACHE_KEY, JSON.stringify({ 
                drivers: enrichedDrivers, 
                sessionInfo: { meeting_name: race.raceName, session_name: "Race" },
                lastUpdated: new Date().toISOString()
              }))
              return
            }
          } catch (ergastError) {
            console.log('[DriversStandings] Ergast results failed, trying openf1:', ergastError)
          }
        }

        // Fallback to openf1 API - try to find the specific session for the latest race
        console.log('[DriversStandings] Trying openf1 API...')
        
        // Get all sessions and find the most recent race session
        const sessionsRes = await fetch("https://api.openf1.org/v1/sessions")
        const sessionsData = await sessionsRes.json()
        
        // Find the most recent completed race session
        const now = new Date()
        let latestRaceSession = null
        
        for (const session of sessionsData) {
          if (session.session_name === 'Race' && session.date) {
            const sessionDate = new Date(session.date)
            // Add 3 hours for race duration
            const sessionEndTime = new Date(sessionDate.getTime() + (3 * 60 * 60 * 1000))
            if (sessionEndTime < now) {
              if (!latestRaceSession || sessionDate > new Date(latestRaceSession.date)) {
                latestRaceSession = session
              }
            }
          }
        }

        if (latestRaceSession) {
          console.log('[DriversStandings] Found latest race session:', latestRaceSession)
          
          setSessionInfo({
            meeting_name: latestRaceSession.meeting_name,
            session_name: latestRaceSession.session_name
          })

          // Get positions for this specific session
          const posRes = await fetch(`https://api.openf1.org/v1/position?session_key=${latestRaceSession.session_key}`)
          const posData = await posRes.json()
          
          // Get latest position for each driver
          const latestPositions = posData.reduce((acc: Record<number, PositionData>, curr: PositionData) => {
            if (!acc[curr.driver_number] || new Date(curr.date) > new Date(acc[curr.driver_number].date)) {
              acc[curr.driver_number] = curr
            }
            return acc
          }, {})

          // Convert to array and get top 3
          const top3 = Object.values(latestPositions)
            .sort((a: PositionData, b: PositionData) => a.position - b.position)
            .slice(0, 3)

          // Get driver details for this session
          const driversRes = await fetch(`https://api.openf1.org/v1/drivers?session_key=${latestRaceSession.session_key}`)
          const driversData = await driversRes.json()

          // Combine data
          const enrichedDrivers = top3.map((pos: PositionData) => {
            const driverInfo = driversData.find((d: DriverData) => d.driver_number === pos.driver_number)
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
          setLastUpdated(new Date().toISOString())
          
          // Cache the result
          localStorage.setItem(CACHE_KEY, JSON.stringify({ 
            drivers: enrichedDrivers, 
            sessionInfo: {
              meeting_name: latestRaceSession.meeting_name,
              session_name: latestRaceSession.session_name
            },
            lastUpdated: new Date().toISOString()
          }))
        } else {
          throw new Error("No recent race session found")
        }
      } catch (err) {
        console.error('[DriversStandings] Error fetching data:', err)
        
        // Try to load from cache
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            setDrivers(parsed.drivers || [])
            setSessionInfo(parsed.sessionInfo || {})
            setLastUpdated(parsed.lastUpdated || null)
            setError(null)
          } catch {
            setError("Race data temporarily unavailable. Please try again later.")
          }
        } else {
          setError("Race data temporarily unavailable. Please try again later.")
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
        {lastUpdated && (
          <p className="text-sm text-gray-400">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
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