import { cloudinaryService } from './cloudinary';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://boxbox-prediction.up.railway.app';

export interface ProfileData {
  name: string;
  email: string;
  instagramUrl: string;
  tiktokUrl: string;
  tgUrl: string;
  profilePicture?: File;
  coverPicture?: File;
  walletAddress: string;
  profilePictureUrl?: string;
  coverPictureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  membershipLevel?: number;
}

export interface GalleryPhoto {
  id?: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  walletAddress: string;
  caption?: string;
}

export const airtableService = {
  // Create or update profile
  async upsertProfile(profileData: ProfileData): Promise<void> {
    try {
      console.log('Starting upsertProfile with wallet:', profileData.walletAddress);
      
      // Prepare payload
      const payload: any = {
        walletAddress: profileData.walletAddress,
      };

      // Only add fields that have actual values (not empty strings)
      if (profileData.name && profileData.name.trim()) {
        payload.name = profileData.name;
      }
      
      if (profileData.email && profileData.email.trim()) {
        payload.email = profileData.email;
      }
      
      if (profileData.instagramUrl && profileData.instagramUrl.trim()) {
        payload.instagramUrl = profileData.instagramUrl;
      }

      // Handle membership level with validation
      if (typeof profileData.membershipLevel === 'number') {
        const levelValue = Math.max(0, Math.min(profileData.membershipLevel, 999)); // Ensure it's a valid positive number
        console.log('Original membership level:', profileData.membershipLevel);
        console.log('Validated membership level:', levelValue);
        payload.membershipLevel = levelValue;
      }

      // Only add TikTok and TG URLs if the fields exist in your table and have values
      if (profileData.tiktokUrl && profileData.tiktokUrl.trim()) {
        payload.tiktokUrl = profileData.tiktokUrl;
      }
      
      if (profileData.tgUrl && profileData.tgUrl.trim()) {
        payload.tgUrl = profileData.tgUrl;
      }

      // Handle profile picture attachment
      if (profileData.profilePicture) {
        console.log('Processing profile picture:', profileData.profilePicture.name);
        try {
          const imageUrl = await cloudinaryService.uploadImage(profileData.profilePicture);
          payload.profilePictureUrl = imageUrl;
          console.log('Profile picture uploaded successfully');
        } catch (error) {
          console.error('Failed to upload profile picture:', error);
          // Continue without the image if upload fails
        }
      }

      // Handle cover picture attachment
      if (profileData.coverPicture) {
        console.log('Processing cover picture:', profileData.coverPicture.name);
        try {
          const imageUrl = await cloudinaryService.uploadImage(profileData.coverPicture);
          payload.coverPictureUrl = imageUrl;
          console.log('Cover picture uploaded successfully');
        } catch (error) {
          console.error('Failed to upload cover picture:', error);
          // Continue without the image if upload fails
        }
      }

      console.log('Prepared payload:', payload);

      // Call the backend API
      const response = await fetch(`${API_BASE_URL}/f1meme/profiles/upsert/${profileData.walletAddress}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upsert profile error response:', errorText);
        throw new Error(`Upsert profile failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Handle empty responses (like 204 No Content)
      const responseText = await response.text();
      if (responseText && responseText.trim() !== '') {
        try {
          const data = JSON.parse(responseText);
          console.log('Upsert response data:', data);
        } catch (parseError) {
          console.log('Upsert response is not JSON, treating as success');
        }
      }

      console.log('Profile upserted successfully');
    } catch (error) {
      console.error('Error upserting profile:', error);
      if (typeof error === 'object' && error !== null) {
        if ('message' in error) {
          console.error('Error details:', { message: error.message });
        }
        if ('statusCode' in error) {
          console.error('Error statusCode:', error.statusCode);
        }
        if ('error' in error) {
          console.error('Error error:', error.error);
        }
      } else {
        console.error('Error details:', String(error));
      }
      throw error;
    }
  },

  // Get profile by wallet address
  async getProfile(walletAddress: string): Promise<ProfileData | null> {
    try {
      console.log('Getting profile for wallet:', walletAddress);
      const response = await fetch(`${API_BASE_URL}/f1meme/profiles/wallet/${walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get profile error response:', errorText);
        throw new Error(`Get profile failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Handle empty responses (like 204 No Content)
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        console.log('Empty response received, returning null');
        return null;
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', responseText);
        throw new Error(`Invalid JSON response: ${parseError}`);
      }
      
      console.log('Profile data:', data);

      if (!data || (!data.wallet_address && !data.walletAddress)) {
        return null;
      }
      
      return {
        name: data.name || '',
        email: data.email || '',
        instagramUrl: data.instagram_url || data.instagramUrl || '',
        tiktokUrl: data.tiktok_url || data.tiktokUrl || '',
        tgUrl: data.tg_url || data.tgUrl || '',
        profilePicture: undefined, // We don't load existing images back as Files
        coverPicture: undefined,   // We don't load existing images back as Files
        walletAddress: data.wallet_address || data.walletAddress || '',
        createdAt: data.created_at || data.createdAt || undefined,
        updatedAt: data.updated_at || data.updatedAt || undefined,
        profilePictureUrl: data.profile_picture_url || data.profilePictureUrl || '',
        coverPictureUrl: data.cover_picture_url || data.coverPictureUrl || '',
        membershipLevel: data.membership_level || data.membershipLevel || 0,
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  // Get all profiles (for community page)
  async getAllProfiles(): Promise<ProfileData[]> {
    try {
      console.log('Getting all profiles from:', `${API_BASE_URL}/f1meme/profiles/all`);
      const response = await fetch(`${API_BASE_URL}/f1meme/profiles/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('getAllProfiles response status:', response.status);
      console.log('getAllProfiles response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('getAllProfiles error response:', errorText);
        throw new Error(`Failed to fetch all profiles: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      // Handle empty responses
      const responseText = await response.text();
      console.log('getAllProfiles raw response text:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        console.log('Empty response received for getAllProfiles, returning empty array');
        return [];
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('getAllProfiles parsed data:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON response for getAllProfiles:', responseText);
        throw new Error(`Invalid JSON response: ${parseError}`);
      }
      
      const profiles = data.profiles || data || [];
      console.log('getAllProfiles profiles array:', profiles);
      
      return profiles.map((profile: any) => {
        return {
          name: profile.name || '',
          instagramUrl: profile.instagram_url || profile.instagramUrl || '',
          tiktokUrl: profile.tiktok_url || profile.tiktokUrl || '',
          tgUrl: profile.tg_url || profile.tgUrl || '',
          profilePictureUrl: profile.profile_picture_url || profile.profilePictureUrl || '',
          coverPictureUrl: profile.cover_picture_url || profile.coverPictureUrl || '',
          walletAddress: profile.wallet_address || profile.walletAddress || '',
          membershipLevel: profile.membership_level || profile.membershipLevel || 0,
        // Do not include email
        };
      });
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }
  },

  // Gallery methods
  async uploadGalleryPhoto(photo: GalleryPhoto): Promise<void> {
    try {
      console.log('Uploading gallery photo:', photo);
      
      const payload = {
        url: photo.url,
        uploadedBy: photo.uploadedBy,
        uploadedAt: photo.uploadedAt,
        walletAddress: photo.walletAddress,
        caption: photo.caption || '',
      };

      const response = await fetch(`${API_BASE_URL}/f1meme/gallery/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload gallery photo error response:', errorText);
        throw new Error(`Upload gallery photo failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gallery photo uploaded successfully:', data);
    } catch (error) {
      console.error('Error uploading gallery photo:', error);
      throw error;
    }
  },

  async getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
    try {
      console.log('Getting all gallery photos...');
      const response = await fetch(`${API_BASE_URL}/f1meme/gallery/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get all gallery photos error response:', errorText);
        throw new Error(`Get all gallery photos failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('All gallery photos data:', data);

      return (data.photos || []).map((photo: any) => ({
        id: photo.id,
        url: photo.url || '',
        uploadedBy: photo.uploaded_by || photo.uploadedBy || '',
        uploadedAt: photo.uploaded_at || photo.uploadedAt || '',
        walletAddress: photo.wallet_address || photo.walletAddress || '',
        caption: photo.caption || '',
      }));
    } catch (error) {
      console.error('Error getting all gallery photos:', error);
      throw error;
    }
  },

  async getGalleryPhotosByWallet(walletAddress: string): Promise<GalleryPhoto[]> {
    try {
      console.log('Getting gallery photos for wallet:', walletAddress);
      const response = await fetch(`${API_BASE_URL}/f1meme/gallery/wallet/${walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get gallery photos by wallet error response:', errorText);
        throw new Error(`Get gallery photos by wallet failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gallery photos by wallet data:', data);

      return (data.photos || []).map((photo: any) => ({
        id: photo.id,
        url: photo.url || '',
        uploadedBy: photo.uploaded_by || photo.uploadedBy || '',
        uploadedAt: photo.uploaded_at || photo.uploadedAt || '',
        walletAddress: photo.wallet_address || photo.walletAddress || '',
        caption: photo.caption || '',
      }));
    } catch (error) {
      console.error('Error getting gallery photos by wallet:', error);
      throw error;
    }
  },

  async deleteGalleryPhoto(id: string): Promise<void> {
    try {
      console.log('Deleting gallery photo:', id);
      const response = await fetch(`${API_BASE_URL}/f1meme/gallery/${id}`, {
        method: 'DELETE',
    headers: {
          'Content-Type': 'application/json'
        }
      });

  if (!response.ok) {
    const errorText = await response.text();
        console.error('Delete gallery photo error response:', errorText);
        throw new Error(`Delete gallery photo failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      console.log('Gallery photo deleted successfully');
    } catch (error) {
      console.error('Error deleting gallery photo:', error);
      throw error;
    }
  }
};

// Save F1 schedule entry
export async function saveF1ScheduleEntry(entry: {
  raceName: string;
  date: string;
  time: string;
  circuit: string;
}): Promise<void> {
  const payload = {
    raceName: entry.raceName,
    date: entry.date,
    time: entry.time,
    circuit: entry.circuit,
  };

  const response = await fetch(`${API_BASE_URL}/f1meme/f1-schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Save F1 schedule failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
}

// Get all F1 schedule entries
export async function getAllF1ScheduleEntries(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/f1meme/f1-schedule/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Get F1 schedule failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.schedule || [];
}

// Delete F1 schedule entry
export async function deleteF1ScheduleEntry(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/f1meme/f1-schedule/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Delete F1 schedule failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
}

// Save a race winner to the 'Winners' table
export async function saveRaceWinner(entry: {
  driverNumber: number;
  fullName: string;
  teamName?: string;
  teamColor?: string;
  raceName: string;
  raceDate: string;
}): Promise<void> {
  const payload = {
    driverNumber: entry.driverNumber,
    fullName: entry.fullName,
    teamName: entry.teamName || '',
    teamColor: entry.teamColor || '',
    raceName: entry.raceName,
    raceDate: entry.raceDate,
  };

  const response = await fetch(`${API_BASE_URL}/f1meme/winners/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Save race winner failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
}

// Save top 3 race winners to the 'Winners' table
export interface WinnerEntry {
  position: number;
  driverNumber: number;
  fullName: string;
  teamName?: string;
  teamColor?: string;
  raceName: string;
  raceDate: string;
}

// Normalize race key for deduplication (race name + race date + driver name + position)
export function normalizeRaceKey(raceName: string, raceDate: string, driverName: string, position: number): string {
  return `${raceName.trim().toLowerCase()}|${new Date(raceDate).toISOString().slice(0, 10)}|${driverName.trim().toLowerCase()}|${position}`;
}

// Save multiple race winners
export async function saveRaceWinners(entries: WinnerEntry[]): Promise<void> {
  const payload = entries.map(entry => ({
    position: entry.position,
    driverNumber: entry.driverNumber,
    fullName: entry.fullName || '',
    teamName: entry.teamName || '',
    teamColor: entry.teamColor || '',
    raceName: entry.raceName,
    raceDate: entry.raceDate,
  }));

  const response = await fetch(`${API_BASE_URL}/f1meme/winners/save-multiple`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ winners: payload }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Save race winners failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
}

// Get all winners
export async function getAllWinners(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/f1meme/winners/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Get winners failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.winners || [];
}

// Get winners by race
export async function getWinnersByRace(raceName: string, raceDate: string): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/f1meme/winners/by-race?raceName=${encodeURIComponent(raceName)}&raceDate=${encodeURIComponent(raceDate)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Get winners by race failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.winners || [];
}

// Check if any winner for this race/driver/position exists
export async function winnersExistForRace(raceName: string, raceDate: string, fullName: string, position: number): Promise<boolean> {
  const params = new URLSearchParams({
    raceName: raceName,
    raceDate: raceDate,
    fullName: fullName,
    position: position.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/f1meme/winners/exists?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Check winners exists failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.exists || false;
}