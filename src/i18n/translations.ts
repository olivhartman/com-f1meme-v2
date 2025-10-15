export interface Translations {
  // Navigation
  nav: {
    home: string;
    community: string;
    gallery: string;
    schedule: string;
    profile: string;
  };
  
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    description: string;
    connectWallet: string;
    learnMore: string;
  };
  
  // Community Page
  community: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    noMembersFound: string;
    loadingMembers: string;
    memberLevel: string;
    copyAddress: string;
    addressCopied: string;
    showQR: string;
    hideQR: string;
    joinCommunity: string;
  };
  
  // Gallery Page
  gallery: {
    title: string;
    subtitle: string;
    uploadPhoto: string;
    noPhotosYet: string;
    failedToLoad: string;
    retry: string;
  };
  
  // Schedule Page
  schedule: {
    title: string;
    subtitle: string;
    loadingSchedule: string;
    raceDay: string;
    season: string;
    circuit: string;
    sessions: string;
    practice1: string;
    practice2: string;
    practice3: string;
    qualifying: string;
    sprint: string;
    race: string;
  };
  
  // Profile Page
  profile: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    instagram: string;
    tiktok: string;
    telegram: string;
    profilePicture: string;
    coverPicture: string;
    membershipLevel: string;
    saveProfile: string;
    profileSaved: string;
    profileError: string;
    uploadImage: string;
    removeImage: string;
    selectImage: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    share: string;
    copy: string;
    copied: string;
  };
  
  // Wallet
  wallet: {
    connect: string;
    disconnect: string;
    connected: string;
    connecting: string;
    walletNotConnected: string;
    connectToContinue: string;
  };
  
  // Footer
  footer: {
    description: string;
    links: string;
    social: string;
    copyright: string;
  };
  
  // Admin Panel
  admin: {
    title: string;
    subtitle: string;
    accessDenied: string;
    noPermission: string;
    goBack: string;
    loadingUsers: string;
    error: string;
    retry: string;
    totalUsers: string;
    premiumMembers: string;
    filteredResults: string;
    searchPlaceholder: string;
    premiumOnly: string;
    exportCSV: string;
    walletAddress: string;
    name: string;
    email: string;
    socialLinks: string;
    membership: string;
    created: string;
    noUsersFound: string;
    noSocialLinks: string;
    level: string;
  };
}

