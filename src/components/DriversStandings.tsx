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

interface ErgastResult {
  number: string
  position: string
  Driver: {
    givenName: string
    familyName: string
  }
  Constructor?: {
    name: string
  }
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
        // PRIORITY 1: Try Jolpi openf1 proxy with session_key=latest
        console.log('[DriversStandings] Trying Jolpi openf1 proxy...')
        
        try {
          // Get all sessions first, then find the most recent one with results
          const sessionRes = await fetch("https://api.jolpi.ca/openf1/sessions")
        const sessionData = await sessionRes.json()
          console.log('[DriversStandings] All sessions from Jolpi:', sessionData)
          
          // Find the most recent session that has position data
          let latestSessionWithResults = null
          
          // Sort sessions by date (most recent first)
          const sortedSessions = sessionData
            .filter((session: { date?: string }) => session.date)
            .sort((a: { date: string }, b: { date: string }) => new Date(b.date).getTime() - new Date(a.date).getTime())
          
          // Debug: List all sessions with their results
          console.log('[DriversStandings] === ALL SESSIONS WITH RESULTS ===')
          const sessionsWithResults: Array<{meeting_name: string, session_name: string, date: string, hasResults: boolean}> = []
          
          for (const session of sortedSessions) {
            try {
              const posRes = await fetch(`https://api.jolpi.ca/openf1/position?session_key=${session.session_key}`)
              const posData = await posRes.json()
              
              const hasResults = posData && Array.isArray(posData) && posData.length > 0
              sessionsWithResults.push({
                meeting_name: session.meeting_name,
                session_name: session.session_name,
                date: session.date,
                hasResults
              })
              
              if (hasResults) {
                console.log(`[DriversStandings] ✅ ${session.meeting_name} - ${session.session_name} (${session.date}) - ${posData.length} position records`)
                if (!latestSessionWithResults) {
                  latestSessionWithResults = session
                }
              } else {
                console.log(`[DriversStandings] ❌ ${session.meeting_name} - ${session.session_name} (${session.date}) - No position data`)
              }
            } catch {
              sessionsWithResults.push({
                meeting_name: session.meeting_name,
                session_name: session.session_name,
                date: session.date,
                hasResults: false
              })
              console.log(`[DriversStandings] ❌ ${session.meeting_name} - ${session.session_name} (${session.date}) - Error fetching position data`)
              continue
            }
          }
          
          console.log('[DriversStandings] === END SESSIONS LIST ===')
          
          if (latestSessionWithResults) {
            setSessionInfo({
              meeting_name: latestSessionWithResults.meeting_name || `${latestSessionWithResults.country_name} Grand Prix`,
              session_name: latestSessionWithResults.session_name
            })

            // Get current positions
            const posRes = await fetch(`https://api.jolpi.ca/openf1/position?session_key=${latestSessionWithResults.session_key}`)
        const posData = await posRes.json()
        
        // Get latest position for each driver
            const latestPositions = posData.reduce((acc: Record<number, PositionData>, curr: PositionData) => {
          if (!acc[curr.driver_number] || new Date(curr.date) > new Date(acc[curr.driver_number].date)) {
            acc[curr.driver_number] = curr
          }
          return acc
        }, {})

        // Convert to array and get top 3
            const top3 = (Object.values(latestPositions) as PositionData[])
              .sort((a, b) => a.position - b.position)
          .slice(0, 3)

        // Get driver details
            const driversRes = await fetch(`https://api.jolpi.ca/openf1/drivers?session_key=${latestSessionWithResults.session_key}`)
        const driversData = await driversRes.json()

        // Combine data
            const enrichedDrivers = (top3 as PositionData[]).map((pos) => {
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
        
        // Cache the result
        localStorage.setItem(CACHE_KEY, JSON.stringify({ 
          drivers: enrichedDrivers, 
          sessionInfo: {
            meeting_name: latestSessionWithResults.meeting_name,
            session_name: latestSessionWithResults.session_name
          }
        }))
            return // Successfully got data from Jolpi, exit early
          }
        } catch (jolpiError) {
          console.log('[DriversStandings] Jolpi openf1 proxy failed, trying api.openf1.org fallback:', jolpiError)
        }

        // PRIORITY 2: Fallback to api.openf1.org with session_key=latest
        console.log('[DriversStandings] Trying api.openf1.org fallback...')
        
        try {
          // Get session info first
          const sessionRes = await fetch("https://api.openf1.org/v1/sessions?session_key=latest")
          const sessionData = await sessionRes.json()
          const latestSession = sessionData[0] || {}
          
          if (latestSession.session_key) {
            setSessionInfo({
              meeting_name: latestSession.meeting_name,
              session_name: latestSession.session_name
            })

            // Get current positions
            const posRes = await fetch(`https://api.openf1.org/v1/position?session_key=${latestSession.session_key}`)
            const posData = await posRes.json()

            // Handle openf1 session in progress/auth error
            if (posData.detail && typeof posData.detail === 'string' && posData.detail.includes('Session in progress')) {
              throw new Error('Session in progress, access restricted')
            }
            
            // Get latest position for each driver
            const latestPositions = posData.reduce((acc: Record<number, PositionData>, curr: PositionData) => {
              if (!acc[curr.driver_number] || new Date(curr.date) > new Date(acc[curr.driver_number].date)) {
                acc[curr.driver_number] = curr
              }
              return acc
            }, {})

            // Convert to array and get top 3
            const top3 = (Object.values(latestPositions) as PositionData[])
              .sort((a, b) => a.position - b.position)
              .slice(0, 3)

            // Get driver details
            const driversRes = await fetch(`https://api.openf1.org/v1/drivers?session_key=${latestSession.session_key}`)
            const driversData = await driversRes.json()

            // Handle openf1 session in progress/auth error for drivers
            if (driversData.detail && typeof driversData.detail === 'string' && driversData.detail.includes('Session in progress')) {
              throw new Error('Session in progress, access restricted')
            }

            // Combine data
            const enrichedDrivers = (top3 as PositionData[]).map((pos) => {
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
            
            // Cache the result
            localStorage.setItem(CACHE_KEY, JSON.stringify({ 
              drivers: enrichedDrivers, 
              sessionInfo: {
                meeting_name: latestSession.meeting_name,
                session_name: latestSession.session_name
              }
            }))
            return // Successfully got data from api.openf1.org, exit early
          }
        } catch (openf1Error) {
          console.log('[DriversStandings] api.openf1.org failed, trying Ergast fallback:', openf1Error)
        }

        // PRIORITY 3: Fallback to Ergast API for completed main races only
        console.log('[DriversStandings] Trying Ergast API fallback...')
        
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
          console.log('[DriversStandings] Latest completed race from Ergast:', latestCompletedRace.raceName)
          
          // Try to get results from Ergast
          try {
            const resultsRes = await fetch(`https://api.jolpi.ca/ergast/f1/${currentYear}/${latestCompletedRace.round}/results.json`)
            const resultsData = await resultsRes.json()
            const race = resultsData.MRData?.RaceTable?.Races?.[0]
            
          if (race && race.Results) {
              setSessionInfo({ 
                meeting_name: race.raceName, 
                session_name: "Race" 
              })
              
              const enrichedDrivers = (race.Results.slice(0, 3) as Array<ErgastResult>).map((result) => ({
              driver_number: parseInt(result.number, 10),
              position: parseInt(result.position, 10),
              full_name: `${result.Driver.givenName} ${result.Driver.familyName}`,
              team_name: result.Constructor?.name,
                team_color: undefined // Ergast doesn't provide team color
            }))
              
                        setDrivers(enrichedDrivers)
            setLoading(false)
            setError(null)
            
            // Cache the result
            localStorage.setItem(CACHE_KEY, JSON.stringify({ 
              drivers: enrichedDrivers, 
              sessionInfo: { meeting_name: race.raceName, session_name: "Race" }
            }))
            return
            }
          } catch (ergastError) {
            console.log('[DriversStandings] Ergast results failed:', ergastError)
          }
        }

        // If we get here, all APIs failed
        throw new Error("No recent session data available")
      } catch (err) {
        console.error('[DriversStandings] Error fetching data:', err)
        
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
        <h2 className="text-2xl font-bold font-['Orbitron']">{sessionInfo.meeting_name}</h2>
        <p className="text-sm text-gray-400">{sessionInfo.session_name}</p>
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
                <span className="text-2xl font-bold font-['Orbitron']">
                  {driver.position === 1 ? "🥇" : driver.position === 2 ? "🥈" : "🥉"}
                </span>
                <div>
                  <div className="font-bold font-['Orbitron']">{driver.full_name || `Driver ${driver.driver_number}`}</div>
                  <div className="text-sm opacity-75">{driver.team_name}</div>
                </div>
              </div>
              <div className="text-3xl font-bold font-['Orbitron']">#{driver.driver_number}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 