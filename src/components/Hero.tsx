"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import DriversStandings from "./DriversStandings"
import { useTranslation } from "../i18n/TranslationContext"
// IMPORTANT: Always type API data and function parameters. Enable 'noImplicitAny' in tsconfig.json for strict type safety.
// If you add new API calls, define and use types for all data.
// See: https://www.typescriptlang.org/tsconfig#noImplicitAny
import type { Race } from "../pages/schedule";
import { saveRaceWinners, WinnerEntry, winnersExistForRace } from '../api/airtable';
// import Link from "next/link"

interface NextRaceInfo {
  date: string
  time: string
  raceName: string
  circuit: string
}

interface LatestRaceInfo {
  meeting_name?: string
  session_name?: string
}

// Helper type guard to check if an object is a Race
function isRace(obj: unknown): obj is Race {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.date === 'string' &&
    typeof o.raceName === 'string' &&
    typeof o.Circuit === 'object' && o.Circuit !== null
  );
}

export default function Hero() {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [newsItems, setNewsItems] = useState<string[]>([
    t.additional.news1,
    t.additional.news2,
    t.additional.news3,
    t.additional.news4,
  ])
  const [nextRace, setNextRace] = useState<NextRaceInfo | null>(null)
  const [latestRace, setLatestRace] = useState<LatestRaceInfo>({})
  // Use Vimeo.Player | null if available, otherwise fallback to any
  const [player, setPlayer] = useState<null | { destroy: () => void }>(null)
  // Track last saved race to avoid duplicate saves
  const [lastSavedRace, setLastSavedRace] = useState<string | null>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const marqueeContentRef = useRef<HTMLSpanElement>(null);
  const [marqueeDuration, setMarqueeDuration] = useState(0);

  // Debug useEffect to log latestRace changes
  useEffect(() => {
    console.log('[Hero] latestRace state updated:', latestRace)
  }, [latestRace])

  useEffect(() => {
    const CACHE_KEY = 'next_f1_race';
    // Always show whatever is in localStorage immediately (even if stale)
    function getCachedRace(): NextRaceInfo | null {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      try {
        const { race } = JSON.parse(cached) as { race: NextRaceInfo, timestamp: number };
        return race;
      } catch {
        return null;
      }
    }
    function setCachedRace(race: NextRaceInfo) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ race, timestamp: Date.now() }));
    }
    // Show cached race instantly
    const cachedRace = getCachedRace();
    if (cachedRace) setNextRace(cachedRace);
    // Always update in the background
    async function fetchNextRace() {
      try {
        const API_URL = 'https://api.jolpi.ca/ergast/f1/races/';
        const PAGE_LIMIT = 100;
        const now = new Date();
        let offset = 0;
        let closestRace: Race | null = null;
        let minDiff = Infinity;
        while (true) {
          const url = `${API_URL}?offset=${offset}&limit=${PAGE_LIMIT}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
          const data = await res.json();
          const racesRaw = data.MRData.RaceTable.Races;
          if (!Array.isArray(racesRaw) || !racesRaw.length) break;
          const races: Race[] = racesRaw.filter(isRace);
          races.forEach((race: Race) => {
            const raceDateTime = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
            const diff = raceDateTime.getTime() - now.getTime();
            if (diff > 0 && diff < minDiff) {
              minDiff = diff;
              closestRace = race;
            }
          });
          if (closestRace) break;
          offset += PAGE_LIMIT;
        }
        if (closestRace !== null) {
          const race = closestRace as Race;
          const raceObj: NextRaceInfo = {
            date: race.date,
            time: race.time || '00:00:00',
            raceName: race.raceName,
            circuit: race.Circuit.circuitName,
          };
          setNextRace(raceObj);
          setCachedRace(raceObj);
        }
      } catch (err) {
        console.error('Failed to fetch next race:', err);
      }
    }
    fetchNextRace();
    
    // Fetch latest race info for the standings display
    async function fetchLatestRace() {
      console.log('[Hero] fetchLatestRace function called')
      try {
        // PRIORITY 1: Try Jolpi openf1 proxy with session_key=latest
        console.log('[Hero] Trying Jolpi openf1 proxy...')
        
      try {
          // Get all sessions first, then find the most recent one with results
          const sessionRes = await fetch("https://api.jolpi.ca/openf1/sessions")
          const sessionData = await sessionRes.json()
          console.log('[Hero] All sessions from Jolpi:', sessionData)
          
          // Find the most recent session that has position data
          let latestSessionWithResults = null
          
          // Sort sessions by date (most recent first)
          const sortedSessions = sessionData
            .filter((session: any) => session.date)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          
          // Check each session for position data
          for (const session of sortedSessions) {
            try {
              const posRes = await fetch(`https://api.jolpi.ca/openf1/position?session_key=${session.session_key}`)
              const posData = await posRes.json()
              
              // If this session has position data, use it
              if (posData && Array.isArray(posData) && posData.length > 0) {
                latestSessionWithResults = session
                console.log('[Hero] Found session with results:', session)
                break
              }
            } catch (error) {
              console.log('[Hero] No position data for session:', session.session_key)
              continue
            }
          }
          
          if (latestSessionWithResults) {
            console.log('[Hero] Found latest session from Jolpi:', latestSessionWithResults)
            const newLatestRace = {
              meeting_name: latestSessionWithResults.meeting_name,
              session_name: latestSessionWithResults.session_name
            }
            console.log('[Hero] Setting latestRace to:', newLatestRace)
            setLatestRace(newLatestRace)
            return // Successfully got data from Jolpi, exit early
          }
        } catch (jolpiError) {
          console.log('[Hero] Jolpi openf1 proxy failed, trying api.openf1.org fallback:', jolpiError)
        }

        // PRIORITY 2: Fallback to api.openf1.org with session_key=latest
        console.log('[Hero] Trying api.openf1.org fallback...')
        
        try {
          // Get session info first
          const sessionRes = await fetch("https://api.openf1.org/v1/sessions?session_key=latest")
          const sessionData = await sessionRes.json()
          console.log('[Hero] api.openf1.org sessionData:', sessionData)
          const latestSession = sessionData[0] || {}
          
          if (latestSession.session_key) {
            console.log('[Hero] Found latest session from api.openf1.org:', latestSession)
            const newLatestRace = {
              meeting_name: latestSession.meeting_name || `${latestSession.country_name} Grand Prix`,
              session_name: latestSession.session_name
            }
            console.log('[Hero] Setting latestRace to:', newLatestRace)
            setLatestRace(newLatestRace)
            return // Successfully got data from api.openf1.org, exit early
          }
        } catch (openf1Error) {
          console.log('[Hero] api.openf1.org failed:', openf1Error)
        }

        // PRIORITY 3: Fallback to Ergast API for completed main races only
        console.log('[Hero] Trying Ergast API fallback...')
        
        const currentYear = new Date().getFullYear()
        const racesRes = await fetch(`https://api.jolpi.ca/ergast/f1/${currentYear}.json`)
        const racesData = await racesRes.json()
        
        if (racesData.MRData?.RaceTable?.Races?.length > 0) {
          const races = racesData.MRData.RaceTable.Races
          const now = new Date()
          
          // Find the most recent completed race (add 3 hours for race duration)
          let latestCompletedRace = null
          for (let i = races.length - 1; i >= 0; i--) {
            const raceDate = new Date(races[i].date)
            const raceEndTime = new Date(raceDate.getTime() + (3 * 60 * 60 * 1000))
            if (raceEndTime < now) {
              latestCompletedRace = races[i]
              break
            }
          }
          
          if (latestCompletedRace) {
            console.log('[Hero] Latest completed race from Ergast:', latestCompletedRace)
            setLatestRace({
              meeting_name: latestCompletedRace.raceName,
              session_name: 'Race'
            })
          }
        }
      } catch (err) {
        console.error('Failed to fetch latest race:', err)
      }
    }
    fetchLatestRace();
        
    // Refresh latest race info every 30 seconds (same as DriversStandings)
    const latestRaceInterval = setInterval(fetchLatestRace, 30000)
    return () => clearInterval(latestRaceInterval)
  }, []);

  // Update news items when language changes
  useEffect(() => {
    setNewsItems([
      t.additional.news1,
      t.additional.news2,
      t.additional.news3,
      t.additional.news4,
    ]);
  }, [t]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const rssUrl = encodeURIComponent('https://www.motorsport.com/rss/f1/news/');
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          // Use the latest 8 headlines for the marquee
          const headlines = data.items.map((item: { title: string }) => item.title).slice(0, 8);
          if (headlines.length > 0) setNewsItems(headlines);
        }
      } catch (err) {
        // fallback to static newsItems
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!nextRace) return;
      const targetDate = new Date(`${nextRace.date}T${nextRace.time}`);
      const difference = targetDate.getTime() - new Date().getTime()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [nextRace])

  useEffect(() => {
    // Load the Vimeo Player API script
    const tag = document.createElement('script')
    tag.src = 'https://player.vimeo.com/api/player.js'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Initialize Vimeo player when script is loaded
    tag.onload = () => {
      // @ts-ignore: Vimeo type may not be available
      const vimeoPlayer = new (window as any).Vimeo.Player('vimeo-player', {
        id: '45149087',
        background: true,
        autoplay: true,
        loop: true,
        muted: true,
        controls: false,
        responsive: true,
        width: '80vw',
        // t: '7s'
      })

      setPlayer(vimeoPlayer)

      vimeoPlayer.on('error', function(error: unknown) {
        console.error('Vimeo Player Error:', error)
      })
    }

    // Cleanup
    return () => {
      if (player) {
        player.destroy()
      }
    }
  }, [])

  // Save winner to Airtable when race finishes
  useEffect(() => {
    if (!nextRace) return;
    const targetDate = new Date(`${nextRace.date}T${nextRace.time}`);
    const now = new Date();
    // If race has finished and we haven't saved this race yet
    if (now > targetDate && lastSavedRace !== nextRace.raceName + nextRace.date) {
      async function saveWinner() {
        if (!nextRace) return;
        try {
          // Only log if nextRace is not null
          // console.log('[Winner Save] Fetching session for race:', nextRace.raceName, nextRace.date);
          // Find the specific race session for this race
          const sessionsRes = await fetch('https://api.openf1.org/v1/sessions');
          const sessionsData = await sessionsRes.json();
          console.log('[Winner Save] openf1 sessionsData:', sessionsData);
          
          // Find the race session that matches the race name and date
          const raceSession = sessionsData.find((s: any) => 
            s.session_name === 'Race' && 
            s.meeting_name === nextRace.raceName &&
            s.date && s.date.startsWith(nextRace.date)
          );
          
          if (!raceSession) { 
            console.log('[Winner Save] No matching race session found for:', nextRace.raceName, nextRace.date); 
            return; 
          }
          
          console.log('[Winner Save] Found race session:', raceSession);
          
          // Fetch positions for this specific session
          const posRes = await fetch(`https://api.openf1.org/v1/position?session_key=${raceSession.session_key}`);
          const posData = await posRes.json();
          console.log('[Winner Save] openf1 posData:', posData);
          // Get latest position for each driver (reduce logic from DriversStandings)
          const latestPositions = posData.reduce((acc: Record<number, any>, curr: any) => {
            if (!acc[curr.driver_number] || new Date(curr.date) > new Date(acc[curr.driver_number].date)) {
              acc[curr.driver_number] = curr;
            }
            return acc;
          }, {});
          // Convert to array and get top 3
          const top3 = Object.values(latestPositions)
            .sort((a: any, b: any) => a.position - b.position)
            .slice(0, 3);
          if (top3.length === 0) { console.log('[Winner Save] No top 3 finishers found'); return; }
          // Fetch driver details for this specific session
          const driversRes = await fetch(`https://api.openf1.org/v1/drivers?session_key=${raceSession.session_key}`);
          const driversData = await driversRes.json();
          console.log('[Winner Save] openf1 driversData:', driversData);
          const winnerEntries: WinnerEntry[] = top3.map((pos: any) => {
            const driverInfo = driversData.find((d: any) => d.driver_number === pos.driver_number);
            console.log('[Winner Save] Matching driver:', pos.driver_number, driverInfo);
            return {
              position: pos.position,
              driverNumber: pos.driver_number,
              fullName: driverInfo?.full_name || '',
              teamName: driverInfo?.team_name || '',
              teamColor: driverInfo?.team_color || '',
              raceName: nextRace.raceName,
              raceDate: nextRace.date,
            };
          });
          console.log('[Winner Save] Top 3 winner entries:', winnerEntries);
          // Check Airtable for existing winners for this race/driver/position (global deduplication via Race Key)
          const filteredWinnerEntries: WinnerEntry[] = [];
          for (const entry of winnerEntries) {
            const exists = await winnersExistForRace(entry.raceName, entry.raceDate, entry.fullName, entry.position);
            if (!exists) filteredWinnerEntries.push(entry);
          }
          if (filteredWinnerEntries.length === 0) return;
          await saveRaceWinners(filteredWinnerEntries);
          console.log('[Winner Save] Top 3 winners saved to Airtable!');
          setLastSavedRace(nextRace.raceName + nextRace.date);
        } catch (err) {
          // console.error('[Winner Save] Error saving winner:', err);
        }
      }
      saveWinner();
    }
  }, [nextRace, timeLeft, lastSavedRace]);

  useEffect(() => {
    function updateMarqueeDuration() {
      if (!marqueeContainerRef.current || !marqueeContentRef.current) return;
      const containerWidth = marqueeContainerRef.current.offsetWidth;
      const contentWidth = marqueeContentRef.current.scrollWidth;
      // Set speed: 60px/sec (adjust as needed)
      const speed = 60; // px per second
      const duration = (contentWidth + containerWidth) / speed;
      setMarqueeDuration(duration);
    }
    updateMarqueeDuration();
    window.addEventListener('resize', updateMarqueeDuration);
    return () => window.removeEventListener('resize', updateMarqueeDuration);
  }, [newsItems]);

  return (
    <div className="min-h-screen pt-16 sm:pt-24 text-white font-sans relative">
      {/* Background Video Container */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
        <div 
          id="vimeo-player"
          className="absolute w-full h-full pointer-events-none"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%',
            width: '177.77777778vh', // 16:9 aspect ratio
            height: '56.25vw' // 16:9 aspect ratio
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Marquee Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed-marquee-header bg-black/40 backdrop-blur-md border-b border-yellow-500/20 z-30"
      >
        <div
          className="marquee-container overflow-x-hidden"
          ref={marqueeContainerRef}
        >
          <div
            className="inline-block"
            style={{
              animation: marqueeDuration > 0 ? `marquee-js ${marqueeDuration}s linear infinite` : undefined,
              willChange: 'transform',
            }}
          >
            <span className="marquee-content" ref={marqueeContentRef}>
              {/* Extra large spacer to prevent cut-off at start */}
              <span className="marquee-spacing marquee-text text-transparent" style={{ minWidth: '8rem' }}>&nbsp;</span>
              {Array(3).fill(newsItems).flat().map((item, idx) => (
                <span key={idx} className="marquee-spacing marquee-text text-gray-300">
                  {item}
                </span>
              ))}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-2 max-w-7xl mt-14">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start lg:items-center mb-8 sm:mb-16 lg:mb-24">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 sm:space-y-8 lg:space-y-12 relative z-10 order-1 lg:order-1"
          >
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-4xl lg:text-3xl xl:text-5xl font-extrabold text-white tracking-tight leading-none mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent">
                {t.additional.latestRaceResults}
              </h3>
              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <div className="h-1 w-16 sm:w-20 lg:w-24 bg-gradient-to-r from-yellow-500 to-yellow-300" />
                <p className="text-sm sm:text-lg lg:text-xl font-light tracking-wider text-gray-300">
                  {latestRace.meeting_name ? latestRace.meeting_name : (nextRace?.raceName || "Loading...")}
                </p>
              </div>
            </div>

            {/* Podium Results Card */}
            <DriversStandings />
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-6 sm:gap-8 order-2 lg:order-2"
          >
            <Card className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-lg border-white/10 hover:border-yellow-500/30 transition-all duration-500 shadow-2xl shadow-black/20">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col h-full">
                  <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-8 pt-8 sm:pt-10 lg:pt-14">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl uppercase font-bold bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent tracking-tight text-center w-full">
                      {nextRace?.raceName}
                    </h2>

                    <Card className="bg-gradient-to-br from-black/80 to-gray-900/80 border-white/10 w-full hover:border-yellow-500/20 transition-all duration-300">
                      <CardContent className="p-4 sm:p-6 lg:p-8">
                        <div className="flex items-center justify-center">
                          <Clock className="text-yellow-500 mr-3 sm:mr-4 lg:mr-6 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                          <div className="grid grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
                            {Object.entries(timeLeft).map(([unit, value]) => (
                              <div key={unit} className="text-center">
                                <h5 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tabular-nums block mb-1 sm:mb-2">
                                  {value.toString().padStart(2, "0")}
                                </h5>
                                <span className="text-xs font-medium uppercase tracking-widest text-yellow-500">
                                  {unit === 'days' ? t.additional.days : 
                                   unit === 'hours' ? t.additional.hours :
                                   unit === 'minutes' ? t.additional.minutes :
                                   unit === 'seconds' ? t.additional.seconds : unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <p className="text-sm sm:text-base font-light tracking-wider text-gray-400 text-center">
                      {t.additional.raceDate} {" "}
                      <span className="text-yellow-500 font-medium block mt-1">
                        {nextRace ? new Date(`${nextRace.date}T${nextRace.time}`).toLocaleString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZoneName: "short",
                        }) : t.common.loading}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phantom Wallet Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 sm:mt-8"
            >
              <Card className="bg-black/40 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-yellow-500/50 transition-all duration-300 h-[300px] sm:h-[350px] lg:h-[400px]">
                <CardContent className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-full relative">
                  <div className="absolute inset-0">
                    <img 
                      src="/assets/images/banner2.jpg" 
                      alt="Phantom Wallet Banner"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  </div>
                  
                  <div className="relative space-y-2 flex flex-col justify-center items-center h-full">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center">Get Started with Phantom</h3>
                  </div>
                  
                  <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <a href="https://apps.apple.com/app/phantom-solana-wallet/id1598432977" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex-1">
                      <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-sm sm:text-base lg:text-lg py-4 sm:py-5 lg:py-6">
                        App Store
                      </Button>
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=app.phantom" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex-1">
                      <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-sm sm:text-base lg:text-lg py-4 sm:py-5 lg:py-6">
                        Play Store
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}

