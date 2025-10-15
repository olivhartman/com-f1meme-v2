"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Image, Share2, Download } from "lucide-react"
import { airtableService, type GalleryPhoto } from "../api/airtable"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { useTranslation } from "../i18n/TranslationContext"

const AnimatedBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Primary gradient orbs */}
    <div className="absolute top-[-20%]oxboxweb3  left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-yellow-400/30 via-amber-400/20 to-red-500/10 rounded-full blur-3xl animate-pulse-slow" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-red-500/20 via-yellow-400/15 to-amber-300/10 rounded-full blur-3xl animate-pulse-slower" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-yellow-300/10 to-red-400/10 rounded-full blur-2xl animate-float" />

    {/* Subtle grid pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
  </div>
)

export const PhotoCard = ({ photo }: { photo: GalleryPhoto }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [showMobileOverlay, setShowMobileOverlay] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gallery-photo-${photo.id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'F1Meme Gallery Photo',
          text: `Photo by ${photo.uploadedBy}`,
          url: photo.url,
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(photo.url)
        alert('Photo URL copied to clipboard!')
      } catch (error) {
        console.error('Copy failed:', error)
      }
    }
  }

  const handleImageClick = () => {
    // On mobile, show overlay on click instead of hover
    if (window.innerWidth <= 768) {
      setShowMobileOverlay(!showMobileOverlay)
    }
  }



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-yellow-400/20 hover:border-yellow-400/60 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-400/10">
        {/* Photo */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={photo.url}
            alt={`Gallery photo by ${photo.uploadedBy}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            loading="lazy"
            onClick={handleImageClick}
          />
          
          {/* Desktop Overlay with actions and caption (hover only) */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 hidden md:flex">
            {/* Caption */}
            {photo.caption && (
              <div className="text-center mb-4">
                <p className="text-white text-sm font-medium leading-relaxed max-w-full">
                  {photo.caption}
                </p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleShare}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30"
              >
                <Share2 className="h-4 w-4 text-white" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                disabled={isLoading}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Download className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Overlay with actions and caption (click to show/hide) */}
          <div className={`absolute inset-0 bg-black/80 transition-opacity duration-300 flex flex-col items-center justify-center p-4 md:hidden ${
            showMobileOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            {/* Caption */}
            {photo.caption && (
              <div className="text-center mb-6">
                <p className="text-white text-base font-medium leading-relaxed max-w-full">
                  {photo.caption}
                </p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleShare}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30"
              >
                <Share2 className="h-5 w-5 text-white" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleDownload}
                disabled={isLoading}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <Download className="h-5 w-5 text-white" />
                )}
              </Button>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMobileOverlay(false)
              }}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>


      </Card>
    </motion.div>
  )
}

const LoadingCard = () => (
  <Card className="bg-slate-900/50 border-slate-700/50 rounded-2xl overflow-hidden">
    <div className="aspect-square bg-slate-700/50 animate-pulse" />
    <CardContent className="p-4">
      <div className="space-y-2">
        <div className="h-4 bg-slate-700/50 rounded animate-pulse" />
        <div className="h-3 bg-slate-700/30 rounded animate-pulse w-2/3" />
      </div>
    </CardContent>
  </Card>
)

const Gallery: React.FC = () => {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const allPhotos = await airtableService.getAllGalleryPhotos()
        // Filter out photos with invalid data
        const validPhotos = allPhotos.filter(photo => 
          photo.url && 
          photo.uploadedBy && 
          photo.uploadedAt && 
          !isNaN(new Date(photo.uploadedAt).getTime())
        )
        setPhotos(validPhotos)
      } catch (err) {
        console.error("Failed to fetch photos:", err)
        setError("Failed to load gallery photos")
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  if (loading) {
    return (
      <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
        <AnimatedBackground />
        
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent"></div>
          <div className="relative px-4 py-26 text-center flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="mb-4 mt-4">
                <h1 className="text-4xl md:text-6xl font-black text-[#FBEB04] tracking-tight">{t.additional.f1memeGallery}</h1>
              </div>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                {t.additional.f1memeGalleryDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Loading Grid */}
        <div className="px-4 sm:px-8 pb-16 mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      <AnimatedBackground />

      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent"></div>
        <div className="relative px-4 py-26 text-center flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="mb-4 mt-4">
              <h1 className="text-4xl md:text-6xl font-black text-[#FBEB04] tracking-tight">F1Meme Gallery</h1>
            </div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Community photos from our F1 enthusiasts
            </p>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="px-4 sm:px-8 pb-16 mt-10">
        <div className="max-w-7xl mx-auto">
          {error ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center">
                <Image className="w-12 h-12 text-red-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">{t.additional.failedToLoadGallery}</h3>
                <p className="text-slate-400 max-w-md">
                  {error}
                </p>
              </div>
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-red-500/20 rounded-full flex items-center justify-center">
                <Image className="w-12 h-12 text-yellow-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">{t.additional.noPhotosYet}</h3>
                <p className="text-slate-400 max-w-md">
                  {t.additional.noPhotosYetDesc}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Gallery 