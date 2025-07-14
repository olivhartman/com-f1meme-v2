"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Calendar, MapPin, Flag, Clock, Zap, Trophy, Timer } from "lucide-react"
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

type Session = {
  date: string
  time: string
}

type Race = {
  season: string
  round: string
  raceName: string
  url: string
  Circuit: {
    circuitId: string
    url: string
    circuitName: string
    Location: {
      lat: string
      long: string
      locality: string
      country: string
    }
  }
  date: string
  time: string
  FirstPractice?: Session
  SecondPractice?: Session
  ThirdPractice?: Session
  Qualifying?: Session
  Sprint?: Session
  SprintQualifying?: Session
}

const sessionConfig: {
  [key: string]: {
    label: string
    icon: React.ReactNode
    color: string
    bgColor: string
  }
} = {
  FirstPractice: {
    label: "FP1",
    icon: <Timer className="w-3 h-3" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10 border-yellow-400/30",
  },
  SecondPractice: {
    label: "FP2",
    icon: <Timer className="w-3 h-3" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10 border-yellow-400/30",
  },
  ThirdPractice: {
    label: "FP3",
    icon: <Timer className="w-3 h-3" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10 border-yellow-400/30",
  },
  Qualifying: {
    label: "Qualifying",
    icon: <Zap className="w-3 h-3" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10 border-yellow-400/30",
  },
  Sprint: {
    label: "Sprint",
    icon: <Trophy className="w-3 h-3" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10 border-yellow-400/30",
  },
  SprintQualifying: {
    label: "Sprint Qualifying",
    icon: <Flag className="w-3 h-3" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10 border-yellow-400/30",
  },
}

function formatDateTime(date: string, time: string) {
  const dt = new Date(`${date}T${time.replace("Z", "")}Z`)
  return {
    date: dt.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: dt.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

function formatRaceDate(date: string, time: string) {
  const dt = new Date(`${date}T${time.replace("Z", "")}Z`)
  return dt.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function Schedule() {
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://api.jolpi.ca/ergast/f1/races/?offset=1137&limit=30")
      .then((res) => res.json())
      .then((data) => {
        const allRaces = data.MRData.RaceTable.Races;
        const now = new Date();
        // Only keep races whose main event is in the future
        const upcomingRaces = allRaces.filter((race: Race) => {
          if (!race.date) return false;
          const today = new Date();
          const raceDate = new Date(race.date);

          // If race is in the future (date only)
          if (
            raceDate.getFullYear() > today.getFullYear() ||
            (raceDate.getFullYear() === today.getFullYear() && raceDate.getMonth() > today.getMonth()) ||
            (raceDate.getFullYear() === today.getFullYear() && raceDate.getMonth() === today.getMonth() && raceDate.getDate() > today.getDate())
          ) {
            return true;
          }

          // If race is today, check time
          if (
            raceDate.getFullYear() === today.getFullYear() &&
            raceDate.getMonth() === today.getMonth() &&
            raceDate.getDate() === today.getDate()
          ) {
            if (!race.time) return true; // If no time, show for the whole day
            const [hour, minute] = race.time.replace("Z", "").split(":");
            if (hour && minute) {
              const raceTime = new Date(race.date);
              raceTime.setUTCHours(Number(hour), Number(minute), 0, 0);
              return today < raceTime;
            }
            return true;
          }

          return false;
        });
        setRaces(upcomingRaces)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-white">Loading F1 Schedule...</p>
          <p className="text-sm text-slate-400">Fetching the latest race information</p>
        </div>
      </div>
    )
  }

  const sessionOrder = ["FirstPractice", "SecondPractice", "ThirdPractice", "Qualifying", "SprintQualifying", "Sprint"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent"></div>
        <div className="relative px-4 py-16 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <Flag className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-yellow-400 tracking-tight">F1 Schedule</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Complete Formula 1 race weekend schedule with all sessions and timings
          </p>
        </div>
      </div>

      {/* Race Grid */}
      <div className="px-4 pb-16 mt-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {races.map((race, index) => (
              <Card
                key={race.round}
                className="group bg-gradient-to-br from-black/50 to-gray-900/50 border-yellow-400/50 backdrop-blur-sm hover:border-yellow-400 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10 hover:-translate-y-1"
              >
                <CardContent className="p-6 space-y-6">
                  {/* Race Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-400/30 font-semibold">
                        Round {race.round}
                      </Badge>
                      <div className="text-right text-xs text-slate-400">Season {race.season}</div>
                    </div>

                    <h2 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                      <a href={race.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {race.raceName}
                      </a>
                    </h2>
                  </div>

                  {/* Circuit Info */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <a
                          href={race.Circuit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-white hover:text-red-400 transition-colors hover:underline"
                        >
                          {race.Circuit.circuitName}
                        </a>
                        <p className="text-xs text-slate-400">
                          {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Race Date */}
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-red-500/10 to-transparent rounded-lg border border-red-500/20">
                    <Calendar className="w-4 h-4 text-red-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">Race Day</p>
                      <p className="text-xs text-slate-300">{formatRaceDate(race.date, race.time)}</p>
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Weekend Schedule
                    </h3>

                    <div className="grid grid-cols-1 gap-2">
                      {sessionOrder.map((sessionKey) => {
                        const session = race[sessionKey as keyof Race] as Session | undefined
                        const config = sessionConfig[sessionKey]

                        if (!session) return null

                        const { date, time } = formatDateTime(session.date, session.time)

                        return (
                          <div
                            key={sessionKey}
                            className={`flex items-center justify-between p-2 rounded-lg border ${config.bgColor} backdrop-blur-sm`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={config.color}>{config.icon}</div>
                              <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-white">{date}</p>
                              <p className="text-xs text-slate-400">{time}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 