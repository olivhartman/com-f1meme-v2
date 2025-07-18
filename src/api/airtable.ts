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
  TIKTOK_URL: 'Tiktok URL',
  VK_URL: 'VK URL',
  WALLET_ADDRESS: 'Wallet Address',
  PROFILE_PICTURE: 'Profile Picture',
  COVER_PICTURE: 'Cover Picture',
  CREATED_AT: 'Created At',
  UPDATED_AT: 'Updated At',
  MEMBERSHIP_LEVEL: 'Membership Level',
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
  membershipLevel?: number;
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
        console.log('Membership Level field exists:', FIELD_NAMES.MEMBERSHIP_LEVEL in firstRecord.fields);
      } else {
        console.log('No records found in table');
      }
    } catch (error) {
      console.error('Error getting table fields:', error);
      throw error;
    }
  },

  // Check if a specific field exists in the table
  async checkFieldExists(fieldName: string): Promise<boolean> {
    try {
      const response = await fetch(`${AIRTABLE_API_URL}/${TABLE_NAME}?maxRecords=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      if (data.records && data.records.length > 0) {
        const firstRecord = data.records[0];
        return fieldName in firstRecord.fields;
      }
      return false;
    } catch (error) {
      console.error('Error checking field existence:', error);
      return false;
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
        }),
      };

      // Only add fields that have actual values (not empty strings)
      if (profileData.name && profileData.name.trim()) {
        fields[FIELD_NAMES.NAME] = profileData.name;
      }
      
      if (profileData.email && profileData.email.trim()) {
        fields[FIELD_NAMES.EMAIL] = profileData.email;
      }
      
      if (profileData.instagramUrl && profileData.instagramUrl.trim()) {
        fields[FIELD_NAMES.INSTAGRAM_URL] = profileData.instagramUrl;
      }

      // Handle membership level with validation
      if (typeof profileData.membershipLevel === 'number') {
        const levelValue = Math.max(0, Math.min(profileData.membershipLevel, 999)); // Ensure it's a valid positive number
        console.log('Original membership level:', profileData.membershipLevel);
        console.log('Validated membership level:', levelValue);
        console.log('Type of levelValue:', typeof levelValue);
        
        // Convert to string since Airtable field is Single Line Text
        fields[FIELD_NAMES.MEMBERSHIP_LEVEL] = String(levelValue);
        console.log('Setting membership level to:', String(levelValue), 'Type:', typeof String(levelValue));
      } else {
        console.log('No valid membership level provided, skipping field');
      }

      // Only add TikTok and VK URLs if the fields exist in your table and have values
      if (profileData.tiktokUrl && profileData.tiktokUrl.trim()) {
        fields[FIELD_NAMES.TIKTOK_URL] = profileData.tiktokUrl;
      }
      
      if (profileData.vkUrl && profileData.vkUrl.trim()) {
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
          
          // Handle specific field validation errors
          if (createResponse.status === 422) {
            try {
              const errorJson = JSON.parse(errorData);
              if (errorJson.error?.type === 'INVALID_VALUE_FOR_COLUMN') {
                console.error('Field validation error:', errorJson.error.message);
                
                // Try without the problematic field
                delete fields[FIELD_NAMES.MEMBERSHIP_LEVEL];
                console.log('Retrying without membership level field...');
                
                const retryResponse = await fetch(`${AIRTABLE_API_URL}/${TABLE_NAME}`, {
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
                
                if (!retryResponse.ok) {
                  const retryErrorData = await retryResponse.text();
                  throw new Error(`Create failed (retry): ${retryResponse.status} ${retryResponse.statusText} - ${retryErrorData}`);
                }
                
                console.log('Record created successfully (without membership level)');
                return;
              }
            } catch (parseError) {
              console.error('Failed to parse error response:', parseError);
            }
          }
          
          throw new Error(`Create failed: ${createResponse.status} ${createResponse.statusText} - ${errorData}`);
        }

        console.log('Record created successfully');
      }
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
      
      // Handle membership level as string (since it's stored as Single Line Text)
      let membershipLevel = 0;
      if (record.fields[FIELD_NAMES.MEMBERSHIP_LEVEL]) {
        const levelStr = String(record.fields[FIELD_NAMES.MEMBERSHIP_LEVEL]);
        const levelNum = parseInt(levelStr, 10);
        membershipLevel = isNaN(levelNum) ? 0 : levelNum;
      }
      
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
        profilePictureUrl: record.fields[FIELD_NAMES.PROFILE_PICTURE]?.[0]?.url || '',
        coverPictureUrl: record.fields[FIELD_NAMES.COVER_PICTURE]?.[0]?.url || '',
        membershipLevel: membershipLevel,
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
      return (data.records || []).map((record: any) => {
        // Handle membership level as string (since it's stored as Single Line Text)
        let membershipLevel = 0;
        if (record.fields[FIELD_NAMES.MEMBERSHIP_LEVEL]) {
          const levelStr = String(record.fields[FIELD_NAMES.MEMBERSHIP_LEVEL]);
          const levelNum = parseInt(levelStr, 10);
          membershipLevel = isNaN(levelNum) ? 0 : levelNum;
        }
        
        return {
          name: record.fields[FIELD_NAMES.NAME] || '',
          instagramUrl: record.fields[FIELD_NAMES.INSTAGRAM_URL] || '',
          tiktokUrl: record.fields[FIELD_NAMES.TIKTOK_URL] || '',
          vkUrl: record.fields[FIELD_NAMES.VK_URL] || '',
          profilePictureUrl: record.fields[FIELD_NAMES.PROFILE_PICTURE]?.[0]?.url || '',
          coverPictureUrl: record.fields[FIELD_NAMES.COVER_PICTURE]?.[0]?.url || '',
          walletAddress: record.fields[FIELD_NAMES.WALLET_ADDRESS] || '',
          membershipLevel: membershipLevel,
          // Do not include email
        };
      });
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }
  }
};

// Always send an array of records, and all fields as strings
async function saveRecordToAirtable(tableName: string, fields: Record<string, unknown> | Record<string, unknown>[]): Promise<void> {
  if (!API_TOKEN) throw new Error('Airtable Personal Access Token is not configured');
  if (!BASE_ID) throw new Error('Airtable Base ID is not configured');
  const recordsArray = Array.isArray(fields)
    ? fields
    : [fields];
  // Convert all field values to strings
  recordsArray.forEach(record => {
    Object.keys(record.fields).forEach(key => {
      if (typeof record.fields[key] !== 'string') {
        record.fields[key] = record.fields[key]?.toString?.() ?? '';
      }
    });
  });
  const response = await fetch(`${AIRTABLE_API_URL}/${tableName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ records: recordsArray }),
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

// Save a race winner to the 'Winners' table
export async function saveRaceWinner(entry: {
  driverNumber: number;
  fullName: string;
  teamName?: string;
  teamColor?: string;
  raceName: string;
  raceDate: string;
}): Promise<void> {
  const fields = {
    'Driver Number': entry.driverNumber,
    'Full Name': entry.fullName,
    'Team Name': entry.teamName || '',
    'Team Color': entry.teamColor || '',
    'Race Name': entry.raceName,
    'Race Date': entry.raceDate,
    'Created At': new Date().toISOString(),
  };
  await saveRecordToAirtable('Winners', fields);
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

// All fields are sent as strings to match Airtable 'single line text' fields
export async function saveRaceWinners(entries: WinnerEntry[]): Promise<void> {
  const records = entries.map(entry => ({
    fields: {
      'Driver Number': entry.driverNumber.toString(),
      'Position': entry.position.toString(),
      'Full Name': entry.fullName || '',
      'Team Name': entry.teamName || '',
      'Team Color': entry.teamColor || '',
      'Race Name': entry.raceName,
      'Race Date': entry.raceDate,
      'Created At': new Date().toISOString(),
    }
  }));
  await saveRecordToAirtable('Winners', records);
}