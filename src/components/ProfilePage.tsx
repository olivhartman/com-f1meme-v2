"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { User, Instagram, Music, Globe, Upload, Save, Camera, Sparkles } from "lucide-react"
import { airtableService, type ProfileData as AirtableProfileData } from "../api/airtable"

interface ProfileData {
  name: string
  instagramUrl: string
  tiktokUrl: string
  vkUrl: string
  profilePicture: File | null
  coverPicture: File | null
}

const ProfilePage = () => {
  const { publicKey } = useWallet()
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    instagramUrl: "",
    tiktokUrl: "",
    vkUrl: "",
    profilePicture: null,
    coverPicture: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const profilePictureRef = useRef<HTMLInputElement>(null)
  const coverPictureRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: "profilePicture" | "coverPicture", file: File | null) => {
    setProfileData((prev) => ({ ...prev, [field]: file }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: "profilePicture" | "coverPicture") => {
    const file = event.target.files?.[0] || null
    if (file && file.type.startsWith("image/")) {
      handleFileChange(field, file)
    }
  }

  useEffect(() => {
    const loadProfile = async () => {
      if (publicKey) {
        try {
          const existingProfile = await airtableService.getProfile(publicKey.toBase58())
          if (existingProfile) {
            setProfileData({
              name: existingProfile.name,
              instagramUrl: existingProfile.instagramUrl,
              tiktokUrl: existingProfile.tiktokUrl,
              vkUrl: existingProfile.vkUrl,
              profilePicture: null,
              coverPicture: null,
            })
          }
        } catch (error) {
          console.error("Error loading profile:", error)
        }
      }
    }
    loadProfile()
  }, [publicKey])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    try {
      if (!publicKey) throw new Error("Wallet not connected")
      const airtableData: AirtableProfileData = {
        name: profileData.name,
        instagramUrl: profileData.instagramUrl,
        tiktokUrl: profileData.tiktokUrl,
        vkUrl: profileData.vkUrl,
        profilePicture: profileData.profilePicture || undefined,
        coverPicture: profileData.coverPicture || undefined,
        walletAddress: publicKey.toBase58(),
      }
      await airtableService.upsertProfile(airtableData)
      setMessage("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage("Error updating profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const walletAddress = publicKey?.toBase58() || ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23f1f5f9 fillOpacity=0.4%3E%3Ccircle cx=30 cy=30 r=1.5/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-8 pb-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/25 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <Sparkles className="h-7 w-7 text-white relative z-10" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-700 bg-clip-text text-transparent">
              BOXBOX
            </span>
          </div>
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
          <h1 className="text-2xl font-bold text-gray-800">Profile Dashboard</h1>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg shadow-gray-200/50 px-6 py-3 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-white/10"></div>
          <span className="text-sm font-semibold text-gray-700 relative z-10">
            {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 px-8 pb-8">
        {/* Left Sidebar */}
        <div className="lg:w-1/3 space-y-8">
          {/* Profile Card */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-gray-200/50 rounded-3xl p-8 relative overflow-hidden group hover:bg-white/70 hover:shadow-3xl hover:shadow-gray-300/30 transition-all duration-500">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent opacity-60"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
            <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-white/80 to-transparent"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-4 border-white/80 shadow-2xl shadow-gray-300/40 relative">
                  {profileData.profilePicture ? (
                    <img
                      src={URL.createObjectURL(profileData.profilePicture) || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-16 w-16 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                  <div className="absolute inset-0 rounded-full shadow-inner shadow-gray-400/20"></div>
                </div>

                <button
                  onClick={() => profilePictureRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 rounded-full p-3 shadow-2xl shadow-yellow-500/40 border-4 border-white/90 transition-all duration-300 hover:scale-110 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
                  <Upload className="h-5 w-5 text-white relative z-10" />
                </button>

                <input
                  ref={profilePictureRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "profilePicture")}
                  className="hidden"
                />
              </div>

              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{profileData.name || "Your Name"}</h2>
                <p className="text-gray-600 text-base mb-4">F1 Community Member</p>
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 via-blue-100 to-purple-100 rounded-full border border-purple-200/60 shadow-lg shadow-purple-200/30">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-purple-700 font-semibold">Premium Member</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Photo Card */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-gray-200/50 rounded-3xl p-8 relative overflow-hidden group hover:bg-white/70 hover:shadow-3xl hover:shadow-gray-300/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent opacity-60"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
            <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-white/80 to-transparent"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg shadow-yellow-500/30"></div>
                Cover Photo
              </h3>

              <div className="relative w-full h-40 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-2 border-white/60 shadow-inner shadow-gray-300/30 group/cover">
                {profileData.coverPicture ? (
                  <img
                    src={URL.createObjectURL(profileData.coverPicture) || "/placeholder.svg"}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="h-12 w-12 text-gray-400" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/10"></div>

                <button
                  onClick={() => coverPictureRef.current?.click()}
                  className="absolute bottom-3 right-3 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 rounded-full p-2.5 shadow-xl shadow-yellow-500/40 border-2 border-white/80 transition-all duration-300 hover:scale-110 opacity-90 group-hover/cover:opacity-100 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
                  <Upload className="h-4 w-4 text-white relative z-10" />
                </button>

                <input
                  ref={coverPictureRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "coverPicture")}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-gray-200/50 rounded-3xl p-10 relative overflow-hidden">
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent opacity-60"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
          <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-white/80 to-transparent"></div>

          <div className="relative z-10">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center gap-4">
                <div className="w-1.5 h-8 bg-gradient-to-b from-yellow-500 via-orange-500 to-yellow-600 rounded-full shadow-lg shadow-yellow-500/30"></div>
                Update Your Profile
              </h2>
              <p className="text-gray-600 text-lg">Customize your F1 community presence</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="space-y-3">
                <label className="block text-base font-semibold text-gray-700">Display Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500 group-focus-within:text-yellow-600 transition-colors duration-300" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 focus:bg-white/70 transition-all duration-300 text-lg shadow-inner shadow-gray-200/30"
                    placeholder="Enter your display name"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Social Media Fields */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg shadow-purple-500/30"></div>
                  Social Media Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Instagram</label>
                    <div className="relative group">
                      <Instagram className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-pink-600 transition-colors duration-300" />
                      <input
                        type="url"
                        value={profileData.instagramUrl}
                        onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-xl border border-white/60 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 focus:bg-white/70 transition-all duration-300 shadow-inner shadow-gray-200/20"
                        placeholder="Instagram URL"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-100/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">TikTok</label>
                    <div className="relative group">
                      <Music className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-red-600 transition-colors duration-300" />
                      <input
                        type="url"
                        value={profileData.tiktokUrl}
                        onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-xl border border-white/60 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 focus:bg-white/70 transition-all duration-300 shadow-inner shadow-gray-200/20"
                        placeholder="TikTok URL"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-100/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">VK</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-600 transition-colors duration-300" />
                      <input
                        type="url"
                        value={profileData.vkUrl}
                        onChange={(e) => handleInputChange("vkUrl", e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-xl border border-white/60 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/70 transition-all duration-300 shadow-inner shadow-gray-200/20"
                        placeholder="VK URL"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-100/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`p-5 rounded-2xl backdrop-blur-xl border shadow-lg relative overflow-hidden ${
                    message.includes("successfully")
                      ? "bg-green-100/60 border-green-200/60 text-green-800 shadow-green-200/30"
                      : "bg-red-100/60 border-red-200/60 text-red-800 shadow-red-200/30"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div
                      className={`w-3 h-3 rounded-full shadow-lg ${
                        message.includes("successfully")
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30"
                          : "bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/30"
                      }`}
                    ></div>
                    <span className="font-semibold">{message}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/40 hover:scale-[1.02] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="relative z-10 flex items-center space-x-3">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-6 w-6" />
                      <span>Save Profile</span>
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 