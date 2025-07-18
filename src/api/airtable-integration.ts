// Airtable integration module for F1Meme app
// All Airtable-related logic is centralized here for easy import and optional use

import { type PublicKey } from "@solana/web3.js";

// Define the ProfileData type for Airtable
export interface AirtableProfileData {
  name: string;
  email: string;
  instagramUrl: string;
  tiktokUrl: string;
  vkUrl: string;
  profilePictureUrl?: string;
  coverPictureUrl?: string;
  walletAddress: string;
  membershipLevel?: number;
}

// Example: Upsert a profile to Airtable
export async function upsertProfileToAirtable(profile: AirtableProfileData): Promise<void> {
  // Replace with your actual Airtable API endpoint and key
  const AIRTABLE_API_URL = import.meta.env.VITE_AIRTABLE_API_URL || "";
  const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_PAT || "";
  const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || "";
  const AIRTABLE_PROFILE_TABLE = "Profile";

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) throw new Error("Airtable credentials missing");

  // Prepare the request
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PROFILE_TABLE}`;
  const headers = {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({
    records: [
      {
        fields: {
          Name: profile.name,
          Email: profile.email,
          "Instagram URL": profile.instagramUrl,
          "Tiktok URL": profile.tiktokUrl,
          "VK URL": profile.vkUrl,
          "Wallet Address": profile.walletAddress,
          "Profile Picture": profile.profilePictureUrl ? [{ url: profile.profilePictureUrl }] : undefined,
          "Cover Picture": profile.coverPictureUrl ? [{ url: profile.coverPictureUrl }] : undefined,
          "Membership Level": profile.membershipLevel?.toString() ?? "0",
        },
      },
    ],
  });

  const res = await fetch(url, {
    method: "POST",
    headers,
    body,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Airtable upsert failed: ${error}`);
  }
}

// Example: Get a profile from Airtable by wallet address
export async function getProfileFromAirtable(walletAddress: string): Promise<AirtableProfileData | null> {
  const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_PAT || "";
  const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || "";
  const AIRTABLE_PROFILE_TABLE = "Profile";
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) throw new Error("Airtable credentials missing");
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PROFILE_TABLE}?filterByFormula={Wallet Address}='${walletAddress}'`;
  const headers = {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  };
  const res = await fetch(url, { headers });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.records || !data.records.length) return null;
  const fields = data.records[0].fields;
  return {
    name: fields["Name"] || "",
    email: fields["Email"] || "",
    instagramUrl: fields["Instagram URL"] || "",
    tiktokUrl: fields["Tiktok URL"] || "",
    vkUrl: fields["VK URL"] || "",
    profilePictureUrl: fields["Profile Picture"]?.[0]?.url || undefined,
    coverPictureUrl: fields["Cover Picture"]?.[0]?.url || undefined,
    walletAddress: fields["Wallet Address"] || walletAddress,
    membershipLevel: Number(fields["Membership Level"] || 0),
  };
}

// Example: Sync membership level to Airtable
export async function syncMembershipLevelToAirtable(walletAddress: string, membershipLevel: number) {
  const profile = await getProfileFromAirtable(walletAddress);
  if (profile) {
    await upsertProfileToAirtable({ ...profile, membershipLevel });
  } else {
    await upsertProfileToAirtable({
      name: "",
      email: "",
      instagramUrl: "",
      tiktokUrl: "",
      vkUrl: "",
      walletAddress,
      membershipLevel,
    });
  }
}

// You can add more functions for schedule, winners, etc. as needed. 