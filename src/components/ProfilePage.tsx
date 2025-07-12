"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { User, Instagram, Music, Globe, Upload, Save, Camera } from "lucide-react"
import { airtableService, type ProfileData as AirtableProfileData } from "../api/airtable"
import Loader from "./Loader";

interface ProfileData {
  name: string;
  email: string;
  instagramUrl: string;
  tiktokUrl: string;
  vkUrl: string;
  profilePicture: File | null;
  coverPicture: File | null;
  profilePictureUrl?: string;
  coverPictureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ProfilePage = () => {
  const { publicKey } = useWallet()
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    instagramUrl: "",
    tiktokUrl: "",
    vkUrl: "",
    profilePicture: null,
    coverPicture: null,
    profilePictureUrl: "",
    coverPictureUrl: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const profilePictureRef = useRef<HTMLInputElement>(null)
  const coverPictureRef = useRef<HTMLInputElement>(null)
  const [showLoader, setShowLoader] = useState(true);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    vkUrl?: string;
    profilePicture?: string;
    coverPicture?: string;
  }>({});

  // Function to format date in the requested format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };

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
          // First, let's get the table structure to see all available fields
          await airtableService.getTableFields();
          
          const existingProfile = await airtableService.getProfile(publicKey.toBase58())
          if (existingProfile) {
            setProfileData({
              name: existingProfile.name,
              email: existingProfile.email || "",
              instagramUrl: existingProfile.instagramUrl,
              tiktokUrl: existingProfile.tiktokUrl,
              vkUrl: existingProfile.vkUrl,
              profilePicture: null,
              coverPicture: null,
              profilePictureUrl: existingProfile.profilePictureUrl,
              coverPictureUrl: existingProfile.coverPictureUrl,
              createdAt: existingProfile.createdAt || undefined,
              updatedAt: existingProfile.updatedAt || undefined,
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
      // Cleanup any object URLs to prevent memory leaks
      if (profileData.profilePicture) {
        URL.revokeObjectURL(URL.createObjectURL(profileData.profilePicture))
      }
      if (profileData.coverPicture) {
        URL.revokeObjectURL(URL.createObjectURL(profileData.coverPicture))
      }
    }
  }, [profileData.profilePicture, profileData.coverPicture])

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  function validateField(field: keyof ProfileData, value: string | File | null): string | undefined {
    if (field === "name") {
      if (!value || typeof value !== "string" || value.trim().length < 2) return "Name is required (2+ chars).";
      if (value.length > 32) return "Name must be at most 32 characters.";
    }
    if (field === "email") {
      if (!value || typeof value !== "string") return "Email is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Enter a valid email address.";
    }
    if (["instagramUrl", "tiktokUrl", "vkUrl"].includes(field)) {
      if (value && typeof value === "string" && value.trim() !== "") {
        try {
          const url = new URL(value);
          if (field === "instagramUrl" && !url.hostname.includes("instagram.com")) return "Must be an Instagram URL.";
          if (field === "tiktokUrl" && !url.hostname.includes("tiktok.com")) return "Must be a TikTok URL.";
          if (field === "vkUrl" && !url.hostname.includes("vk.com")) return "Must be a VK URL.";
        } catch {
          return "Enter a valid URL.";
        }
      }
    }
    if ((field === "profilePicture" || field === "coverPicture") && value) {
      if (value instanceof File && !value.type.startsWith("image/")) return "File must be an image.";
    }
    return undefined;
  }

  function validateAll(): boolean {
    const errors: typeof formErrors = {};
    errors.name = validateField("name", profileData.name);
    errors.email = validateField("email", profileData.email);
    errors.instagramUrl = validateField("instagramUrl", profileData.instagramUrl);
    errors.tiktokUrl = validateField("tiktokUrl", profileData.tiktokUrl);
    errors.vkUrl = validateField("vkUrl", profileData.vkUrl);
    errors.profilePicture = validateField("profilePicture", profileData.profilePicture);
    errors.coverPicture = validateField("coverPicture", profileData.coverPicture);
    setFormErrors(errors);
    return Object.values(errors).every((e) => !e);
  }

