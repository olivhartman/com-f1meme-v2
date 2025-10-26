import type React from "react"
import { useEffect, useState } from "react"
import { airtableService, type ProfileData } from "../api/airtable"
import { Instagram, X, Send, Flag, Users, Sparkles, Copy, QrCode as QrCodeIcon, AlertCircle } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
// import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import QRCode from "qrcode"
import { motion } from "framer-motion"
import { useTranslation } from "../i18n/TranslationContext"

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



const MemberCard = ({ member }: { member: ProfileData }) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [qrError, setQrError] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const handleCopy = () => {
    if (member.walletAddress) {
      navigator.clipboard.writeText(member.walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }
  
  const handleShowQR = async () => {
    if (member.walletAddress) {
      setShowQR(true)
      setQrDataUrl(null)
      setQrError(null)
      
      try {
        const dataUrl = await QRCode.toDataURL(member.walletAddress, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrDataUrl(dataUrl)
      } catch (err) {
        console.error('Error generating QR code:', err)
        setQrError('Failed to generate QR code')
      }
    }
  }

  const handleCloseQR = () => {
    setShowQR(false)
    setQrDataUrl(null)
    setQrError(null)
  }
  return (
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
          <div className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 text-xs font-semibold px-2 py-1 rounded-full">
            Level {member.membershipLevel || 0}
          </div>
      </div>

      {/* Profile picture */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 p-1 group-hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
            {member.profilePictureUrl && !imageError ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-red-500/20">
                    <Users className="w-8 h-8 text-yellow-400" />
                  </div>
                )}
                <img
                  src={member.profilePictureUrl}
                  alt={`${member.name || "Member"} profile`}
                  className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true)
                    setImageLoaded(false)
                  }}
                  key={member.walletAddress}
                />
              </>
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

        {/* Member name and wallet */}
        <div className="space-y-1 w-full">
        <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
          {member.name || t.additional.f1Enthusiast}
        </h3>
          <div className="flex flex-col items-center gap-1 w-full mt-1">
            <div className="flex items-center gap-2 justify-center w-full flex-wrap">
              <span className="text-xs text-slate-400 font-mono break-all select-all max-w-full">
                {member.walletAddress
                  ? `${member.walletAddress.slice(0, 4)}...${member.walletAddress.slice(-4)}`
                  : t.additional.noWallet}
              </span>
              {member.walletAddress && (
                <>
                  <button
                    onClick={handleCopy}
                    className="ml-1 p-1 rounded bg-transparent hover:bg-yellow-400/20 transition-colors focus:outline-none border-none shadow-none"
                    title={t.additional.copyAddress}
                    type="button"
                  >
                    <Copy className="w-4 h-4 text-yellow-400" />
                  </button>
                  <button
                    onClick={handleShowQR}
                    className="ml-1 p-1 rounded bg-transparent hover:bg-yellow-400/20 transition-colors focus:outline-none border-none shadow-none"
                    title={t.additional.showQrCode}
                    type="button"
                  >
                    <QrCodeIcon className="w-4 h-4 text-yellow-400" />
                  </button>
                </>
              )}
              {copied && (
                <span className="text-emerald-400 text-xs ml-2 animate-fade-in">{t.additional.copied}</span>
              )}
            </div>
          </div>
        <p className="text-sm text-slate-400">{t.additional.communityMember}</p>
      </div>

      {/* Social links */}
      {(member.instagramUrl || member.tiktokUrl || member.tgUrl) && (
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
              icon={<X className="w-4 h-4" />}
              hoverColor="hover:text-white hover:bg-slate-700/50"
              platform="X (formerly Twitter)"
            />
          )}
          {member.tgUrl && (
            <SocialIcon
              url={member.tgUrl}
              icon={<Send className="w-4 h-4" />}
              hoverColor="hover:text-blue-400 hover:bg-blue-400/10"
              platform="Telegram"
            />
          )}
        </div>
      )}

      {/* Member stats or additional info could go here */}
        {/* <div className="w-full pt-2 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <Flag className="w-3 h-3" />
          <span>F1 Meme Legend</span>
        </div>
        </div> */}

        {/* QR Code Overlay - fills the entire card */}
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10"
          >
            {/* Close button */}
            <button
              onClick={handleCloseQR}
              className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-red-500/90 hover:bg-red-600/90 text-white transition-all duration-200 flex items-center justify-center border-2 border-red-400/50 hover:border-red-300/50 shadow-lg backdrop-blur-sm z-20 font-bold text-lg"
            >
              ✕
            </button>

            {/* QR Code */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48 flex items-center justify-center bg-white rounded-2xl p-4 shadow-xl border-4 border-yellow-400/20">
                {qrError ? (
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-red-50 rounded-xl flex items-center justify-center border-2 border-red-200 mx-auto">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600">Failed to generate QR</p>
                      <p className="text-xs text-red-500 mt-1">{qrError}</p>
                    </div>
                  </div>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Wallet QR Code"
                    className="w-full h-full rounded-xl"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-gray-600 font-medium">Generating QR code...</p>
                  </div>
                )}
              </div>

              {/* Helper Text */}
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                Scan this QR code with your wallet app
              </p>
      </div>
          </motion.div>
        )}
    </CardContent>
  </Card>
)
}

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
  const { t } = useTranslation()
  const [members, setMembers] = useState<ProfileData[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(8)

  // Responsive perPage
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setPerPage(5)
      } else {
        setPerPage(8)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  // Pagination logic - sort by highest level first
  const filteredMembers = members
    .filter(m => m.membershipLevel && m.membershipLevel >= 1 && m.membershipLevel <= 99)
    .sort((a, b) => (b.membershipLevel || 0) - (a.membershipLevel || 0)) // Sort by highest level first
  const totalPages = Math.ceil(filteredMembers.length / perPage)
  const pagedMembers = filteredMembers.slice((page - 1) * perPage, page * perPage)

  const handlePrev = () => setPage((p) => Math.max(1, p - 1))
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1))

  useEffect(() => {
    // Reset to first page if perPage changes or members change
    setPage(1)
  }, [perPage, members.length])

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      <AnimatedBackground />

      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent"></div>
        <div className="relative px-4 py-26 text-center flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="mb-4 mt-4">
              <h1 className="text-4xl md:text-6xl font-black text-[#FBEB04] tracking-tight">{t.community.title}</h1>
            </div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              {t.community.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="px-4 sm:px-8 pb-16 mt-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: perPage }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-red-500/20 rounded-full flex items-center justify-center">
                <Flag className="w-12 h-12 text-yellow-400 animate-bounce" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">{t.additional.noMembersLevel}</h3>
                <p className="text-slate-400 max-w-md">
                  {t.additional.noMembersLevelDesc}
                </p>
              </div>
              {/* <Button className="bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold">
                Join Community
              </Button> */}
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pagedMembers.map((member, index) => (
                  <MemberCard key={index} member={member} />
              ))}
            </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="px-3 py-1"
                  >
                    Prev
                  </Button>
                  <span className="text-slate-300 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="px-3 py-1"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Community 