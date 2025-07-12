import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_TOKEN // or REACT_APP_AIRTABLE_TOKEN if you used that
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID || '');

export interface ProfileData {
  name: string;
  instagramUrl: string;
  tiktokUrl: string;
  vkUrl: string;
  profilePicture?: File;
  coverPicture?: File;
  walletAddress: string;
}

export const airtableService = {
  // Create or update profile
  async upsertProfile(profileData: ProfileData): Promise<void> {
    try {
      // Prepare fields object
      const fields: any = {
        'Name': profileData.name,
        'Instagram URL': profileData.instagramUrl,
        'TikTok URL': profileData.tiktokUrl,
        'VK URL': profileData.vkUrl,
        'Wallet Address': profileData.walletAddress,
        'Updated At': new Date().toISOString()
      };

      // Handle profile picture attachment
      if (profileData.profilePicture) {
        fields['Profile Picture'] = [{
          url: await this.uploadImage(profileData.profilePicture),
          filename: profileData.profilePicture.name
        }];
      }

      // Handle cover picture attachment
      if (profileData.coverPicture) {
        fields['Cover Picture'] = [{
          url: await this.uploadImage(profileData.coverPicture),
          filename: profileData.coverPicture.name
        }];
      }

      // First, try to find existing record
      const existingRecords = await base('Profiles').select({
        filterByFormula: `{Wallet Address} = '${profileData.walletAddress}'`
      }).firstPage();

      if (existingRecords.length > 0) {
        // Update existing record
        await base('Profiles').update([
          {
            id: existingRecords[0].id,
            fields: fields
          }
        ]);
      } else {
        // Add Created At for new records
        fields['Created At'] = new Date().toISOString();
        
        // Create new record
        await base('Profiles').create([
          {
            fields: fields
          }
        ]);
      }
    } catch (error) {
      console.error('Error upserting profile:', error);
      throw error;
    }
  },

  // Get profile by wallet address
  async getProfile(walletAddress: string): Promise<ProfileData | null> {
    try {
      const records = await base('Profiles').select({
        filterByFormula: `{Wallet Address} = '${walletAddress}'`
      }).firstPage();

      if (records.length === 0) {
        return null;
      }

      const record = records[0];
      return {
        name: record.get('Name') as string || '',
        instagramUrl: record.get('Instagram URL') as string || '',
        tiktokUrl: record.get('TikTok URL') as string || '',
        vkUrl: record.get('VK URL') as string || '',
        profilePicture: undefined, // We don't load existing images back as Files
        coverPicture: undefined,   // We don't load existing images back as Files
        walletAddress: record.get('Wallet Address') as string || ''
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  // Upload image to a temporary URL service (for Airtable attachments)
  async uploadImage(file: File): Promise<string> {
    try {
      // For Airtable attachments, we need to upload to a publicly accessible URL
      // You can use services like:
      // - ImgBB API
      // - Cloudinary
      // - AWS S3
      // - Or any image hosting service
      
      // For now, we'll use a simple approach with a data URL
      // In production, you should use a proper image hosting service
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      return base64;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}; 