import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { airtableService, type ProfileData } from '../api/airtable';
import { useTranslation } from '../i18n/TranslationContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Search, Filter, Download, Users, Crown, Shield } from 'lucide-react';

const ADMIN_WALLET_ADDRESS = "G14s2hZVZQqcUfLYSEdTThNqgZCi4pqM2P2RmRiu2ddz";

interface AdminUserData extends ProfileData {
  id?: string;
}

export const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const { publicKey } = useWallet();
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNonZeroOnly, setShowNonZeroOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if current user is admin
  const isAdmin = publicKey?.toBase58() === ADMIN_WALLET_ADDRESS;

  useEffect(() => {
    if (!isAdmin) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allProfiles = await airtableService.getAllProfiles();
        console.log('Raw profiles from API:', allProfiles);
        console.log('First profile sample:', allProfiles[0]);
        setUsers(allProfiles);
        setFilteredUsers(allProfiles);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  // Filter users based on search term and membership level
  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.instagramUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.tiktokUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.tgUrl.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by membership level
    if (showNonZeroOnly) {
      filtered = filtered.filter(user => user.membershipLevel && user.membershipLevel > 0);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, showNonZeroOnly]);

  const exportToCSV = () => {
    const headers = [
      'Wallet Address',
      'Name',
      'Email',
      'Instagram URL',
      'TikTok URL',
      'Telegram URL',
      'Membership Level',
      'Created At',
      'Updated At'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.walletAddress,
        `"${user.name || ''}"`,
        `"${user.email || ''}"`,
        `"${user.instagramUrl || ''}"`,
        `"${user.tiktokUrl || ''}"`,
        `"${user.tgUrl || ''}"`,
        user.membershipLevel || 0,
        `"${user.createdAt || ''}"`,
        `"${user.updatedAt || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `f1meme-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/80 border-red-500/20 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">{t.admin.accessDenied}</h2>
            <p className="text-slate-400 mb-6">
              {t.admin.noPermission}
            </p>
            <Button 
              onClick={() => window.history.back()}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {t.admin.goBack}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FBEB04] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">{t.admin.loadingUsers}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/80 border-red-500/20 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{t.admin.error}</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {t.admin.retry}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent"></div>
        <div className="relative px-4 py-16 text-center">
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-[#FBEB04]" />
              <h1 className="text-4xl md:text-5xl font-black text-[#FBEB04] tracking-tight">
                {t.admin.title}
              </h1>
            </div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              {t.admin.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 pb-8 mt-6"> 
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-900/80 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{users.length}</p>
                    <p className="text-slate-400">{t.admin.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/80 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8 text-[#FBEB04]" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {users.filter(u => u.membershipLevel && u.membershipLevel > 0).length}
                    </p>
                    <p className="text-slate-400">{t.admin.premiumMembers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/80 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Filter className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{filteredUsers.length}</p>
                    <p className="text-slate-400">{t.admin.filteredResults}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-slate-900/80 border-white/10 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t.admin.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#FBEB04]"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={showNonZeroOnly}
                      onChange={(e) => setShowNonZeroOnly(e.target.checked)}
                      className="w-4 h-4 text-[#FBEB04] bg-slate-800 border-slate-600 rounded focus:ring-[#FBEB04]"
                    />
                    {t.admin.premiumOnly}
                  </label>
                  <Button
                    onClick={exportToCSV}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t.admin.exportCSV}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-slate-900/80 border-white/10">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">{t.admin.walletAddress}</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">{t.admin.name}</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">{t.admin.email}</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">{t.admin.socialLinks}</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">{t.admin.membership}</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">{t.admin.created}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.walletAddress} className={`border-t border-slate-700/50 ${index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/10'}`}>
                        <td className="px-6 py-4">
                          <div className="font-mono text-sm text-slate-300">
                            {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-8)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">
                            {user.name || 'N/A'}
                          </div>
                          {/* Debug: Show all available fields */}
                          {index === 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Debug: {JSON.stringify(Object.keys(user))}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-300">
                            {user.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {user.instagramUrl && (
                              <a href={user.instagramUrl} target="_blank" rel="noopener noreferrer" 
                                 className="text-blue-400 hover:text-blue-300 text-sm">
                                Instagram
                              </a>
                            )}
                            {user.tiktokUrl && (
                              <a href={user.tiktokUrl} target="_blank" rel="noopener noreferrer" 
                                 className="text-pink-400 hover:text-pink-300 text-sm">
                                TikTok
                              </a>
                            )}
                            {user.tgUrl && (
                              <a href={user.tgUrl} target="_blank" rel="noopener noreferrer" 
                                 className="text-blue-500 hover:text-blue-400 text-sm">
                                Telegram
                              </a>
                            )}
                            {!user.instagramUrl && !user.tiktokUrl && !user.tgUrl && (
                              <span className="text-slate-500 text-sm">{t.admin.noSocialLinks}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.membershipLevel && user.membershipLevel > 0 
                                ? 'bg-[#FBEB04]/20 text-[#FBEB04]' 
                                : 'bg-slate-600 text-slate-300'
                            }`}>
                              {t.admin.level} {user.membershipLevel || 0}
                            </span>
                            {user.membershipLevel && user.membershipLevel > 0 && (
                              <Crown className="w-4 h-4 text-[#FBEB04]" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-400 text-sm">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                          {/* Debug: Show created date fields */}
                          {index === 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Created: {user.createdAt || 'undefined'}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">{t.admin.noUsersFound}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
