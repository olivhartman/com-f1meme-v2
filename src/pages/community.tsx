import type React from "react"
import { useEffect, useState } from "react"
import { airtableService, type ProfileData } from "../api/airtable"
import { Instagram, Music, Globe, Flag, Users, Sparkles, ExternalLink } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"

const AnimatedBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Primary gradient orbs */}
    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-yellow-400/30 via-amber-400/20 to-red-500/10 rounded-full blur-3xl animate-pulse-slow" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-red-500/20 via-yellow-400/15 to-amber-300/10 rounded-full blur-3xl animate-pulse-slower" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-yellow-300/10 to-red-400/10 rounded-full blur-2xl animate-float" />

    {/* Subtle grid pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
  </div>
)

const SocialIcon = ({
  url,
  icon,
  hoverColor,
  platform,
}: {
  url: string
  icon: React.ReactNode
  hoverColor: string
  platform: string
}) => (
  <Button
    variant="ghost"
    size="sm"
    asChild
    className={`h-8 w-8 p-0 rounded-full bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 ${hoverColor} hover:scale-110 hover:shadow-lg group`}
  >
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${platform} profile`}>
      {icon}
    </a>
  </Button>
)

const MemberCard = ({ member, index }: { member: ProfileData; index: number }) => (
  <Card className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-yellow-400/20 hover:border-yellow-400/60 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-400/10">
    {/* Animated border gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

    {/* Shine effect */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-400/10 via-transparent to-transparent rotate-45 animate-shine" />
    </div>

    <CardContent className="relative p-6 flex flex-col items-center text-center space-y-4">
      {/* Member badge */}
      <div className="absolute top-4 right-4">
        <Badge
          className="bg-yellow-400/20 text-yellow-400 border-yellow-400/40 text-xs font-semibold"
        >
          #{String(index + 1).padStart(3, "0")}
        </Badge>
      </div>

      {/* Profile picture */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 p-1 group-hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
            {member.profilePictureUrl ? (
              <img
                src={member.profilePictureUrl || "/placeholder.svg"}
                alt={`${member.name || "Member"} profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-red-500/20">
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
            )}
          </div>
        </div>

        {/* Online indicator */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Member name */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
          {member.name || "F1 Enthusiast"}
        </h3>
        <p className="text-sm text-slate-400">Community Member</p>
      </div>

      {/* Social links */}
      {(member.instagramUrl || member.tiktokUrl || member.vkUrl) && (
        <div className="flex items-center gap-2 pt-2">
          {member.instagramUrl && (
            <SocialIcon
              url={member.instagramUrl}
              icon={<Instagram className="w-4 h-4" />}
              hoverColor="hover:text-pink-400 hover:bg-pink-400/10"
              platform="Instagram"
            />
          )}
          {member.tiktokUrl && (
            <SocialIcon
              url={member.tiktokUrl}
              icon={<Music className="w-4 h-4" />}
              hoverColor="hover:text-white hover:bg-slate-700/50"
              platform="TikTok"
            />
          )}
          {member.vkUrl && (
            <SocialIcon
              url={member.vkUrl}
              icon={<Globe className="w-4 h-4" />}
              hoverColor="hover:text-blue-400 hover:bg-blue-400/10"
              platform="VK"
            />
          )}
        </div>
      )}

      {/* Member stats or additional info could go here */}
      <div className="w-full pt-2 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <Flag className="w-3 h-3" />
          <span>F1 Meme Legend</span>
        </div>
      </div>
    </CardContent>
  </Card>
)

const LoadingCard = () => (
  <Card className="bg-slate-900/50 border-slate-700/50 rounded-2xl overflow-hidden">
    <CardContent className="p-6 flex flex-col items-center space-y-4">
      <div className="w-24 h-24 rounded-full bg-slate-700/50 animate-pulse" />
      <div className="space-y-2 w-full">
        <div className="h-4 bg-slate-700/50 rounded animate-pulse" />
        <div className="h-3 bg-slate-700/30 rounded animate-pulse w-2/3 mx-auto" />
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-slate-700/50 rounded-full animate-pulse" />
        <div className="w-8 h-8 bg-slate-700/50 rounded-full animate-pulse" />
      </div>
    </CardContent>
  </Card>
)

const Community: React.FC = () => {
  const [members, setMembers] = useState<ProfileData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const all = await airtableService.getAllProfiles()
        setMembers(all)
      } catch (error) {
        console.error("Failed to fetch members:", error)
        setMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      <AnimatedBackground />

      {/* Header Section */}
      <div className="relative pt-32 pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          {/* Main title */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">F1Meme Community</h1>
            </div>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Meet the passionate F1 fans who make our community legendary. From meme creators to racing enthusiasts,
              these are the people who fuel the excitement.
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{loading ? "..." : members.length}</div>
              <div className="text-sm text-slate-400">Members</div>
            </div>
            {/* <div className="w-px h-8 bg-slate-700" /> */}
            {/* <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">∞</div>
              <div className="text-sm text-slate-400">Memes</div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-slate-400">Racing</div>
            </div> */}
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center pt-8">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full" />
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="px-4 sm:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-red-500/20 rounded-full flex items-center justify-center">
                <Flag className="w-12 h-12 text-yellow-400 animate-bounce" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">No Members Yet!</h3>
                <p className="text-slate-400 max-w-md">
                  Be the first to join our amazing F1Meme community and start the legend.
                </p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold">
                Join Community
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member, index) => (
                <MemberCard key={index} member={member} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Community 