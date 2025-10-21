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
  
  // Messages for BoxBox Interface
  messages: {
    // Error messages
    walletNotConnected: string;
    errorCheckingMembershipAccount: string;
    needSolForAccount: string;
    rejectedCreateAccount: string;
    errorCreatingAccount: string;
    needSolForVault: string;
    rejectedCreateVault: string;
    transactionExpired: string;
    errorCreatingVault: string;
    errorFetchingAccountInfo: string;
    needSolForTransactions: string;
    needCreateAccountAndVault: string;
    cannotHaveMoreThan99Transactions: string;
    insufficientBalance: string;
    noBoxboxTokens: string;
    rejectedLockTokens: string;
    errorLockingTokens: string;
    lockNotActive: string;
    tokensAlreadyUnlocked: string;
    tokensStillLocked: string;
    rejectedUnlockTokens: string;
    errorUnlockingTokens: string;
    // Success messages
    membershipAccountCreated: string;
    vaultCreated: string;
    tokensLockedSuccessfully: string;
    tokensUnlockedSuccessfully: string;
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
    createAccount: string;
    createVault: string;
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
    faq1Question: string;
    faq1Answer: string;
    faq2Question: string;
    faq2Answer: string;
    faq3Question: string;
    faq3Answer: string;
    faq4Question: string;
    faq4Answer: string;
    faq5Question: string;
    faq5Answer: string;
    stillHaveQuestions: string;
    joinCommunity: string;
    twitter: string;
    telegram: string;
    youtube: string;
      // News items for marquee
      news1: string;
      news2: string;
      news3: string;
      news4: string;
      // Profile page additional texts
      galleryAccess: string;
      captionOptional: string;
      addCaptionPlaceholder: string;
      uploadToGallery: string;
      upgradeToLevel55: string;
      // Drivers standings
      loadingStandings: string;
      // Hero section additional texts
      getStartedWithPhantom: string;
    // Footer
    poweredBy: string;
    allRightsReserved: string;
    disclaimer: string;
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
      tiktok: "(formerly Twitter)",
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
    messages: {
      // Error messages
      walletNotConnected: "Wallet not connected.",
      errorCheckingMembershipAccount: "Error checking membership account:",
      needSolForAccount: "You need 0.00016 SOL to create an account. If you've added the SOL, disconnect and reconnect your wallet to proceed.",
      rejectedCreateAccount: "You rejected the request to create your membership account",
      errorCreatingAccount: "Error creating account:",
      needSolForVault: "You need 0.00016 SOL to create a vault. If you've added the SOL, disconnect and reconnect your wallet to proceed.",
      rejectedCreateVault: "You rejected the request to create your vault",
      transactionExpired: "Transaction expired. Please try again.",
      errorCreatingVault: "Error creating vault:",
      errorFetchingAccountInfo: "Error fetching account info:",
      needSolForTransactions: "You need some SOL for to create an account, a vault and for transactions. If you've added the SOL, disconnect and reconnect your wallet to proceed.",
      needCreateAccountAndVault: "Before locking tokens, you need to create a membership account and create a vault.",
      cannotHaveMoreThan99Transactions: "You cannot have more than 99 transactions.",
      insufficientBalance: "Insufficient Balance.",
      noBoxboxTokens: "You don't have any BOXBOX tokens. Purchase some at boxbox.wtf",
      rejectedLockTokens: "You rejected the request to lock tokens",
      errorLockingTokens: "Error locking tokens:",
      lockNotActive: "This lock is not active.",
      tokensAlreadyUnlocked: "The tokens have already been unlocked.",
      tokensStillLocked: "Tokens are still locked. Come back on/after",
      rejectedUnlockTokens: "You rejected the request to unlock tokens",
      errorUnlockingTokens: "Error unlocking tokens:",
      // Success messages
      membershipAccountCreated: "Membership account has been set up.",
      vaultCreated: "Vault created successfully!",
      tokensLockedSuccessfully: "Tokens locked successfully!",
      tokensUnlockedSuccessfully: "Tokens unlocked successfully!",
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
      instagramUrl: "Instagram Username",
      tiktokUrl: "(formerly Twitter) Username",
      telegramUrl: "Telegram Username",
      galleryUpload: "Gallery Upload",
      uploadPhoto: "Upload Photo",
      dragOrClick: "Drag or click to upload",
      nameRequired: "Name is required (2+ chars).",
      nameMinLength: "Name must be at least 2 characters.",
      nameMaxLength: "Name must be at most 32 characters.",
      emailRequired: "Email is required.",
      validEmail: "Enter a valid email address.",
      validInstagramUrl: "Enter a valid Instagram username.",
      validTiktokUrl: "Enter a valid X(formerly Twitter) username.",
      validTelegramUrl: "Enter a valid Telegram username.",
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
      createAccount: "Create Account",
      createVault: "Create Vault",
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
      firstConnectionInfo: "Connect your wallet and create your membership account and vault to start locking BOXBOX tokens. Keep at least 0.001 SOL in your wallet for transaction fees.",
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
      faq1Question: "What is a Solana Token Program?",
      faq1Answer: "A Solana Token Program is a smart contract that manages the creation and behavior of tokens on the Solana blockchain. It handles essential functions such as minting new tokens, burning existing ones, and facilitating transfers between accounts. This program ensures the integrity and functionality of tokens within the Solana ecosystem.",
      faq2Question: "What is a Membership Account?",
      faq2Answer: "A Membership Account is a specialized account within our ecosystem that tracks your participation and privileges. It stores information about your activity, token holdings, and access levels. This account may grant you special benefits, voting rights, or access to exclusive features based on your level of engagement and token ownership.",
      faq3Question: "What is a Vault?",
      faq3Answer: "A Vault is a secure smart contract designed to hold and manage tokens or other digital assets. Vaults serve various purposes, such as facilitating staking mechanisms, providing liquidity to decentralized exchanges, or managing treasury funds. They often incorporate advanced security measures to protect the assets they hold.",
      faq4Question: "How are tokens locked and unlocked?",
      faq4Answer: "Token locking and unlocking are controlled by smart contract mechanisms. These processes can be used for various purposes, such as implementing vesting schedules for team tokens, enforcing staking periods, or managing liquidity. The smart contract defines conditions that must be met before tokens can be transferred or accessed, ensuring adherence to predefined rules.",
      faq5Question: "What are the levels?",
      faq5Answer: "Levels in our ecosystem range from 0 to 99, where 0 is the lowest and 99 is the highest. To advance to the next level, a user must lock 10 million tokens. Users at at least level 55 have the opportunity to add pictures to the F1meme gallery section. Upgrading levels provides access to additional benefits and features, with higher levels unlocking more exclusive perks and opportunities.",
      stillHaveQuestions: "Still have questions?",
      joinCommunity: "Join our community channels to get more information and stay updated on the latest developments.",
      twitter: "Twitter",
      telegram: "Telegram",
      youtube: "Youtube",
      // News items for marquee
      news1: "Yuki Tsunoda Racing in Red Bull in front Japanese Crowd 🏎️",
      news2: "Maclaren Big Lead in both Championship, is it a bad sign?🔥",
      news3: "Kimi winning his first Grand Prix soon 🔧",
      news4: "Over 220,000 attendance in Chinese Grand Prix 🏁",
      // Profile page additional texts
      galleryAccess: "Gallery Access",
      captionOptional: "Caption (Optional)",
      addCaptionPlaceholder: "Add a caption for your photo...",
      uploadToGallery: "Upload to Gallery",
      upgradeToLevel55: "Upgrade to Level 55+ to upload photos to the gallery!",
      // Drivers standings
      loadingStandings: "Loading standings...",
      // Hero section additional texts
      getStartedWithPhantom: "Get Started with Phantom",
      // Footer
      poweredBy: "Powered by",
      allRightsReserved: "All rights reserved",
      disclaimer: "This is a meme project which is unofficial and is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V",
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
      tiktok: "(formerly Twitter)",
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
    messages: {
      // Error messages
      walletNotConnected: "钱包未连接。",
      errorCheckingMembershipAccount: "检查会员账户时出错：",
      needSolForAccount: "您需要0.00016 SOL来创建账户。如果您已添加SOL，请断开并重新连接钱包以继续。",
      rejectedCreateAccount: "您拒绝了创建会员账户的请求",
      errorCreatingAccount: "创建账户时出错：",
      needSolForVault: "您需要0.00016 SOL来创建保险库。如果您已添加SOL，请断开并重新连接钱包以继续。",
      rejectedCreateVault: "您拒绝了创建保险库的请求",
      transactionExpired: "交易已过期。请重试。",
      errorCreatingVault: "创建保险库时出错：",
      errorFetchingAccountInfo: "获取账户信息时出错：",
      needSolForTransactions: "您需要一些SOL来创建账户、保险库和进行交易。如果您已添加SOL，请断开并重新连接钱包以继续。",
      needCreateAccountAndVault: "在锁定代币之前，您需要创建会员账户和创建保险库。",
      cannotHaveMoreThan99Transactions: "您不能有超过99笔交易。",
      insufficientBalance: "余额不足。",
      noBoxboxTokens: "您没有任何BOXBOX代币。请在boxbox.wtf购买一些",
      rejectedLockTokens: "您拒绝了锁定代币的请求",
      errorLockingTokens: "锁定代币时出错：",
      lockNotActive: "此锁定不活跃。",
      tokensAlreadyUnlocked: "代币已被解锁。",
      tokensStillLocked: "代币仍被锁定。请在以下时间后回来：",
      rejectedUnlockTokens: "您拒绝了解锁代币的请求",
      errorUnlockingTokens: "解锁代币时出错：",
      // Success messages
      membershipAccountCreated: "会员账户已设置。",
      vaultCreated: "保险库创建成功！",
      tokensLockedSuccessfully: "代币锁定成功！",
      tokensUnlockedSuccessfully: "代币解锁成功！",
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
      instagramUrl: "Instagram用户名",
      tiktokUrl: "X (原Twitter) 用户名",
      telegramUrl: "Telegram用户名",
      galleryUpload: "相册上传",
      uploadPhoto: "上传照片",
      dragOrClick: "拖拽或点击上传",
      nameRequired: "姓名必填（至少2个字符）。",
      nameMinLength: "姓名至少需要2个字符。",
      nameMaxLength: "姓名最多32个字符。",
      emailRequired: "邮箱必填。",
      validEmail: "请输入有效的邮箱地址。",
      validInstagramUrl: "请输入有效的Instagram用户名。",
      validTiktokUrl: "请输入有效的X (原Twitter) 用户名。",
      validTelegramUrl: "请输入有效的Telegram用户名。",
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
      createAccount: "创建账户",
      createVault: "创建保险库",
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
      firstConnectionInfo: "连接钱包并创建您的会员账户和保险库以开始锁定BOXBOX代币。请在钱包中保留至少0.001 SOL作为交易手续费。",
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
      faq1Question: "什么是Solana代币程序？",
      faq1Answer: "Solana代币程序是一个智能合约，用于管理Solana区块链上代币的创建和行为。它处理基本功能，如铸造新代币、销毁现有代币以及促进账户之间的转账。该程序确保Solana生态系统内代币的完整性和功能性。",
      faq2Question: "什么是会员账户？",
      faq2Answer: "会员账户是我们生态系统中的专用账户，用于跟踪您的参与和特权。它存储有关您的活动、代币持有量和访问级别的信息。根据您的参与度和代币所有权，该账户可能授予您特殊福利、投票权或独家功能访问权限。",
      faq3Question: "什么是保险库？",
      faq3Answer: "保险库是一个安全的智能合约，用于持有和管理代币或其他数字资产。保险库有多种用途，如促进质押机制、为去中心化交易所提供流动性或管理国库资金。它们通常采用先进的安全措施来保护所持有的资产。",
      faq4Question: "代币如何锁定和解锁？",
      faq4Answer: "代币锁定和解锁由智能合约机制控制。这些过程可用于各种目的，如实施团队代币的归属时间表、执行质押期限或管理流动性。智能合约定义在代币可以转移或访问之前必须满足的条件，确保遵守预定义的规则。",
      faq5Question: "等级是什么？",
      faq5Answer: "我们生态系统中的等级范围从0到99，其中0是最低等级，99是最高等级。要升级到下一等级，用户必须锁定1000万代币。等级至少55的用户有机会向F1meme画廊部分添加图片。升级等级可提供额外的福利和功能访问权限，更高的等级解锁更多独家特权和机会。",
      stillHaveQuestions: "还有问题吗？",
      joinCommunity: "加入我们的社区频道，获取更多信息并了解最新发展动态。",
      twitter: "推特",
      telegram: "电报",
      youtube: "YouTube",
      // News items for marquee
      news1: "角田裕毅在日本观众面前驾驶红牛赛车 🏎️",
      news2: "迈凯伦在两个锦标赛中都大幅领先，这是坏兆头吗？🔥",
      news3: "基米即将赢得他的第一个大奖赛 🔧",
      news4: "中国大奖赛观众超过220,000人 🏁",
      // Profile page additional texts
      galleryAccess: "画廊访问",
      captionOptional: "说明文字（可选）",
      addCaptionPlaceholder: "为您的照片添加说明文字...",
      uploadToGallery: "上传到画廊",
      upgradeToLevel55: "升级到55级或以上才能上传照片到画廊！",
      // Drivers standings
      loadingStandings: "加载排名中...",
      // Hero section additional texts
      getStartedWithPhantom: "开始使用Phantom",
      // Footer
      poweredBy: "技术支持",
      allRightsReserved: "版权所有",
      disclaimer: "这是一个非官方的模因项目，与F1公司没有任何关联。F1、FORMULA ONE、FORMULA 1、FIA FORMULA ONE WORLD CHAMPIONSHIP、GRAND PRIX及相关标记是Formula One Licensing B.V的商标。",
    },
  },
};
