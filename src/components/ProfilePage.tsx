import { useState, useRef, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { User, Instagram, Music, Globe, Upload, Save, Camera } from "lucide-react";
import { airtableService, ProfileData as AirtableProfileData } from "../api/airtable";

interface ProfileData {
  name: string;
  instagramUrl: string;
  tiktokUrl: string;
  vkUrl: string;
  profilePicture: File | null;
  coverPicture: File | null;
}

const ProfilePage = () => {
  const { publicKey } = useWallet();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    instagramUrl: "",
    tiktokUrl: "",
    vkUrl: "",
    profilePicture: null,
    coverPicture: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const coverPictureRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'profilePicture' | 'coverPicture', file: File | null) => {
    setProfileData(prev => ({ ...prev, [field]: file }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'profilePicture' | 'coverPicture') => {
    const file = event.target.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
      handleFileChange(field, file);
    }
  };

  // Load existing profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      if (publicKey) {
        try {
          const existingProfile = await airtableService.getProfile(publicKey.toBase58());
          if (existingProfile) {
            setProfileData({
              name: existingProfile.name,
              instagramUrl: existingProfile.instagramUrl,
              tiktokUrl: existingProfile.tiktokUrl,
              vkUrl: existingProfile.vkUrl,
              profilePicture: null,
              coverPicture: null,
            });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadProfile();
  }, [publicKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      // Prepare data for Airtable
      const airtableData: AirtableProfileData = {
        name: profileData.name,
        instagramUrl: profileData.instagramUrl,
        tiktokUrl: profileData.tiktokUrl,
        vkUrl: profileData.vkUrl,
        profilePicture: profileData.profilePicture || undefined,
        coverPicture: profileData.coverPicture || undefined,
        walletAddress: publicKey.toBase58(),
      };

      // Save to Airtable
      await airtableService.upsertProfile(airtableData);
      
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const walletAddress = publicKey?.toBase58() || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <User className="h-8 w-8 text-yellow-500" />
              <h1 className="text-2xl font-bold text-white">Profile Dashboard</h1>
            </div>
            <div className="text-sm text-gray-400">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {profileData.profilePicture ? (
                      <img
                        src={URL.createObjectURL(profileData.profilePicture)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => profilePictureRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 rounded-full p-2 transition-colors"
                  >
                    <Upload className="h-4 w-4 text-white" />
                  </button>
                  <input
                    ref={profilePictureRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profilePicture')}
                    className="hidden"
                  />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {profileData.name || "Your Name"}
                </h2>
                <p className="text-gray-400 text-sm mt-1">F1 Community Member</p>
              </div>
            </div>

            {/* Cover Photo */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Cover Photo</h3>
              <div className="relative">
                <div className="w-full h-32 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden">
                  {profileData.coverPicture ? (
                    <img
                      src={URL.createObjectURL(profileData.coverPicture)}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => coverPictureRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-yellow-500 hover:bg-yellow-600 rounded-full p-2 transition-colors"
                >
                  <Upload className="h-4 w-4 text-white" />
                </button>
                <input
                  ref={coverPictureRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'coverPicture')}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Update Your Profile</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter your display name"
                    />
                  </div>
                </div>

                {/* Social Media Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Instagram URL
                    </label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={profileData.instagramUrl}
                        onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      TikTok URL
                    </label>
                    <div className="relative">
                      <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={profileData.tiktokUrl}
                        onChange={(e) => handleInputChange('tiktokUrl', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="https://tiktok.com/@username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      VK URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={profileData.vkUrl}
                        onChange={(e) => handleInputChange('vkUrl', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="https://vk.com/username"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.includes('successfully') 
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                      : 'bg-red-500/20 border border-red-500/50 text-red-400'
                  }`}>
                    {message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 