export const translations: Record<string, Translations> = {
  en: {
    nav: {
      home: "Home",
      community: "Community",
      gallery: "Gallery",
      schedule: "Schedule",
      profile: "Profile",
    },
    hero: {
      title: "F1Meme",
      subtitle: "Official Formula 1 betting platform powered by Solana blockchain",
      description: "Join the ultimate F1 community, place bets, and compete with fellow racing enthusiasts in the most exciting Formula 1 betting experience on the blockchain.",
      connectWallet: "Connect Wallet",
      learnMore: "Learn More",
    },
    community: {
      title: "F1Meme Community",
      subtitle: "Connect with fellow F1 enthusiasts and racing fans",
      searchPlaceholder: "Search members...",
      noMembersFound: "No members found matching your search",
      loadingMembers: "Loading community members...",
      memberLevel: "Member Level",
      copyAddress: "Copy Address",
      addressCopied: "Address copied!",
      showQR: "Show QR Code",
      hideQR: "Hide QR Code",
      joinCommunity: "Join our community of F1 enthusiasts",
    },
    gallery: {
      title: "F1Meme Gallery",
      subtitle: "Share your F1 moments and racing memories",
      uploadPhoto: "Upload Photo",
      noPhotosYet: "No photos yet. Be the first to share your F1 moments!",
      failedToLoad: "Failed to load gallery. Please try again.",
      retry: "Retry",
    },
    schedule: {
      title: "F1 Schedule",
      subtitle: "Stay updated with the latest Formula 1 race calendar",
      loadingSchedule: "Loading F1 Schedule...",
      raceDay: "Race Day",
      season: "Season",
      circuit: "Circuit",
      sessions: "Sessions",
      practice1: "Practice 1",
      practice2: "Practice 2",
      practice3: "Practice 3",
      qualifying: "Qualifying",
      sprint: "Sprint",
      race: "Race",
    },
    profile: {
      title: "Profile",
      subtitle: "Manage your F1Meme profile and preferences",
      name: "Name",
      email: "Email",
      instagram: "Instagram",
      tiktok: "TikTok",
      telegram: "Telegram",
      profilePicture: "Profile Picture",
      coverPicture: "Cover Picture",
      membershipLevel: "Membership Level",
      saveProfile: "Save Profile",
      profileSaved: "Profile saved successfully!",
      profileError: "Error saving profile. Please try again.",
      uploadImage: "Upload Image",
      removeImage: "Remove Image",
      selectImage: "Select Image",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      share: "Share",
      copy: "Copy",
      copied: "Copied",
    },
    wallet: {
      connect: "Connect Wallet",
      disconnect: "Disconnect",
      connected: "Connected",
      connecting: "Connecting...",
      walletNotConnected: "Wallet not connected",
      connectToContinue: "Connect your wallet to continue",
    },
    footer: {
      description: "Official Formula 1 betting platform powered by Solana blockchain",
      links: "Links",
      social: "Social",
      copyright: "© 2024 F1Meme. All rights reserved.",
    },
    admin: {
      title: "Admin Panel",
      subtitle: "Manage and monitor F1Meme community members",
      accessDenied: "Access Denied",
      noPermission: "You don't have permission to access the admin panel. Admin privileges required.",
      goBack: "Go Back",
      loadingUsers: "Loading user data...",
      error: "Error",
      retry: "Retry",
      totalUsers: "Total Users",
      premiumMembers: "Premium Members",
      filteredResults: "Filtered Results",
      searchPlaceholder: "Search users by name, email, wallet, or social...",
      premiumOnly: "Premium Members Only",
      exportCSV: "Export CSV",
      walletAddress: "Wallet Address",
      name: "Name",
      email: "Email",
      socialLinks: "Social Links",
      membership: "Membership",
      created: "Created",
      noUsersFound: "No users found matching your criteria",
      noSocialLinks: "No social links",
      level: "Level",
    },
  },
  zh: {
    nav: {
      home: "首页",
      community: "社区",
      gallery: "画廊",
      schedule: "赛程",
      profile: "个人资料",
    },
    hero: {
      title: "F1Meme",
      subtitle: "由Solana区块链驱动的官方F1投注平台",
      description: "加入终极F1社区，下注，与赛车爱好者一起在区块链上最激动人心的F1投注体验中竞争。",
      connectWallet: "连接钱包",
      learnMore: "了解更多",
    },
    community: {
      title: "F1Meme社区",
      subtitle: "与F1爱好者和赛车迷联系",
      searchPlaceholder: "搜索成员...",
      noMembersFound: "未找到匹配搜索的成员",
      loadingMembers: "加载社区成员...",
      memberLevel: "会员等级",
      copyAddress: "复制地址",
      addressCopied: "地址已复制！",
      showQR: "显示二维码",
      hideQR: "隐藏二维码",
      joinCommunity: "加入我们的F1爱好者社区",
    },
    gallery: {
      title: "F1Meme画廊",
      subtitle: "分享您的F1时刻和赛车回忆",
      uploadPhoto: "上传照片",
      noPhotosYet: "还没有照片。成为第一个分享F1时刻的人！",
      failedToLoad: "加载画廊失败。请重试。",
      retry: "重试",
    },
    schedule: {
      title: "F1赛程",
      subtitle: "了解最新的F1赛车日历",
      loadingSchedule: "加载F1赛程...",
      raceDay: "比赛日",
      season: "赛季",
      circuit: "赛道",
      sessions: "练习赛",
      practice1: "练习赛1",
      practice2: "练习赛2",
      practice3: "练习赛3",
      qualifying: "排位赛",
      sprint: "冲刺赛",
      race: "正赛",
    },
    profile: {
      title: "个人资料",
      subtitle: "管理您的F1Meme个人资料和偏好",
      name: "姓名",
      email: "邮箱",
      instagram: "Instagram",
      tiktok: "TikTok",
      telegram: "Telegram",
      profilePicture: "头像",
      coverPicture: "封面图片",
      membershipLevel: "会员等级",
      saveProfile: "保存资料",
      profileSaved: "资料保存成功！",
      profileError: "保存资料时出错。请重试。",
      uploadImage: "上传图片",
      removeImage: "删除图片",
      selectImage: "选择图片",
    },
    common: {
      loading: "加载中...",
      error: "错误",
      success: "成功",
      cancel: "取消",
      confirm: "确认",
      close: "关闭",
      back: "返回",
      next: "下一步",
      previous: "上一步",
      save: "保存",
      delete: "删除",
      edit: "编辑",
      view: "查看",
      share: "分享",
      copy: "复制",
      copied: "已复制",
    },
    wallet: {
      connect: "连接钱包",
      disconnect: "断开连接",
      connected: "已连接",
      connecting: "连接中...",
      walletNotConnected: "钱包未连接",
      connectToContinue: "连接您的钱包以继续",
    },
    footer: {
      description: "由Solana区块链驱动的官方F1投注平台",
      links: "链接",
      social: "社交",
      copyright: "© 2024 F1Meme。保留所有权利。",
    },
    admin: {
      title: "管理面板",
      subtitle: "管理和监控F1Meme社区成员",
      accessDenied: "访问被拒绝",
      noPermission: "您没有权限访问管理面板。需要管理员权限。",
      goBack: "返回",
      loadingUsers: "加载用户数据...",
      error: "错误",
      retry: "重试",
      totalUsers: "总用户数",
      premiumMembers: "高级会员",
      filteredResults: "筛选结果",
      searchPlaceholder: "按姓名、邮箱、钱包或社交账号搜索用户...",
      premiumOnly: "仅高级会员",
      exportCSV: "导出CSV",
      walletAddress: "钱包地址",
      name: "姓名",
      email: "邮箱",
      socialLinks: "社交链接",
      membership: "会员等级",
      created: "创建时间",
      noUsersFound: "未找到符合条件的用户",
      noSocialLinks: "无社交链接",
      level: "等级",
    },
  },
};
