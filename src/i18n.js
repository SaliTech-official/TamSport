import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Get initial language from localStorage or default to 'en'
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('language');
  return savedLanguage || 'en';
};

// Common translations that should always be loaded
const commonResources = {
  en: {
    blog: {
      // Header Navigation
      home: 'Home',
      news: 'News',
      shop: 'Shop',
      contact: 'Contact',
      about: 'About',
      search: 'Search...',
      selectLanguage: 'Select your language',
      persian: 'فارسی',
      english: 'English',
      // Latest News Section
      latestNews: 'Latest News',
      latestVideos: 'Latest Videos',
      viewAll: 'VIEW ALL',
      // Team Section
      Team: 'Team',
      tamsTeam: "TAM'S TEAM",
      football: "FOOTBALL",
      // Shop Section
      tamsShop: "TAM'S SHOP",
      comingSoon: "COMING SOON",
      shopUnderConstruction: "Our shop is under construction. Stay tuned!",
      // Shop Page
      shopPageComingSoon: "Coming Soon",
      shopPagePreparing: "We're preparing something special for you",
      shopPageTitle: "TamSport Shop",
      shopPageDescription: "Our online store is currently under development. We're working hard to bring you the best selection of team merchandise and exclusive items.",
      shopPageBackToHome: "Back to Home",
      // About Page
      aboutTeamName: "Tam Cultural and Sports Club",
      aboutTeamDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem mollis. Morbi tristique senectus et netus. Mattis pellentesque id nibh tortor id aliquet lectus proin. Sapien faucibus et molestie ac feugiat sed lectus vestibulum. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. Dictum varius duis at consectetur lorem. Nisi vitae suscipit tellus mauris a diam maecenas sed enim. Velit ut tortor pretium viverra suspendisse potenti nullam. Et molestie ac feugiat sed lectus. Non nisi est sit amet facilisis magna. Dignissim diam quis enim lobortis...",
      aboutReadMore: "Read More",
      aboutShowLess: "Show Less",
      aboutImportantHonors: "Important Honors",
      aboutPremierLeagueChampionship: "Premier League Championship 2008/09",
      // Player Section
      player: "PLAYER",
      forward: "Forward",
      // Contact Section
      whatsapp: "FC TAM WHATSAPP",
      instagram: "FC TAM INSTAGRAM",
      discord: "FC TAM DISCORD",
      twitter: "FC TAM TWITTER",
      youtube: "FC TAM YOUTUBE",
      facebook: "FC TAM FACEBOOK",
      // Footer Section
      footerHome: "Home",
      footerNews: "News",
      footerShop: "Shop",
      footerAbout: "About",
      footerLatestNews: "Latest News",
      footerTamsTeam: "Tam's Team",
      footerTamsShop: "Tam's Shop",
      footerPlayers: "Players",
      footerAllContent: "All Content",
      footerArticleContent: "Article Content",
      footerVideoContent: "Video Content",
      footerSlideshowContent: "Slideshow Content",
      footerComingSoon: "Coming Soon",
      footerTeamName: "Team Name",
      footerTeamLogo: "Team Logo",
      footerTeamDescriptions: "Team Descriptions",
      footerTeamHonors: "Team Honors",
      // News Page
      newsAll: "All",
      newsArticles: "Articles",
      newsVideos: "Videos",
      newsSlideshows: "Slideshows",
      newsLoadMore: "Load More",
      noArticlesFound: "No Articles Found",
      noArticlesFoundDescription: "We couldn't find any articles matching your current filter. Try changing the filter or check back later for new content.",
      tryDifferentFilter: "Try Different Filter",
      refreshPage: "Refresh Page",
      advancedFilter: "Advanced Filter",
      applyFilter: "Apply Filter",
      // Search Results
      searchResultsFor: "Search results for",
      clearSearch: "Clear Search",
      // Error Page
      errorPageNotFound: "Page Not Found",
      errorPageDescription: "The page you are looking for doesn't exist or has been moved.",
      errorBackToHome: "Back to Home",
      backToNews: "Back to News",
      // Modal
      modalAccept: "Accept",
      modalReject: "Reject",
      // Welcome Modal
      welcomeModalTitle: "Welcome to TamSport",
      welcomeModalContent: "We are delighted to have you here. Explore our website to discover the latest news, team information, and exclusive content about TamSport.",
      // Basic profile
      profileWelcomeBack: "Welcome Back!",
      profileLogout: "Logout",
      profileProfile: "Profile",
      profileOrders: "Orders",
      profileFavorites: "Favorites",
      profileSettings: "Settings",
      loading: "Loading...",
      // SomethingWentWrong Page
      somethingWentWrong: "Oops! Something Went Wrong",
      somethingWentWrongDescription: "We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.",
      somethingWentWrongTryAgain: "Try Again",
      somethingWentWrongContactSupport: "Contact Support",
      somethingWentWrongErrorCode: "Error Code",
      imageNotProvided: "Image not available",
      // about search
      searchResultsFor: 'search results for',
      // about category
      categoryFilter:'category resulsts for',
      // hamburger menu
      hamburgerLoginRegister: "Login/Register",
      hamburgerProfile: "Profile",
      // Article Not Found
      articleNotFound: "Article Not Found",
      articleNotFoundDescription: "We couldn't find the article you're looking for. It might have been moved or deleted.",
      articleNotFoundBackToHome: "Back to Home",
      // profile namespace
      profileTabInfo: "User Information",
      profileTabHistory: "Class Pre-Registration History",
      profileTabSecurity: "Security & Login",
      profileTabNotifications: "Notifications",
      profileTabSupport: "Support & Tickets",
      profileFirstName: "First Name",
      profileLastName: "Last Name",
      profileDOB: "Date of Birth",
      profileEmail: "Email",
      profilePhone: "Phone Number",
      profileSave: "Save Changes",
      profileDiscard: "Discard Changes",
      profileRow: "Row",
      profileSport: "Sport/Course",
      profileDate: "Registration Date",
      profilePassword: "Password",
      profileTabAccountInfo: "Account Information",
      profileTabReadOnlyInfo: "Account Information", // New translation for readonly tab
      profileRegistrationTime: "Registration Time", // New translation
      profileLastUpdate: "Last Update", // New translation
      profileUserRole: "User Role", // New translation
      roleAdmin: "Admin", // New translation
      roleAuthor: "Author", // New translation
      roleSeller: "Seller", // New translation
      roleNormalUser: "Normal User", // New translation
      profileUpdateError: "Error updating profile!", // New translation
      profileFirstNameMax: "First name cannot exceed {{max}} characters.", // Added
      profileLastNameMax: "Last name cannot exceed {{max}} characters.", // Added
      formErrors: "Please fix the form errors.", // Added
      noChanges: "No changes detected to save.", // Added
      passwordLengthError: "Password must be at least 8 characters.", // Added
      passwordUppercaseError: "Password must contain at least one uppercase letter.", // Added
      passwordLowercaseError: "Password must contain at least one lowercase letter.", // Added
      passwordNumberError: "Password must contain at least one number.", // Added
      passwordSpecialCharError: "Password must contain at least one special character (!@#$%^&*).", // Added
      passwordsDoNotMatch: "Passwords do not match.", // Added
      profilePasswordRequired: "Password is required.", // Added
      profileCurrentPassword: "Current Password", // Added
      profileNewPassword: "New Password", // Added
      profileConfirmNewPassword: "Confirm New Password", // Added
      profileChangePassword: "Change Password",
      profileEmailNotifications: "Email Notifications",
      profileChangeEmail: "Change Email",
      profileSmsNotifications: "SMS Notifications",
      profileComingSoon: "Coming Soon",
      profileSaveSuccess: "Profile updated successfully!",
      // profile modal
      profileModalTitle: "Profile Information",
      profileModalContent: "Please enter your new email address. We will send a verification code to your new email address.",
      profileModalChangeEmail: "Change Email",
      profileModalChangePassword: "Change Password",
      profileModalChangeEmailSuccess: "Email updated successfully!",
      profileModalChangePasswordSuccess: "Password updated successfully!",
      profilePasswordCodeMsg: "Enter the code sent to your phone",
      profileSubmit: "Submit Changes",
      profileEmailCodeMsg: "Enter the code sent to your email",
      profileNewEmail: "New Email",
      profileOldPasswordPlaceholder: "Enter current password",
      profileNewPasswordPlaceholder: "Enter new password",
      profileConfirmNewPasswordPlaceholder: "Confirm new password",
    },
    // Form and validation related translations - loaded when needed
    validation: {
      // Login Page
      loginWelcomeTitle: "Welcome To Website",
      loginWelcomeDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Egestas purus viverra accumsan in nisl nisi Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque ...",
      userLogin: "User Login",
      userRegister: "User Register",
      phoneNumber: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot Password?",
      login: "LOGIN",
      register: "Register",
      or: "OR",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      // register page
      registerWelcomeTitle: "Welcome to TamSport",
      registerWelcomeDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Egestas purus viverra accumsan in nisl nisi Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque ...",
      // Validation messages
      invalidCredentials: "Phone number or password is incorrect",
      invalidPhoneNumber: "Your Phone Number is Invalid",
      passwordsDoNotMatch: "Passwords do not match",
      passwordLengthError: "Password must be at least 8 characters",
      passwordContentError: "Use letters and numbers",
      loginSuccessTitle: "Login Successful",
      loginSuccessContent: "You have successfully logged in!",
      logoutSeccessTitle: "Successfully logged out",
      // OTP
      otpVerification: "OTP Verification",
      otpEnterCode: "Enter the code sent to your phone",
      invalidOtpCode: "Invalid OTP code",
      resendCode: "Resend Code",
      verify: "Verify",
      // profile validation
      profileProfileInfo: "Profile Information",
      profileEmail: "Email",
      profileEnterEmail: "Enter your email",
      profileUpdateEmail: "Update Email",
      profileChangePassword: "Change Password",
      profileCurrentPassword: "Current Password",
      profileNewPassword: "New Password",
      profileConfirmNewPassword: "Confirm New Password",
      profileYourOrders: "Your Orders",
      profileNoOrders: "No orders found.",
      profileYourFavorites: "Your Favorites",
      profileNoFavorites: "No favorites found.",
      profileAccountSettings: "Account Settings",
      profileEmailNotifications: "Email Notifications",
      profileEmailNotificationsDesc: "Receive updates about your orders",
      profileSmsNotifications: "SMS Notifications",
      profileSmsNotificationsDesc: "Receive updates via SMS",
      profileImageSizeError: "Image size should be less than 5MB",
      profileImageUpdateSuccess: "Profile picture updated successfully",
      profilePasswordChangeSuccess: "Password changed successfully",
      profileEmailUpdateSuccess: "Email updated successfully",
      profileShowEmailForm: "Change Email",
      profileHideEmailForm: "Hide Email Form",
      profileShowPasswordForm: "Change Password",
      profileHidePasswordForm: "Hide Password Form",
      profilePasswordRequired: "Password is required",
      profilePasswordChangeError: "An error occurred while changing your password",
      passwordLengthError: "Password must be at least 8 characters",
    },
    preRegister: {
      preRegisterTitle: "Pre-Registration",
      fullName: "Full Name",
      phone: "Phone",
      age: "Age",
      sportsField: "Sports Field",
      selectSport: "Select a sport",
      submit: "Submit",
      required: "This field is required",
      invalidAge: "Please enter a valid age",
      preRegisterSuccess: "Pre-registration successful! Thank you.",
      fullNameTooLong: "Full name cannot exceed 255 characters.",
      invalidPhoneNumberFormat: "Phone number must be 11 digits and numeric.",
      sendEmailFailed: "Failed to send pre-registration email. Please try again later.",
      submissionError: "An error occurred during submission.",
      languageChangeRequired: "Please switch the site language to Persian to proceed with pre-registration.",
      football: "Football",
      basketball: "Basketball",
      volleyball: "Volleyball",
      tennis: "Tennis",
      swimming: "Swimming",
    },
  },
  fa: {
    blog: {
      // Header Navigation
      home: 'خانه',
      news: 'اخبار',
      shop: 'فروشگاه',
      contact: 'ارتباط با ما',
      about: 'درباره ما',
      search: 'جستجو...',
      selectLanguage: 'زبان خود را انتخاب کنید',
      persian: 'فارسی',
      english: 'English',
      // Latest News Section
      latestNews: 'جدیدترین اخبار',
      latestVideos: 'جدیدترین ویدیوها',
      viewAll: 'مشاهده همه',
      // Team Section
      Team: 'تیم',
      tamsTeam: "تیم‌های تام",
      football: "فوتبال",
      // Shop Section
      tamsShop: "فروشگاه تام",
      comingSoon: "به زودی",
      shopUnderConstruction: "فروشگاه ما در حال ساخت است. با ما همراه باشید!",
      // Shop Page
      shopPageComingSoon: "به زودی",
      shopPagePreparing: "ما در حال آماده‌سازی چیزی خاص برای شما هستیم",
      shopPageTitle: "فروشگاه تام اسپرت",
      shopPageDescription: "فروشگاه آنلاین ما در حال توسعه است. ما سخت در تلاش هستیم تا بهترین انتخاب از محصولات تیم و اقلام انحصاری را برای شما فراهم کنیم.",
      shopPageBackToHome: "بازگشت به خانه",
      // About Page
      aboutTeamName: "باشگاه فرهنگی ورزشی تام",
      aboutTeamDescription: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد...",
      aboutReadMore: "ادامه مطلب",
      aboutShowLess: "کمتر",
      aboutImportantHonors: "افتخارات مهم",
      aboutPremierLeagueChampionship: "قهرمانی لیگ برتر 2008/09",
      // Player Section
      player: "بازیکن",
      forward: "مهاجم",
      // Contact Section
      whatsapp: "واتساپ تام",
      instagram: "اینستاگرام تام",
      discord: "دیسکورد تام",
      twitter: "توییتر تام",
      youtube: "یوتیوب تام",
      facebook: "فیسبوک تام",
      // Footer Section
      footerHome: "خانه",
      footerNews: "اخبار",
      footerShop: "فروشگاه",
      footerAbout: "درباره ما",
      footerLatestNews: "جدیدترین اخبار",
      footerTamsTeam: "تیم تام",
      footerTamsShop: "فروشگاه تام",
      footerPlayers: "بازیکنان",
      footerAllContent: "همه محتوا",
      footerArticleContent: "محتوا متنی",
      footerVideoContent: "محتوا ویدیویی",
      footerSlideshowContent: "محتوا اسلایدشو",
      footerComingSoon: "به زودی",
      footerTeamName: "نام تیم",
      footerTeamLogo: "لوگوی تیم",
      footerTeamDescriptions: "توضیحات تیم",
      footerTeamHonors: "افتخارات تیم",
      // News Page
      newsAll: "همه",
      newsArticles: "مقالات",
      newsVideos: "ویدیوها",
      newsSlideshows: "اسلایدشوها",
      newsLoadMore: "بارگذاری بیشتر",
      noArticlesFound: "مقاله‌ای یافت نشد",
      noArticlesFoundDescription: "متأسفانه هیچ مقاله‌ای با فیلتر فعلی شما یافت نشد. لطفاً فیلتر را تغییر دهید یا بعداً برای محتوای جدید مراجعه کنید.",
      tryDifferentFilter: "تغییر فیلتر",
      refreshPage: "بارگذاری مجدد",
      advancedFilter: "فیلتر پیشرفته",
      applyFilter: "اعمال فیلتر",
      // Search Results
      searchResultsFor: "نتیجه جستجو برای",
      clearSearch: "پاک کردن جستجو",
      // Error Page
      errorPageNotFound: "صفحه یافت نشد",
      errorPageDescription: "صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.",
      errorBackToHome: "بازگشت به خانه",
      backToHome: "بازگشت به خبر ها",
      // Modal
      modalAccept: "تایید",
      modalReject: "رد",
      // Welcome Modal
      welcomeModalTitle: "به تام اسپرت خوش آمدید",
      welcomeModalContent: "از حضور شما در وبسایت ما خوشحالیم. برای مشاهده آخرین اخبار، اطلاعات تیم و محتوای اختصاصی تام اسپرت، وبسایت ما را کاوش کنید.",
      // Basic profile
      profileWelcomeBack: "خوش آمدید!",
      profileLogout: "خروج",
      profileProfile: "پروفایل",
      profileOrders: "سفارشات",
      profileFavorites: "علاقه‌مندی‌ها",
      profileSettings: "تنظیمات",
      loading: "در حال بارگذاری...",
      // SomethingWentWrong Page
      somethingWentWrong: "اوه! مشکلی پیش آمد",
      somethingWentWrongDescription: "متأسفانه مشکلی غیرمنتظره رخ داده است. تیم ما مطلع شده و در حال رفع مشکل است.",
      somethingWentWrongTryAgain: "تلاش مجدد",
      somethingWentWrongContactSupport: "تماس با پشتیبانی",
      somethingWentWrongErrorCode: "کد خطا",
      imageNotProvided: "تصویر در دسترس نیست",
      // about search
      searchResultsFor: 'نتیجه جست و جو برای',
      // about category
      categoryFilter: 'نتیجه جست و جو برای',
      // hamburger menu
      hamburgerLoginRegister: "ورود/ثبت نام",
      hamburgerProfile: "پروفایل",
      // Article Not Found
      articleNotFound: "مقاله یافت نشد",
      articleNotFoundDescription: "متأسفانه مقاله‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.",
      articleNotFoundBackToHome: "بازگشت به خانه",
      // profile namespace
      profileTabInfo: "اطلاعات کاربر",
      profileTabHistory: "تاریخچه پیش‌ثبت‌نام",
      profileTabSecurity: "امنیت و ورود",
      profileTabNotifications: "اعلان‌ها",
      profileTabSupport: "پشتیبانی و تیکت‌ها",
      profileFirstName: "نام",
      profileLastName: "نام خانوادگی",
      profileDOB: "تاریخ تولد",
      profileEmail: "ایمیل",
      profilePhone: "شماره موبایل",
      profileSave: "ثبت تغییرات",
      profileDiscard: "صرف‌نظر از تغییر",
      profileRow: "ردیف",
      profileSport: "رشته/کلاس",
      profileDate: "تاریخ ثبت‌نام",
      profilePassword: "رمز عبور",
      profileTabAccountInfo: "اطلاعات حساب",
      profileTabReadOnlyInfo: "اطلاعات حساب", // New translation for readonly tab
      profileRegistrationTime: "زمان ثبت نام", // New translation
      profileLastUpdate: "آخرین بروزرسانی", // New translation
      profileUserRole: "نقش کاربر", // New translation
      roleAdmin: "ادمین", // New translation
      roleAuthor: "نویسنده", // New translation
      roleSeller: "فروشنده", // New translation
      roleNormalUser: "کاربر عادی", // New translation
      profileUpdateError: "خطا در به‌روزرسانی پروفایل!", // New translation
      profileFirstNameMax: "نام نمی‌تواند بیشتر از {{max}} کاراکتر باشد.", // Added
      profileLastNameMax: "نام خانوادگی نمی‌تواند بیشتر از {{max}} کاراکتر باشد.", // Added
      formErrors: "لطفا خطاهای فرم را برطرف کنید.", // Added
      noChanges: "هیچ تغییری برای ذخیره یافت نشد.", // Added
      passwordLengthError: "گذرواژه باید حداقل 8 کاراکتر باشد.", // Added
      passwordUppercaseError: "گذرواژه باید حداقل شامل یک حرف بزرگ باشد.", // Added
      passwordLowercaseError: "گذرواژه باید حداقل شامل یک حرف کوچک باشد.", // Added
      passwordNumberError: "گذرواژه باید حداقل شامل یک عدد باشد.", // Added
      passwordSpecialCharError: "گذرواژه باید حداقل شامل یک کاراکتر خاص (!@#$%^&*) باشد.", // Added
      passwordsDoNotMatch: "رمزهای عبور مطابقت ندارند.", // Added
      profilePasswordRequired: "رمز عبور الزامی است.", // Added
      profileCurrentPassword: "رمز عبور فعلی", // Added
      profileNewPassword: "رمز عبور جدید", // Added
      profileConfirmNewPassword: "تکرار رمز عبور جدید", // Added
      profileChangePassword: "تغییر رمز عبور",
      profileEmailNotifications: "اعلان‌های ایمیلی",
      profileChangeEmail: "تغییر ایمیل",
      profileSmsNotifications: "اعلان‌های پیامکی",
      profileComingSoon: "به زودی",
      profileSaveSuccess: "پروفایل با موفقیت به‌روزرسانی شد!",
      // profile modal
      profileModalTitle: "اطلاعات پروفایل",
      profileModalContent: "لطفاً آدرس ایمیل خود را وارد کنید. ما یک رمز یکبار مصرف به آدرس ایمیل جدید شما ارسال خواهیم کرد.",
      profileModalChangeEmail: "تغییر ایمیل",
      profileModalChangePassword: "تغییر رمز عبور",
      profileModalChangeEmailSuccess: "ایمیل با موفقیت به‌روز شد!",
      profileModalChangePasswordSuccess: "رمز عبور با موفقیت تغییر کرد!",
      profilePasswordCodeMsg: "کد ارسال شده به شماره موبایل خود را وارد کنید",
      profileSubmit: "ثبت تغییرات",
      profileEmailCodeMsg: "کد ارسال شده به ایمیل خود را وارد کنید",
      profileNewEmail: "ایمیل جدید",
      profileOldPasswordPlaceholder: "رمز عبور فعلی را وارد کنید",
      profileNewPasswordPlaceholder: "رمز عبور جدید را وارد کنید",
      profileConfirmNewPasswordPlaceholder: "رمز عبور جدید را تکرار کنید",
    },
    // Form and validation related translations - loaded when needed
    validation: {
      // Login Page
      loginWelcomeTitle: "خوش آمدید به وبسایت",
      loginWelcomeDescription: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد...",
      userLogin: "ورود کاربر",
      userRegister: "ثبت نام کاربر",
      phoneNumber: "شماره موبایل",
      password: "رمز عبور",
      confirmPassword: "تکرار رمز عبور",
      rememberMe: "مرا به خاطر بسپار",
      forgotPassword: "فراموشی رمز عبور؟",
      login: "ورود",
      register: "ثبت نام",
      or: "یا",
      dontHaveAccount: "حساب کاربری ندارید؟",
      alreadyHaveAccount: "قبلاً حساب کاربری دارید؟",
      // register page
      registerWelcomeTitle: "خوش آمدید به تام اسپرت",
      registerWelcomeDescription: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد...",
      // Validation messages
      invalidCredentials: "شماره موبایل یا رمز عبور اشتباه است",
      invalidPhoneNumber: "شماره موبایل شما نامعتبر است",
      passwordsDoNotMatch: "رمزهای عبور مطابقت ندارند",
      passwordLengthError: "رمز عبور باید حداقل 8 کاراکتر باشد",
      passwordContentError: "از حروف و اعداد استفاده کنید",
      loginSuccessTitle: "ورود موفقیت‌آمیز",
      loginSuccessContent: "شما با موفقیت وارد شدید!",
      logoutSeccessTitle: "با موفقیت خارج شدید",
      // OTP
      otpVerification: "تأیید کد یکبار مصرف",
      otpEnterCode: "کد ارسال شده به موبایل خود را وارد کنید",
      invalidOtpCode: "کد یکبار مصرف نامعتبر است",
      resendCode: "ارسال مجدد کد",
      verify: "تأیید",
      // profile validation
      profileProfileInfo: "اطلاعات پروفایل",
      profileEmail: "ایمیل",
      profileEnterEmail: "ایمیل خود را وارد کنید",
      profileUpdateEmail: "به‌روزرسانی ایمیل",
      profileChangePassword: "تغییر رمز عبور",
      profileCurrentPassword: "رمز عبور فعلی",
      profileNewPassword: "رمز عبور جدید",
      profileConfirmNewPassword: "تکرار رمز عبور جدید",
      profileYourOrders: "سفارشات شما",
      profileNoOrders: "سفارشی یافت نشد.",
      profileYourFavorites: "علاقه‌مندی‌های شما",
      profileNoFavorites: "علاقه‌مندی‌ای یافت نشد.",
      profileAccountSettings: "تنظیمات حساب",
      profileEmailNotifications: "اعلان‌های ایمیلی",
      profileEmailNotificationsDesc: "دریافت به‌روزرسانی‌ها درباره سفارشات",
      profileSmsNotifications: "اعلان‌های پیامکی",
      profileSmsNotificationsDesc: "دریافت به‌روزرسانی‌ها از طریق پیامک",
      profileImageSizeError: "اندازه تصویر باید کمتر از 5 مگابایت باشد",
      profileImageUpdateSuccess: "تصویر پروفایل با موفقیت به‌روزرسانی شد",
      profilePasswordChangeSuccess: "رمز عبور با موفقیت تغییر کرد",
      profileEmailUpdateSuccess: "ایمیل با موفقیت به‌روزرسانی شد",
      profileShowEmailForm: "تغییر ایمیل",
      profileHideEmailForm: "مخفی کردن فرم ایمیل",
      profileShowPasswordForm: "تغییر رمز عبور",
      profileHidePasswordForm: "مخفی کردن فرم رمز عبور",
      profilePasswordRequired: "رمز عبور الزامی است",
      profilePasswordChangeError: "خطایی در هنگام تغییر رمز عبور رخ داد",
    },
    preRegister: {
      preRegisterTitle: "پیش ثبت نام",
      fullName: "نام کامل",
      phone: "تلفن",
      age: "سن",
      sportsField: "رشته ورزشی",
      selectSport: "انتخاب رشته ورزشی",
      submit: "ثبت نام",
      required: "این فیلد الزامی است",
      invalidAge: "لطفاً سن معتبر وارد کنید",
      preRegisterSuccess: "پیش ثبت نام موفق! متشکریم.",
      fullNameTooLong: "نام کامل نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد.",
      invalidPhoneNumberFormat: "شماره موبایل باید ۱۱ رقم و عددی باشد.",
      sendEmailFailed: "ارسال ایمیل پیش‌ثبت‌نام با خطا مواجه شد. لطفاً بعداً دوباره تلاش کنید.",
      submissionError: "خطایی در هنگام ثبت نام رخ داد.",
      languageChangeRequired: "لطفاً زبان سایت را به فارسی تغییر دهید تا بتوانید پیش ثبت نام را انجام دهید.",
      football: "فوتبال",
      basketball: "بسکتبال",
      volleyball: "والیبال",
      tennis: "تنیس",
      swimming: "سویینگ",
    },
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: commonResources,
    lng: getInitialLanguage(), // Set initial language
    fallbackLng: 'en',
    supportedLngs: ['en', 'fa'],
    
    // Default namespace is 'blog' for general UI
    defaultNS: 'blog',
    
    // Load blog namespace by default, lazy load others when needed
    ns: ['blog'],
    
    // Define namespaces for lazy loading
    fallbackNS: 'blog',
    
    // Store language preference in localStorage
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },

    // Don't escape special characters in translations
    interpolation: {
      escapeValue: false
    },
    
    // Enable lazy loading of namespaces
    partialBundledLanguages: true,
  });

// Helper function to load specific namespaces when needed
export const loadNamespaces = async (namespaces) => {
  if (!Array.isArray(namespaces)) {
    namespaces = [namespaces];
  }
  
  return i18n.loadNamespaces(namespaces);
};

export default i18n; 