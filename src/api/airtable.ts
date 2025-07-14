import { cloudinaryService } from './cloudinary';

// Airtable REST API service using Personal Access Tokens
const API_TOKEN = import.meta.env.VITE_AIRTABLE_PAT;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${BASE_ID}`;

// Table and field names - update these to match your Airtable structure
const TABLE_NAME = 'Profile';
const FIELD_NAMES = {
  NAME: 'Name',
  EMAIL: 'Email',
  INSTAGRAM_URL: 'Instagram URL',
  TIKTOK_URL: 'Tiktok URL', // Update this to match your actual field name
  VK_URL: 'VK URL', // Update this to match your actual field name
  WALLET_ADDRESS: 'Wallet Address',
  PROFILE_PICTURE: 'Profile Picture',
  COVER_PICTURE: 'Cover Picture',
  CREATED_AT: 'Created At',
  UPDATED_AT: 'Updated At'
};

export interface ProfileData {
  name: string;
  email: string;
  instagramUrl: string;
  tiktokUrl: string;
  vkUrl: string;
  profilePicture?: File;
  coverPicture?: File;
  walletAddress: string;
  profilePictureUrl?: string;
  coverPictureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const airtableService = {
  // Get all fields from the Profile table
  async getTableFields(): Promise<void> {
    try {
      console.log('Getting table fields...');
      // Explicitly request all fields including Created At and Updated At
      const response = await fetch(`${AIRTABLE_API_URL}/${TABLE_NAME}?maxRecords=1&fields[]=${FIELD_NAMES.CREATED_AT}&fields[]=${FIELD_NAMES.UPDATED_AT}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get table fields error response:', errorText);
        throw new Error(`Get table fields failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Table structure:', data);
      
      if (data.records && data.records.length > 0) {
        const firstRecord = data.records[0];
        console.log('Available fields:', Object.keys(firstRecord.fields));
        console.log('Field values:', firstRecord.fields);
        console.log('Created At:', firstRecord.fields[FIELD_NAMES.CREATED_AT]);
        console.log('Updated At:', firstRecord.fields[FIELD_NAMES.UPDATED_AT]);
      } else {
        console.log('No records found in table');
      }
    } catch (error) {
      console.error('Error getting table fields:', error);
      throw error;
    }
  },

  // Create or update profile
  async upsertProfile(profileData: ProfileData): Promise<void> {
    try {
      console.log('Starting upsertProfile with wallet:', profileData.walletAddress);
      console.log('API Token available:', !!API_TOKEN);
      console.log('Base ID available:', !!BASE_ID);
      
      if (!API_TOKEN) {
        throw new Error('Airtable Personal Access Token is not configured');
      }
      
      if (!BASE_ID) {
        throw new Error('Airtable Base ID is not configured');
      }
      
      // Prepare fields object - only include fields that exist in your table
      const fields: any = {
        [FIELD_NAMES.NAME]: profileData.name,
        [FIELD_NAMES.EMAIL]: profileData.email,
        [FIELD_NAMES.INSTAGRAM_URL]: profileData.instagramUrl,
        [FIELD_NAMES.WALLET_ADDRESS]: profileData.walletAddress,
        [FIELD_NAMES.UPDATED_AT]: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) + ' at ' + new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      };

      // Only add TikTok and VK URLs if the fields exist in your table
      if (profileData.tiktokUrl) {
        fields[FIELD_NAMES.TIKTOK_URL] = profileData.tiktokUrl;
      }
      
      if (profileData.vkUrl) {
        fields[FIELD_NAMES.VK_URL] = profileData.vkUrl;
      }

      // Handle profile picture attachment
      if (profileData.profilePicture) {
        console.log('Processing profile picture:', profileData.profilePicture.name);
        try {
          const imageUrl = await cloudinaryService.uploadImage(profileData.profilePicture);
          fields[FIELD_NAMES.PROFILE_PICTURE] = [{
            url: imageUrl,
            filename: profileData.profilePicture.name
          }];
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
          fields[FIELD_NAMES.COVER_PICTURE] = [{
            url: imageUrl,
            filename: profileData.coverPicture.name
          }];
          console.log('Cover picture uploaded successfully');
        } catch (error) {
          console.error('Failed to upload cover picture:', error);
          // Continue without the image if upload fails
        }
      }

      console.log('Prepared fields:', fields);

      // First, try to find existing record
      console.log('Searching for existing record...');
      const searchUrl = `${AIRTABLE_API_URL}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(`{${FIELD_NAMES.WALLET_ADDRESS}} = '${profileData.walletAddress}'`)}`;
      console.log('Search URL:', searchUrl);
      
      const searchResponse = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Search response status:', searchResponse.status);
      console.log('Search response headers:', Object.fromEntries(searchResponse.headers.entries()));

      if (!searchResponse.ok) {
        const errorText = await searchResponse.text();
        console.error('Search error response:', errorText);
        throw new Error(`Search failed: ${searchResponse.status} ${searchResponse.statusText} - ${errorText}`);
      }

      const searchData = await searchResponse.json();
      console.log('Found existing records:', searchData.records?.length || 0);

      if (searchData.records && searchData.records.length > 0) {
        // Update existing record
        console.log('Updating existing record with ID:', searchData.records[0].id);
        const updateResponse = await fetch(`${AIRTABLE_API_URL}/${TABLE_NAME}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            records: [{
              id: searchData.records[0].id,
              fields: fields
            }]
          })
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.text();
          console.error('Update error response:', errorData);
          throw new Error(`Update failed: ${updateResponse.status} ${updateResponse.statusText} - ${errorData}`);
        }

        console.log('Record updated successfully');
      } else {
        // Add Created At for new records
        fields[FIELD_NAMES.CREATED_AT] = new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) + ' at ' + new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        // Create new record
        console.log('Creating new record...');
        const createResponse = await fetch(`${AIRTABLE_API_URL}/${TABLE_NAME}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            records: [{
              fields: fields
            }]
          })
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.text();
          console.error('Create error response:', errorData);
          throw new Error(`Create failed: ${createResponse.status} ${createResponse.statusText} - ${errorData}`);
        }

        console.log('Record created successfully');
      }
    } catch (error) {
      console.error('Error upserting profile:', error);
      console.error('Error details:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error
      });
      throw error;
    }
  },

  // Get profile by wallet address
  async getProfile(walletAddress: string): Promise<ProfileData | null> {
    try {
      console.log('Getting profile for wallet:', walletAddress);
      const response = await fetch(`${AIRTABLE_API_URL}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(`{${FIELD_NAMES.WALLET_ADDRESS}} = '${walletAddress}'`)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get profile error response:', errorText);
        throw new Error(`Get profile failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Found records:', data.records?.length || 0);

      if (!data.records || data.records.length === 0) {
        return null;
      }

      const record = data.records[0];
      return {
        name: record.fields[FIELD_NAMES.NAME] || '',
        email: record.fields[FIELD_NAMES.EMAIL] || '',
        instagramUrl: record.fields[FIELD_NAMES.INSTAGRAM_URL] || '',
        tiktokUrl: record.fields[FIELD_NAMES.TIKTOK_URL] || '',
        vkUrl: record.fields[FIELD_NAMES.VK_URL] || '',
        profilePicture: undefined, // We don't load existing images back as Files
        coverPicture: undefined,   // We don't load existing images back as Files
        walletAddress: record.fields[FIELD_NAMES.WALLET_ADDRESS] || '',
        createdAt: record.fields[FIELD_NAMES.CREATED_AT] || undefined,
        updatedAt: record.fields[FIELD_NAMES.UPDATED_AT] || undefined,
        // Add image URLs for preview
        profilePictureUrl: record.fields[FIELD_NAMES.PROFILE_PICTURE]?.[0]?.url || '',
        coverPictureUrl: record.fields[FIELD_NAMES.COVER_PICTURE]?.[0]?.url || ''
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  // Get all profiles (for community page)
  async getAllProfiles(): Promise<ProfileData[]> {
    try {
      const response = await fetch(`${AIRTABLE_API_URL}/${TABLE_NAME}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch all profiles');
      }
      const data = await response.json();
      return (data.records || []).map((record: any) => ({
        name: record.fields[FIELD_NAMES.NAME] || '',
        instagramUrl: record.fields[FIELD_NAMES.INSTAGRAM_URL] || '',
        tiktokUrl: record.fields[FIELD_NAMES.TIKTOK_URL] || '',
        vkUrl: record.fields[FIELD_NAMES.VK_URL] || '',
        profilePictureUrl: record.fields[FIELD_NAMES.PROFILE_PICTURE]?.[0]?.url || '',
        coverPictureUrl: record.fields[FIELD_NAMES.COVER_PICTURE]?.[0]?.url || '',
        walletAddress: record.fields[FIELD_NAMES.WALLET_ADDRESS] || '',
        // Do not include email
      }));
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }
  }
};

// Generic function to save a record to any Airtable table
async function saveRecordToAirtable(tableName: string, fields: Record<string, any>): Promise<void> {
  if (!API_TOKEN) throw new Error('Airtable Personal Access Token is not configured');
  if (!BASE_ID) throw new Error('Airtable Base ID is not configured');
  const response = await fetch(`${AIRTABLE_API_URL}/${tableName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ records: [{ fields }] }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable save failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
}

// Save F1 schedule entry to 'F1 Schedule' table
export async function saveF1ScheduleEntry(entry: {
  raceName: string;
  date: string;
  time: string;
  circuit: string;
}): Promise<void> {
  // Map your entry fields to Airtable field names as needed
  const fields = {
    'Race Name': entry.raceName,
    'Date': entry.date,
    'Time': entry.time,
    'Circuit': entry.circuit,
    'Created At': new Date().toISOString(),
  };
  await saveRecordToAirtable('F1 Schedule', fields);
}