  function handleBlur(field: keyof ProfileData) {
    setFormErrors((prev) => ({ ...prev, [field]: validateField(field, profileData[field]) }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    const valid = validateAll();
    if (!valid) {
      setIsLoading(false);
      setMessage("Please fill the required fields.");
      return;
    }
    try {
      if (!publicKey) throw new Error("Wallet not connected")
      const airtableData: AirtableProfileData = {
        name: profileData.name,
        email: profileData.email,
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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xl">
          <Loader />
        </div>
      )}
      {!showLoader && (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-18">
          {/* Cover Photo */}
          <div className="relative w-full h-48 sm:h-64 bg-gray-200">
            {profileData.coverPicture || profileData.coverPictureUrl ? (
              <img
                src={getImagePreviewUrl(profileData.coverPicture, profileData.coverPictureUrl)}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="h-14 w-14 text-gray-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            )}
            <button
              className="absolute bottom-4 right-4 bg-white/90 rounded-full p-2 shadow hover:bg-gray-100 transition"
              onClick={() => coverPictureRef.current?.click()}
              type="button"
            >
              <Upload className="h-5 w-5 text-gray-700" />
            </button>
            <input
              ref={coverPictureRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "coverPicture")}
              className="hidden"
            />
          </div>

          {/* Profile Header */}
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-4 px-8 pt-0 pb-6 bg-white">
            <div className="relative -mt-16 sm:-mt-20">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                {profileData.profilePicture || profileData.profilePictureUrl ? (
                  <img
                    src={getImagePreviewUrl(profileData.profilePicture, profileData.profilePictureUrl)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="h-10 w-10 text-gray-400" />
                )}
                <button
                  className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition"
                  onClick={() => profilePictureRef.current?.click()}
                  type="button"
                >
                  <Upload className="h-4 w-4 text-gray-700" />
                </button>
                <input
                  ref={profilePictureRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "profilePicture")}
                  className="hidden"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center sm:items-start mt-2 sm:mt-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{profileData.name || "Your Name"}</h2>
              {/* Optionally add stats here */}
              {/* <div className="text-sm text-gray-500">193 followers · 21 following</div> */}
            </div>
            <div className="w-full sm:w-auto flex justify-end mt-4 sm:mt-0">
              <button
                type="submit"
                form="profile-form"
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-full shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Section */}
          <form id="profile-form" onSubmit={handleSubmit} className="px-8 pb-10 pt-2 bg-white">
            {message && (
              <div
                className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 min-w-[260px] max-w-xs p-5 rounded-2xl border shadow-lg flex items-center gap-3 transition-transform duration-500 ease-out
      ${message.includes('successfully')
        ? 'bg-green-100 border-green-200 text-green-800 shadow-green-200/40'
        : 'bg-red-100 border-red-200 text-red-800 shadow-red-200/40'}
      animate-slide-in-tc`}
    style={{animation: 'slide-in-tc 0.5s cubic-bezier(0.4,0,0.2,1)'}}
  >
    <div
      className={`w-3 h-3 rounded-full shadow-lg flex-shrink-0
        ${message.includes('successfully')
          ? 'bg-gradient-to-r from-green-400 to-emerald-400 shadow-green-400/30'
          : 'bg-gradient-to-r from-red-400 to-pink-400 shadow-red-400/30'}`}
    ></div>
    <span className="font-semibold text-sm">{message}</span>
  </div>
)}
            <h3 className="text-lg font-semibold text-gray-800 mb-6 mt-2">Personal details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`w-full px-4 py-3 border ${formErrors.name ? "border-red-500" : "border-gray-300"} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 text-base bg-white`}
                  placeholder="Enter your display name"
                />
                {formErrors.name && <div className="text-red-500 text-xs mt-1">{formErrors.name}</div>}
              </div>
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full px-4 py-3 border ${formErrors.email ? "border-red-500" : "border-gray-300"} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 text-base bg-white`}
                  placeholder="Enter your email address"
                />
                {formErrors.email && <div className="text-red-500 text-xs mt-1">{formErrors.email}</div>}
              </div>
              {/* Instagram Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input
                  type="url"
                  value={profileData.instagramUrl}
                  onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                  onBlur={() => handleBlur("instagramUrl")}
                  className={`w-full px-4 py-3 border ${formErrors.instagramUrl ? "border-red-500" : "border-gray-300"} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 text-base bg-white`}
                  placeholder="https://instagram.com/username"
                />
                {formErrors.instagramUrl && <div className="text-red-500 text-xs mt-1">{formErrors.instagramUrl}</div>}
              </div>
              {/* TikTok Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                <input
                  type="url"
                  value={profileData.tiktokUrl}
                  onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
                  onBlur={() => handleBlur("tiktokUrl")}
                  className={`w-full px-4 py-3 border ${formErrors.tiktokUrl ? "border-red-500" : "border-gray-300"} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 text-base bg-white`}
                  placeholder="https://tiktok.com/username"
                />
                {formErrors.tiktokUrl && <div className="text-red-500 text-xs mt-1">{formErrors.tiktokUrl}</div>}
              </div>
              {/* VK Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VK</label>
                <input
                  type="url"
                  value={profileData.vkUrl}
                  onChange={(e) => handleInputChange("vkUrl", e.target.value)}
                  onBlur={() => handleBlur("vkUrl")}
                  className={`w-full px-4 py-3 border ${formErrors.vkUrl ? "border-red-500" : "border-gray-300"} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 text-base bg-white`}
                  placeholder="https://vk.com/username"
                />
                {formErrors.vkUrl && <div className="text-red-500 text-xs mt-1">{formErrors.vkUrl}</div>}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ProfilePage 