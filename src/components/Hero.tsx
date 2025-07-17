"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import DriversStandings from "./DriversStandings"
// IMPORTANT: Always type API data and function parameters. Enable 'noImplicitAny' in tsconfig.json for strict type safety.
// If you add new API calls, define and use types for all data.
// See: https://www.typescriptlang.org/tsconfig#noImplicitAny
import type { Race } from "../pages/schedule";
// import Link from "next/link"

interface NextRaceInfo {
  date: string
  time: string
  raceName: string
  circuit: string
}

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [newsItems] = useState<string[]>([
    "Yuki Tsunoda Racing in Red Bull in front Japanese Crowd 🏎️",
    "Maclaren Big Lead in both Championship, is it a bad sign?🔥",
    "Kimi winning his first Grand Prix soon 🔧",
    "Over 220,000 attendance in Chinese Grand Prix 🏁",
  ])
  const [nextRace, setNextRace] = useState<NextRaceInfo | null>(null)
  const [player, setPlayer] = useState<any>(null)

  useEffect(() => {
    // Fetch the next race from the F1 schedule API, with local cache
    const CACHE_KEY = 'next_f1_race';
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    function getCachedRace() {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      try {
        const { race, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return race;
        }
      } catch {}
      return null;
    }

    function setCachedRace(race) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ race, timestamp: Date.now() }));
    }

    // Show cached race instantly if available
    const cachedRace = getCachedRace();
    if (cachedRace) setNextRace(cachedRace);

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
          const races: Race[] = data.MRData.RaceTable.Races as Race[];
          if (!races.length) break;
          (races as Race[]).forEach((race: Race) => {
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
        if (closestRace) {
          const raceObj = {
            date: closestRace.date,
            time: closestRace.time || '00:00:00',
            raceName: closestRace.raceName,
            circuit: closestRace.Circuit.circuitName,
          };
          setNextRace(raceObj);
          setCachedRace(raceObj);
        }
      } catch (err) {
        console.error('Failed to fetch next race:', err);
      }
    }
    fetchNextRace();
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

      vimeoPlayer.on('error', function(error: any) {
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
        <div className="flex justify-between items-center px-4 w-full">
          <div className="marquee-container">
            <div className="animate-marquee">
              <div className="marquee-content">
                {newsItems.map((item, index) => (
                  <span key={index} className="mx-8 text-sm font-bold tracking-wider text-gray-300">
                    {item}
                  </span>
                ))}
                {newsItems.map((item, index) => (
                  <span key={`duplicate-${index}`} className="mx-8 text-sm font-bold tracking-wider text-gray-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-2 max-w-7xl mt-14">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center mb-8 sm:mb-16 lg:mb-24">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8 sm:space-y-12 relative z-10"
          >
            {/* <div>
              <h1 className="text-xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none mb-4 sm:mb-6 bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent">
                Latest Race Result
              </h1> */}
              {/* <div className="flex items-center gap-4">
                <div className="h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-300" />
                <p className="text-xl font-light tracking-wider text-gray-300">{nextRace.circuit}</p>
              </div> */}
            {/* </div> */}

            {/* Podium Results Card */}
            <DriversStandings />
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-8"
          >
            <Card className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-lg border-white/10 hover:border-yellow-500/30 transition-all duration-500 shadow-2xl shadow-black/20">
              <CardContent className="p-8">
                <div className="flex flex-col h-full">
                  <div className="flex flex-col items-center gap-8 pt-14">
                    <h2 className="text-4xl uppercase font-bold bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent tracking-tight text-center w-full">
                      {nextRace?.raceName}
                    </h2>

                    <Card className="bg-gradient-to-br from-black/80 to-gray-900/80 border-white/10 w-full hover:border-yellow-500/20 transition-all duration-300">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-center">
                          <Clock className="text-yellow-500 mr-6 h-6 w-6" />
                          <div className="grid grid-cols-4 gap-6">
                            {Object.entries(timeLeft).map(([unit, value]) => (
                              <div key={unit} className="text-center">
                                <span className="text-4xl font-bold text-white tabular-nums block mb-2">
                                  {value.toString().padStart(2, "0")}
                                </span>
                                <span className="text-xs font-medium uppercase tracking-widest text-yellow-500">
                                  {unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <p className="text-base font-light tracking-wider text-gray-400 text-center">
                      Race Begins{" "}
                      <span className="text-yellow-500 font-medium block mt-1">
                        {nextRace ? new Date(`${nextRace.date}T${nextRace.time}`).toLocaleString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZoneName: "short",
                        }) : "Loading..."}
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
              className="mt-8"
            >
              <Card className="bg-black/40 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-yellow-500/50 transition-all duration-300 h-[400px]">
                <CardContent className="p-8 flex flex-col justify-between h-full relative">
                  <div className="absolute inset-0">
                    <img 
                      src="/assets/images/banner2.jpg" 
                      alt="Phantom Wallet Banner"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  </div>
                  
                  <div className="relative space-y-2">
                    <h3 className="text-3xl font-bold text-white">Get Started with Phantom</h3>
                  </div>
                  
                  <div className="relative flex gap-4">
                    <a href="https://apps.apple.com/app/phantom-solana-wallet/id1598432977" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex-1">
                      <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-lg py-6">
                        App Store
                      </Button>
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=app.phantom" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex-1">
                      <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-lg py-6">
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

