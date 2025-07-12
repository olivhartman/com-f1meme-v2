import React, { useEffect, useState } from "react";
import { airtableService, ProfileData } from "../api/airtable";
import { Instagram, Music, Globe, Flag } from "lucide-react";

const AnimatedBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Animated gradient blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-yellow-500 via-amber-400 to-yellow-600 rounded-full blur-3xl opacity-20 animate-pulse-slow" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 rounded-full blur-2xl opacity-15 animate-pulse-slower" />
    {/* Subtle checkered flag pattern overlay */}
    <div className="absolute inset-0 bg-[url('/assets/images/banner1.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay" />
  </div>
);

const Community: React.FC = () => {
  const [members, setMembers] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const all = await airtableService.getAllProfiles();
        setMembers(all);
      } catch (error) {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center py-12 px-4 sm:px-8 overflow-x-hidden">
      <AnimatedBackground />
      <h1 className="text-4xl font-bold text-yellow-400 mb-2 text-center drop-shadow-lg tracking-tight">F1Meme Community Members</h1>
      <h2 className="text-lg text-gray-300 mb-2 text-center font-medium max-w-2xl">Meet the legends of the F1Meme community.</h2>
      <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 rounded-full mb-10 opacity-70" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full max-w-7xl">
        {loading ? (
          <div className="col-span-full text-center text-yellow-400 animate-pulse text-xl font-semibold">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <Flag className="h-16 w-16 text-yellow-400 mb-4 animate-bounce" />
            <div className="text-2xl font-bold text-gray-200 mb-2">No members yet!</div>
            <div className="text-gray-400 text-lg">Be the first to join the F1Meme community.</div>
          </div>
        ) : (
          members.map((member, idx) => (
            <div
              key={idx}
              className="relative bg-black/60 backdrop-blur-2xl border border-yellow-500/30 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 min-h-[340px] transition-all duration-300 hover:scale-105 hover:shadow-yellow-400/20 hover:border-yellow-400/60 group overflow-hidden"
            >
              {/* F1 badge overlay */}
              {/* <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-2 py-1 bg-yellow-400/90 text-black text-xs font-bold rounded-full shadow group-hover:scale-110 transition-transform">
                  <Flag className="h-4 w-4 mr-1" /> F1MEME
                </span>
              </div> */}
              {/* Shine effect on hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -top-1/4 -left-1/4 w-2/3 h-2/3 bg-yellow-400/20 rounded-full blur-2xl animate-shine" />
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-lg overflow-hidden mb-4 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500 group-hover:ring-4 group-hover:ring-yellow-400/40 transition-all">
                {member.profilePictureUrl ? (
                  <img src={member.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black text-3xl font-bold">?</div>
                )}
              </div>
              <div className="flex gap-4 justify-center mb-4">
                {member.instagramUrl && (
                  <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors text-gray-300"><Instagram className="h-5 w-5" /></a>
                )}
                {member.tiktokUrl && (
                  <a href={member.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-gray-300"><Music className="h-5 w-5" /></a>
                )}
                {member.vkUrl && (
                  <a href={member.vkUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors text-gray-300"><Globe className="h-5 w-5" /></a>
                )}
              </div>
              <div className="text-xl font-bold text-yellow-400 text-center truncate w-full drop-shadow-sm">
                {member.name || "Unnamed"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community; 