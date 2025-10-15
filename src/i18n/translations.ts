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
  
  // Additional translations for missing texts
  additional: {
    // Community page
    communityMember: string;
    noMembersLevel: string;
    noMembersLevelDesc: string;
    copyAddress: string;
    showQrCode: string;
    hideQrCode: string;
    copied: string;
    noWallet: string;
    f1Enthusiast: string;
    failedToGenerateQr: string;
    generatingQrCode: string;
    // Schedule page
    f1Schedule: string;
    f1ScheduleDesc: string;
    loadingF1Schedule: string;
    fetchingRaceInfo: string;
    season: string;
    raceDay: string;
    sessions: string;
    fp1: string;
    fp2: string;
    fp3: string;
    qualifying: string;
    sprint: string;
    sprintQualifying: string;
    // Gallery page
    f1memeGallery: string;
    f1memeGalleryDesc: string;
    failedToLoadGallery: string;
    noPhotosYet: string;
    noPhotosYetDesc: string;
    loadingGallery: string;
    noPhotosUpload: string;
    viewMore: string;
    share: string;
    download: string;
    // Home page
    boxboxWeb3Membership: string;
    boxboxWeb3MembershipDesc: string;
    miniGallery: string;
    loadingGalleryHome: string;
    noPhotosYetHome: string;
    // Profile page
    addCoverPhoto: string;
    clickOrDragToUpload: string;
    addPhoto: string;
    yourName: string;
    saveProfile: string;
    profileInfo: string;
    personalInfo: string;
    name: string;
    email: string;
    socialLinks: string;
    instagramUrl: string;
    tiktokUrl: string;
    telegramUrl: string;
    galleryUpload: string;
    uploadPhoto: string;
    dragOrClick: string;
    nameRequired: string;
    nameMinLength: string;
    nameMaxLength: string;
    emailRequired: string;
    validEmail: string;
    validInstagramUrl: string;
    validTiktokUrl: string;
    validTelegramUrl: string;
    validUrl: string;
    imageFileRequired: string;
    fillRequiredFields: string;
    profileUpdatedSuccess: string;
    errorUpdatingProfile: string;
    photoUploadedSuccess: string;
    errorUploadingPhoto: string;
    walletNotConnected: string;
    // Hero section
    latestRaceResults: string;
    currentRace: string;
    nextRace: string;
    raceDate: string;
    // Countdown
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    // BoxBox Interface
    totalBoxboxLocked: string;
    connectWalletToView: string;
    boxboxPremium: string;
    membershipLevel: string;
    membershipAccount: string;
    yetToBeCreated: string;
    created: string;
    tokenBalance: string;
    vault: string;
    vaultTooltip: string;
    amountToLock: string;
    lockTokens: string;
    processing: string;
    activeLocks: string;
    noActiveLocks: string;
    lockedAmount: string;
    releaseDate: string;
    unlockTokens: string;
    unlocking: string;
    locked: string;
    keepSolForGas: string;
    unlockedTokens: string;
    noUnlockedTokens: string;
    unlockedAmount: string;
    unlockedDate: string;
    connectWalletToLock: string;
    openWithPhantom: string;
    firstConnectionInfo: string;
    // Tokenomics
    tokenomics: string;
    tokenomicsDesc: string;
    tokenDetails: string;
    address: string;
    totalSupply: string;
    nameSymbol: string;
    tokenPrice: string;
    volume24h: string;
    liquidity: string;
    marketCap: string;
    change24h: string;
    trades24h: string;
    liquidityInfo: string;
    // FAQs
    faq: string;
    faqDesc: string;
    stillHaveQuestions: string;
    joinCommunity: string;
    twitter: string;
    telegram: string;
    youtube: string;
    // Footer
    poweredBy: string;
    allRightsReserved: string;
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
    additional: {
      // Community page
      communityMember: "Community Member",
      noMembersLevel: "No Members in Level 1-99!",
      noMembersLevelDesc: "There are currently no community members with membership levels between 1-99. Check back later or become the first premium member!",
      copyAddress: "Copy full address",
      showQrCode: "Show QR code",
      hideQrCode: "Hide QR code",
      copied: "Copied!",
      noWallet: "No Wallet",
      f1Enthusiast: "F1 Enthusiast",
      failedToGenerateQr: "Failed to generate QR",
      generatingQrCode: "Generating QR code...",
      // Schedule page
      f1Schedule: "F1 Schedule",
      f1ScheduleDesc: "Stay updated with the latest Formula 1 race schedule and session times",
      loadingF1Schedule: "Loading F1 Schedule...",
      fetchingRaceInfo: "Fetching the latest race information",
      season: "Season",
      raceDay: "Race Day",
      sessions: "Sessions",
      fp1: "FP1",
      fp2: "FP2",
      fp3: "FP3",
      qualifying: "Qualifying",
      sprint: "Sprint",
      sprintQualifying: "Sprint Qualifying",
      // Gallery page
      f1memeGallery: "F1Meme Gallery",
      f1memeGalleryDesc: "Share your F1 moments and connect with the community through photos",
      failedToLoadGallery: "Failed to Load Gallery",
      noPhotosYet: "No Photos Yet",
      noPhotosYetDesc: "The gallery is empty. Be the first to share your F1 photos with the community!",
      loadingGallery: "Loading gallery...",
      noPhotosUpload: "No photos yet. Be the first to upload!",
      viewMore: "View More",
      share: "Share",
      download: "Download",
      // Home page
      boxboxWeb3Membership: "BoxBox Web3 Membership",
      boxboxWeb3MembershipDesc: "Join the ultimate F1 community and unlock exclusive benefits",
      miniGallery: "Mini Gallery",
      loadingGalleryHome: "Loading gallery...",
      noPhotosYetHome: "No photos yet. Be the first to upload!",
      // Profile page
      addCoverPhoto: "Add Cover Photo",
      clickOrDragToUpload: "Click or drag to upload",
      addPhoto: "Add Photo",
      yourName: "Your Name",
      saveProfile: "Save Profile",
      profileInfo: "Profile Information",
      personalInfo: "Personal Information",
      name: "Name",
      email: "Email",
      socialLinks: "Social Links",
      instagramUrl: "Instagram URL",
      tiktokUrl: "TikTok URL",
      telegramUrl: "Telegram URL",
      galleryUpload: "Gallery Upload",
      uploadPhoto: "Upload Photo",
      dragOrClick: "Drag or click to upload",
      nameRequired: "Name is required (2+ chars).",
      nameMinLength: "Name must be at least 2 characters.",
      nameMaxLength: "Name must be at most 32 characters.",
      emailRequired: "Email is required.",
      validEmail: "Enter a valid email address.",
      validInstagramUrl: "Must be an Instagram URL.",
      validTiktokUrl: "Must be a TikTok URL.",
      validTelegramUrl: "Must be a Telegram URL.",
      validUrl: "Enter a valid URL.",
      imageFileRequired: "File must be an image.",
      fillRequiredFields: "Please fill the required fields.",
      profileUpdatedSuccess: "Profile updated successfully!",
      errorUpdatingProfile: "Error updating profile. Please try again.",
      photoUploadedSuccess: "Photo uploaded successfully!",
      errorUploadingPhoto: "Error uploading photo. Please try again.",
      walletNotConnected: "Wallet not connected",
      // Hero section
      latestRaceResults: "Latest Race Results",
      currentRace: "Current Race",
      nextRace: "Next Race",
      raceDate: "Race Date",
      // Countdown
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      // BoxBox Interface
      totalBoxboxLocked: "Total BOXBOX Locked",
      connectWalletToView: "Connect wallet to view\ntotal locked tokens",
      boxboxPremium: "BoxBox Premium",
      membershipLevel: "Membership Level",
      membershipAccount: "Membership Account",
      yetToBeCreated: "Yet to be created",
      created: "Created",
      tokenBalance: "Token Balance",
      vault: "Vault",
      vaultTooltip: "Vault and membership level reset at the end of each season",
      amountToLock: "Amount to Lock (BOXBOX)",
      lockTokens: "Lock Tokens",
      processing: "Processing...",
      activeLocks: "Active Locks",
      noActiveLocks: "There are no active locks.",
      lockedAmount: "Locked Amount",
      releaseDate: "Release Date",
      unlockTokens: "Unlock Tokens",
      unlocking: "Unlocking...",
      locked: "Locked",
      keepSolForGas: "⚠️ Keep at least 0.01 SOL in your wallet for gas fee.",
      unlockedTokens: "Unlocked Tokens",
      noUnlockedTokens: "There are no unlocked tokens.",
      unlockedAmount: "Unlocked Amount",
      unlockedDate: "Unlocked Date",
      connectWalletToLock: "Connect your wallet to lock your BOXBOX tokens.",
      openWithPhantom: "Open f1meme.com with Phantom Wallet browser.",
      firstConnectionInfo: "On your first wallet connection, your membership account and vault are automatically created. This requires approval for two transactions to cover the costs, so keep at least 0.001 SOL in your wallet.",
      // Tokenomics
      tokenomics: "Tokenomics",
      tokenomicsDesc: "Discover the economic model behind BOXBOX, the F1 Meme token powering our ecosystem",
      tokenDetails: "Token Details",
      address: "Address",
      totalSupply: "Total Supply",
      nameSymbol: "Name(Symbol)",
      tokenPrice: "Token Price",
      volume24h: "24h Volume",
      liquidity: "Liquidity",
      marketCap: "Market Cap",
      change24h: "24h Change",
      trades24h: "24h Trades",
      liquidityInfo: "Currently the Liquidity is very low, if you have trouble buying large amount of BOXBOX tokens, please consider doing multiple swap in smaller amount.",
      // FAQs
      faq: "FAQ",
      faqDesc: "Frequently Asked Questions",
      stillHaveQuestions: "Still have questions?",
      joinCommunity: "Join our community channels to get more information and stay updated on the latest developments.",
      twitter: "Twitter",
      telegram: "Telegram",
      youtube: "Youtube",
      // Footer
      poweredBy: "Powered by",
      allRightsReserved: "All rights reserved",
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
    additional: {
      // Community page
      communityMember: "社区成员",
      noMembersLevel: "1-99级别暂无成员！",
      noMembersLevelDesc: "目前没有1-99级别的社区成员。稍后再来看看或成为第一个高级会员！",
      copyAddress: "复制完整地址",
      showQrCode: "显示二维码",
      hideQrCode: "隐藏二维码",
      copied: "已复制！",
      noWallet: "无钱包",
      f1Enthusiast: "F1爱好者",
      failedToGenerateQr: "生成二维码失败",
      generatingQrCode: "生成二维码中...",
      // Schedule page
      f1Schedule: "F1赛程",
      f1ScheduleDesc: "获取最新F1赛程和比赛时间信息",
      loadingF1Schedule: "加载F1赛程...",
      fetchingRaceInfo: "获取最新比赛信息",
      season: "赛季",
      raceDay: "比赛日",
      sessions: "练习赛",
      fp1: "第一次练习",
      fp2: "第二次练习",
      fp3: "第三次练习",
      qualifying: "排位赛",
      sprint: "冲刺赛",
      sprintQualifying: "冲刺排位",
      // Gallery page
      f1memeGallery: "F1Meme相册",
      f1memeGalleryDesc: "分享您的F1时刻，通过照片与社区连接",
      failedToLoadGallery: "加载相册失败",
      noPhotosYet: "暂无照片",
      noPhotosYetDesc: "相册为空。成为第一个与社区分享F1照片的人！",
      loadingGallery: "加载相册...",
      noPhotosUpload: "暂无照片。成为第一个上传者！",
      viewMore: "查看更多",
      share: "分享",
      download: "下载",
      // Home page
      boxboxWeb3Membership: "BoxBox Web3会员",
      boxboxWeb3MembershipDesc: "加入终极F1社区，解锁专属福利",
      miniGallery: "迷你相册",
      loadingGalleryHome: "加载相册...",
      noPhotosYetHome: "暂无照片。成为第一个上传者！",
      // Profile page
      addCoverPhoto: "添加封面照片",
      clickOrDragToUpload: "点击或拖拽上传",
      addPhoto: "添加照片",
      yourName: "您的姓名",
      saveProfile: "保存资料",
      profileInfo: "个人资料",
      personalInfo: "个人信息",
      name: "姓名",
      email: "邮箱",
      socialLinks: "社交链接",
      instagramUrl: "Instagram链接",
      tiktokUrl: "TikTok链接",
      telegramUrl: "Telegram链接",
      galleryUpload: "相册上传",
      uploadPhoto: "上传照片",
      dragOrClick: "拖拽或点击上传",
      nameRequired: "姓名必填（至少2个字符）。",
      nameMinLength: "姓名至少需要2个字符。",
      nameMaxLength: "姓名最多32个字符。",
      emailRequired: "邮箱必填。",
      validEmail: "请输入有效的邮箱地址。",
      validInstagramUrl: "必须是Instagram链接。",
      validTiktokUrl: "必须是TikTok链接。",
      validTelegramUrl: "必须是Telegram链接。",
      validUrl: "请输入有效的链接。",
      imageFileRequired: "文件必须是图片。",
      fillRequiredFields: "请填写必填字段。",
      profileUpdatedSuccess: "资料更新成功！",
      errorUpdatingProfile: "更新资料失败，请重试。",
      photoUploadedSuccess: "照片上传成功！",
      errorUploadingPhoto: "照片上传失败，请重试。",
      walletNotConnected: "钱包未连接",
      // Hero section
      latestRaceResults: "最新比赛结果",
      currentRace: "当前比赛",
      nextRace: "下一场比赛",
      raceDate: "比赛日期",
      // Countdown
      days: "天",
      hours: "小时",
      minutes: "分钟",
      seconds: "秒",
      // BoxBox Interface
      totalBoxboxLocked: "总锁定BOXBOX",
      connectWalletToView: "连接钱包查看\n总锁定代币",
      boxboxPremium: "BoxBox高级版",
      membershipLevel: "会员等级",
      membershipAccount: "会员账户",
      yetToBeCreated: "尚未创建",
      created: "已创建",
      tokenBalance: "代币余额",
      vault: "保险库",
      vaultTooltip: "保险库和会员等级在每个赛季结束时重置",
      amountToLock: "锁定数量 (BOXBOX)",
      lockTokens: "锁定代币",
      processing: "处理中...",
      activeLocks: "活跃锁定",
      noActiveLocks: "没有活跃的锁定。",
      lockedAmount: "锁定数量",
      releaseDate: "释放日期",
      unlockTokens: "解锁代币",
      unlocking: "解锁中...",
      locked: "已锁定",
      keepSolForGas: "⚠️ 请在钱包中保留至少0.01 SOL作为手续费。",
      unlockedTokens: "已解锁代币",
      noUnlockedTokens: "没有已解锁的代币。",
      unlockedAmount: "已解锁数量",
      unlockedDate: "解锁日期",
      connectWalletToLock: "连接钱包以锁定您的BOXBOX代币。",
      openWithPhantom: "使用Phantom钱包浏览器打开f1meme.com。",
      firstConnectionInfo: "首次连接钱包时，您的会员账户和保险库会自动创建。这需要批准两笔交易来支付费用，因此请在钱包中保留至少0.001 SOL。",
      // Tokenomics
      tokenomics: "代币经济学",
      tokenomicsDesc: "探索BOXBOX背后的经济模型，这是推动我们生态系统的F1 Meme代币",
      tokenDetails: "代币详情",
      address: "地址",
      totalSupply: "总供应量",
      nameSymbol: "名称(符号)",
      tokenPrice: "代币价格",
      volume24h: "24小时交易量",
      liquidity: "流动性",
      marketCap: "市值",
      change24h: "24小时变化",
      trades24h: "24小时交易",
      liquidityInfo: "目前流动性较低，如果您在购买大量BOXBOX代币时遇到困难，请考虑分多次小额交换。",
      // FAQs
      faq: "常见问题",
      faqDesc: "常见问题解答",
      stillHaveQuestions: "还有问题吗？",
      joinCommunity: "加入我们的社区频道，获取更多信息并了解最新发展动态。",
      twitter: "推特",
      telegram: "电报",
      youtube: "YouTube",
      // Footer
      poweredBy: "技术支持",
      allRightsReserved: "版权所有",
    },
  },
};
