"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { User, Instagram, Music, Send, Upload, Save, Camera, Check, AlertCircle, X, Plus } from "lucide-react"
import { airtableService, type ProfileData as AirtableProfileData, type GalleryPhoto } from "../api/airtable"
import Loader from "./Loader";
import { useTranslation } from "../i18n/TranslationContext";

interface ProfileData {
  name: string;
  email: string;
  instagramUrl: string;
  tiktokUrl: string;
  tgUrl: string;
  profilePicture: File | null;
  coverPicture: File | null;
  profilePictureUrl?: string;
  coverPictureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  membershipLevel?: number;
}

const ProfilePage: React.FC = () => {
  const { t } = useTranslation()
  const { publicKey } = useWallet()
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    instagramUrl: "",
    tiktokUrl: "",
    tgUrl: "",
    profilePicture: null,
    coverPicture: null,
    profilePictureUrl: "",
    coverPictureUrl: "",
    membershipLevel: undefined,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const profilePictureRef = useRef<HTMLInputElement>(null)
  const coverPictureRef = useRef<HTMLInputElement>(null)
  const [showLoader, setShowLoader] = useState(true)
  const [formErrors, setFormErrors] = useState<{
    name?: string
    email?: string
    instagramUrl?: string
    tiktokUrl?: string
    tgUrl?: string
    profilePicture?: string
    coverPicture?: string
  }>({})
  
  // Gallery state
  const [galleryPhoto, setGalleryPhoto] = useState<File | null>(null)
  const [galleryCaption, setGalleryCaption] = useState("")
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)
  const [galleryMessage, setGalleryMessage] = useState("")
  const galleryPhotoRef = useRef<HTMLInputElement>(null)

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

  // Get preview URL for selected images
  const getImagePreviewUrl = (file: File | null, existingUrl?: string): string => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return existingUrl || ""
  }

  useEffect(() => {
    const loadProfile = async () => {
      if (publicKey) {
        try {
          const existingProfile = await airtableService.getProfile(publicKey.toBase58())
          if (existingProfile) {
            setProfileData({
              name: existingProfile.name,
              email: existingProfile.email || "",
              instagramUrl: existingProfile.instagramUrl,
              tiktokUrl: existingProfile.tiktokUrl,
              tgUrl: existingProfile.tgUrl,
              profilePicture: null,
              coverPicture: null,
              profilePictureUrl: existingProfile.profilePictureUrl,
              coverPictureUrl: existingProfile.coverPictureUrl,
              createdAt: existingProfile.createdAt || undefined,
              updatedAt: existingProfile.updatedAt || undefined,
              membershipLevel: typeof existingProfile.membershipLevel === 'number' ? existingProfile.membershipLevel : 0,
            })
          }
        } catch (error) {
          console.error("Error loading profile:", error)
        }
      }
    }
    loadProfile()
  }, [publicKey])

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (profileData.profilePicture) {
        const url = URL.createObjectURL(profileData.profilePicture)
        URL.revokeObjectURL(url)
      }
      if (profileData.coverPicture) {
        const url = URL.createObjectURL(profileData.coverPicture)
        URL.revokeObjectURL(url)
      }
    }
  }, [profileData.profilePicture, profileData.coverPicture])

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  function validateField(field: keyof ProfileData, value: string | File | null): string | undefined {
    if (field === "name") {
      if (!value || typeof value !== "string" || value.trim().length < 2) return t.additional.nameRequired
      if (value.length > 32) return t.additional.nameMaxLength
    }
    if (field === "email") {
      if (!value || typeof value !== "string") return t.additional.emailRequired
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return t.additional.validEmail
    }
    if (["instagramUrl", "tiktokUrl", "tgUrl"].includes(field)) {
      if (value && typeof value === "string" && value.trim() !== "") {
        try {
          const url = new URL(value)
          if (field === "instagramUrl" && !url.hostname.includes("instagram.com")) return t.additional.validInstagramUrl
          if (field === "tiktokUrl" && !url.hostname.includes("tiktok.com")) return t.additional.validTiktokUrl
          if (field === "tgUrl" && !url.hostname.includes("t.me")) return t.additional.validTelegramUrl
        } catch {
          return t.additional.validUrl
        }
      }
    }
    if ((field === "profilePicture" || field === "coverPicture") && value) {
      if (value instanceof File && !value.type.startsWith("image/")) return t.additional.imageFileRequired
    }
    return undefined
  }

  function validateAll(): boolean {
    const errors: typeof formErrors = {}
    errors.name = validateField("name", profileData.name)
    errors.email = validateField("email", profileData.email)
    errors.instagramUrl = validateField("instagramUrl", profileData.instagramUrl)
    errors.tiktokUrl = validateField("tiktokUrl", profileData.tiktokUrl)
    errors.tgUrl = validateField("tgUrl", profileData.tgUrl)
    errors.profilePicture = validateField("profilePicture", profileData.profilePicture)
    errors.coverPicture = validateField("coverPicture", profileData.coverPicture)
    setFormErrors(errors)
    return Object.values(errors).every((e) => !e)
  }

  function handleBlur(field: keyof ProfileData) {
    // Only validate string or File fields, not number fields like membershipLevel
    if (field !== 'membershipLevel') {
      setFormErrors((prev) => ({ ...prev, [field]: validateField(field, profileData[field] ?? null) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    const valid = validateAll()
    if (!valid) {
      setIsLoading(false)
      setMessage(t.additional.fillRequiredFields)
      return
    }

    try {
      if (!publicKey) throw new Error(t.additional.walletNotConnected)
      const airtableData: AirtableProfileData = {
        name: profileData.name,
        email: profileData.email,
        instagramUrl: profileData.instagramUrl,
        tiktokUrl: profileData.tiktokUrl,
        tgUrl: profileData.tgUrl,
        profilePicture: profileData.profilePicture || undefined,
        coverPicture: profileData.coverPicture || undefined,
        walletAddress: publicKey.toBase58(),
        membershipLevel: typeof profileData.membershipLevel === 'number' ? profileData.membershipLevel : 0,
      }
      await airtableService.upsertProfile(airtableData)
      setMessage(t.additional.profileUpdatedSuccess)
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage(t.additional.errorUpdatingProfile)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, field: "profilePicture" | "coverPicture") => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      handleFileChange(field, file)
    }
  }

  // Gallery handlers
  const handleGalleryPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file && file.type.startsWith("image/")) {
      setGalleryPhoto(file)
    }
  }

  const handleGalleryUpload = async (): Promise<void> => {
    if (!galleryPhoto || !publicKey) return
    
    setIsUploadingGallery(true)
    setGalleryMessage("")
    
    try {
      // Upload image to Cloudinary
      const { cloudinaryService } = await import('../api/cloudinary')
      const imageUrl = await cloudinaryService.uploadImage(galleryPhoto)
      
      // Get user profile for name
      const userProfile = await airtableService.getProfile(publicKey.toBase58())
      const uploadedBy = userProfile?.name || 'Anonymous'
      
      // Create gallery photo object
      const galleryPhotoData: GalleryPhoto = {
        url: imageUrl,
        uploadedBy,
        uploadedAt: new Date().toISOString(),
        walletAddress: publicKey.toBase58(),
        caption: galleryCaption.trim(),
      }
      
      // Save to Airtable
      await airtableService.uploadGalleryPhoto(galleryPhotoData)
      
      setGalleryMessage(t.additional.photoUploadedSuccess)
      setGalleryPhoto(null)
      setGalleryCaption("")
      if (galleryPhotoRef.current) {
        galleryPhotoRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading gallery photo:", error)
      setGalleryMessage(t.additional.errorUploadingPhoto)
    } finally {
      setIsUploadingGallery(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F182C] flex flex-col items-center py-8 px-4">
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
          <Loader />
        </div>
      )}

      {!showLoader && (
        <div className="w-full max-w-5xl mx-auto mt-26">
          {/* Main Profile Card */}
          <div className="bg-[#151e32] backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/40 overflow-hidden border border-[#232c43]">
            {/* Cover Photo Section */}
            <div
              className="relative w-full h-56 sm:h-72 bg-[#1a2336] group cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "coverPicture")}
              onClick={() => coverPictureRef.current?.click()}
            >
            {profileData.coverPicture || profileData.coverPictureUrl ? (
              <img
                  src={getImagePreviewUrl(profileData.coverPicture, profileData.coverPictureUrl) || "/placeholder.svg"}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400/80">
                  <Camera className="h-16 w-16 mb-3" />
                  <p className="text-lg font-medium">{t.additional.addCoverPhoto}</p>
                  <p className="text-sm opacity-75">{t.additional.clickOrDragToUpload}</p>
                </div>
            )}

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-[#232c43]/80 backdrop-blur-sm rounded-full p-4">
                  <Upload className="h-8 w-8 text-slate-200" />
                </div>
              </div>

            <input
              ref={coverPictureRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "coverPicture")}
              className="hidden"
            />
          </div>

          {/* Profile Header */}
            <div className="relative px-8 pt-0 pb-8 bg-[#151e32]">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                {/* Profile Picture */}
                <div className="relative -mt-20 sm:-mt-24">
                  <div
                    className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-[#232c43] to-[#0F182C] p-1 shadow-2xl group cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "profilePicture")}
                    onClick={() => profilePictureRef.current?.click()}
                  >
                    <div className="w-full h-full rounded-full bg-[#232c43] overflow-hidden flex items-center justify-center">
                {profileData.profilePicture || profileData.profilePictureUrl ? (
                  <img
                          src={getImagePreviewUrl(profileData.profilePicture, profileData.profilePictureUrl) || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          <User className="h-12 w-12 mb-2" />
                          <span className="text-xs font-medium">{t.additional.addPhoto}</span>
                        </div>
                )}
                    </div>

                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
                      <div className="bg-[#232c43]/80 backdrop-blur-sm rounded-full p-3">
                        <Upload className="h-6 w-6 text-slate-200" />
                      </div>
                    </div>
                  </div>

                <input
                  ref={profilePictureRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "profilePicture")}
                  className="hidden"
                />
              </div>

                {/* Profile Info */}
                <div className="flex-1 flex flex-col items-center sm:items-start mt-4 sm:mt-8">
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent mb-2">
                    {profileData.name || t.additional.yourName}
                  </h1>
                  <p className="text-slate-300 font-medium">{profileData.email}</p>

                  {/* Social Links Preview */}
                  <div className="flex gap-3 mt-4">
                    {profileData.instagramUrl && (
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-yellow-400 rounded-full flex items-center justify-center">
                        <Instagram className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {profileData.tiktokUrl && (
                      <div className="w-10 h-10 bg-gradient-to-br from-black to-[#232c43] rounded-full flex items-center justify-center">
                        <Music className="h-5 w-5 text-slate-200" />
                      </div>
                    )}
                    {profileData.tgUrl && (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center">
                        <Send className="h-5 w-5 text-white" />
                      </div>
                    )}
            </div>
            </div>

                {/* Save Button */}
                <div className="w-full sm:w-auto mt-6 sm:mt-0">
              <button
                type="submit"
                form="profile-form"
                disabled={isLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg shadow-yellow-900/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                        <span>{t.additional.saveProfile}</span>
                  </>
                )}
              </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="mt-8 bg-[#151e32] backdrop-blur-xl rounded-3xl shadow-xl shadow-black/30 border border-[#232c43] overflow-hidden">
            <form id="profile-form" onSubmit={handleSubmit} className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">{t.additional.personalInfo}</h2>
  </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    {t.additional.name} <span className="text-red-500">*</span>
                  </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                    className={`w-full px-4 py-4 border-2 ${
                      formErrors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-[#232c43] focus:border-yellow-500 focus:ring-yellow-200"
                    } rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 text-base bg-[#232c43]/70 backdrop-blur-sm`}
                  placeholder={t.additional.name}
                />
                  {formErrors.name && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.name}
                    </div>
                  )}
              </div>

              {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    {t.additional.email} <span className="text-red-500">*</span>
                  </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                    className={`w-full px-4 py-4 border-2 ${
                      formErrors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-[#232c43] focus:border-yellow-500 focus:ring-yellow-200"
                    } rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 text-base bg-[#232c43]/70 backdrop-blur-sm`}
                  placeholder={t.additional.email}
                />
                  {formErrors.email && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.email}
                    </div>
                  )}
              </div>

              {/* Instagram Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-500" />
                    {t.additional.instagramUrl}
                  </label>
                <input
                  type="url"
                  value={profileData.instagramUrl}
                  onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                  onBlur={() => handleBlur("instagramUrl")}
                    className={`w-full px-4 py-4 border-2 ${
                      formErrors.instagramUrl
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-[#232c43] focus:border-pink-500 focus:ring-pink-200"
                    } rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 text-base bg-[#232c43]/70 backdrop-blur-sm`}
                  placeholder={t.additional.instagramUrl}
                />
                  {formErrors.instagramUrl && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.instagramUrl}
                    </div>
                  )}
              </div>

              {/* TikTok Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Music className="h-4 w-4 text-slate-100" />
                    {t.additional.tiktokUrl}
                  </label>
                <input
                  type="url"
                  value={profileData.tiktokUrl}
                  onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
                  onBlur={() => handleBlur("tiktokUrl")}
                    className={`w-full px-4 py-4 border-2 ${
                      formErrors.tiktokUrl
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-[#232c43] focus:border-yellow-500 focus:ring-yellow-200"
                    } rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 text-base bg-[#232c43]/70 backdrop-blur-sm`}
                  placeholder={t.additional.tiktokUrl}
                />
                  {formErrors.tiktokUrl && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.tiktokUrl}
                    </div>
                  )}
              </div>

              {/* Telegram Field */}
                <div className="space-y-2 lg:col-span-2">
                  <label className="block text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Send className="h-4 w-4 text-blue-400" />
                    {t.additional.telegramUrl}
                  </label>
                <input
                  type="url"
                  value={profileData.tgUrl}
                  onChange={(e) => handleInputChange("tgUrl", e.target.value)}
                  onBlur={() => handleBlur("tgUrl")}
                    className={`w-full px-4 py-4 border-2 ${
                      formErrors.tgUrl
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-[#232c43] focus:border-blue-500 focus:ring-blue-200"
                    } rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 text-base bg-[#232c43]/70 backdrop-blur-sm`}
                  placeholder={t.additional.telegramUrl}
                />
                  {formErrors.tgUrl && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.tgUrl}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Gallery Section - Always visible, but restricted for users below level 55 */}
          <div className="mt-8 bg-[#151e32] backdrop-blur-xl rounded-3xl shadow-xl shadow-black/30 border border-[#232c43] overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between mb-8 gap-2 sm:gap-3">
                <h2 className="text-2xl font-bold text-slate-100">{t.additional.galleryUpload}</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  Gallery Access
                </span>
              </div>

              <div className="space-y-6">
                {/* Photo Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-200">
                    {t.additional.uploadPhoto} <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative w-full h-48 bg-[#1a2336] rounded-xl border-2 border-dashed border-[#232c43] group cursor-pointer ${profileData.membershipLevel !== undefined && profileData.membershipLevel < 55 ? 'opacity-60 pointer-events-none' : 'hover:border-yellow-500/50 transition-all duration-300'}`}
                    onDragOver={profileData.membershipLevel !== undefined && profileData.membershipLevel < 55 ? undefined : (e) => e.preventDefault()}
                    onDrop={profileData.membershipLevel !== undefined && profileData.membershipLevel < 55 ? undefined : (e) => {
                      e.preventDefault()
                      const file = e.dataTransfer.files[0]
                      if (file && file.type.startsWith("image/")) {
                        setGalleryPhoto(file)
                      }
                    }}
                    onClick={profileData.membershipLevel !== undefined && profileData.membershipLevel < 55 ? undefined : () => galleryPhotoRef.current?.click()}
                  >
                    {galleryPhoto ? (
                      <img
                        src={URL.createObjectURL(galleryPhoto)}
                        alt="Gallery preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400/80">
                        <Plus className="h-12 w-12 mb-3" />
                        <p className="text-lg font-medium">{t.additional.uploadPhoto}</p>
                        <p className="text-sm opacity-75">{t.additional.dragOrClick}</p>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                      <div className="bg-[#232c43]/80 backdrop-blur-sm rounded-full p-3">
                        <Upload className="h-6 w-6 text-slate-200" />
                      </div>
                    </div>
                  </div>

                  <input
                    ref={galleryPhotoRef}
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryPhotoChange}
                    className="hidden"
                    disabled={profileData.membershipLevel !== undefined && profileData.membershipLevel < 55}
                  />
                </div>

                {/* Caption Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Caption (Optional)
                  </label>
                  <textarea
                    value={galleryCaption}
                    onChange={(e) => setGalleryCaption(e.target.value)}
                    placeholder="Add a caption for your photo..."
                    className={`w-full px-4 py-3 border-2 border-[#232c43] focus:border-yellow-500 focus:ring-yellow-200 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 text-base bg-[#232c43]/70 backdrop-blur-sm resize-none ${
                      profileData.membershipLevel !== undefined && profileData.membershipLevel < 55 ? 'opacity-60 pointer-events-none' : ''
                    }`}
                    rows={3}
                    disabled={profileData.membershipLevel !== undefined && profileData.membershipLevel < 55}
                  />
                </div>

                {/* Upload Button */}
                <div className="space-y-4">
                  <button
                    onClick={handleGalleryUpload}
                    disabled={profileData.membershipLevel === undefined || profileData.membershipLevel < 55 || !galleryPhoto || isUploadingGallery}
                    className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-yellow-900/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  >
                    {isUploadingGallery ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        <span>Upload to Gallery</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Upgrade message for users below level 55 */}
                {profileData.membershipLevel !== undefined && profileData.membershipLevel < 55 && (
                  <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Upgrade to Level 55+ to upload photos to the gallery!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery Message */}
              {galleryMessage && (
                <div className={`mt-4 p-4 rounded-xl ${
                  galleryMessage.includes("successfully")
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}>
                  <div className="flex items-center gap-2">
                    {galleryMessage.includes("successfully") ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="font-medium">{galleryMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

      {/* Toast Notification */}
      {message && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              message.includes("successfully")
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-800 shadow-emerald-500/20"
                : "bg-red-50/90 border-red-200 text-red-800 shadow-red-500/20"
            }`}
          >
            {message.includes("successfully") ? (
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            ) : (
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <X className="h-4 w-4 text-white" />
              </div>
            )}
            <span className="font-semibold">{message}</span>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  )
}

export default ProfilePage 