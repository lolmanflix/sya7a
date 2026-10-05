import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';
export type ColorMode = 'light' | 'dark';

interface LanguageThemeContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.brand': 'Wasalt',
    'nav.tagline': 'Transportation platform',
    'nav.features': 'Features',
    'nav.howItWorks': 'How It Works',
    'nav.liveTracking': 'Live Tracking',
    'nav.liveViewBadge': 'Live view',
    'nav.forSchools': 'For Schools',
    'nav.forCompanies': 'For Companies',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.startTrial': 'Start Free Trial',
    'nav.signIn': 'Sign In',
    'nav.dashboard': 'My Dashboard',
    'nav.profile': 'Profile',
    'nav.toggleLanguage': 'العربية',

    // Hero Section
    'hero.headlineMain': 'Smart Transportation Management.',
    'hero.headlineGradient': 'Real-Time Bus Visibility.',
    'hero.subheadline': 'A multi-tenant transportation platform empowering schools, companies, and bus operators with live telemetry, dynamic branding, and dispatch control.',
    'hero.ctaStartTrial': 'Start Free Trial',
    'hero.ctaExplore': 'Explore the Platform',
    'hero.badgeNoCard': 'No credit card required',
    'hero.badgeBuiltFor': 'Built for schools and companies',
    'hero.badgeOperations': 'Operations in one place',
    'hero.controlCenterTitle': 'Wasalt Transportation Control Center',
    'hero.controlCenterSubtitle': 'Illustrative fleet view · organization administrator',
    'hero.liveFleetView': 'Live fleet view',
    'hero.statActiveBuses': 'Active Buses',
    'hero.statActiveBusesDesc': 'Across active routes',
    'hero.statActiveRoutes': 'Active Routes',
    'hero.statActiveRoutesDesc': 'In progress now',
    'hero.statDriversOnline': 'Drivers Online',
    'hero.statDriversOnlineDesc': 'Ready for dispatch',
    'hero.statUpcomingArrivals': 'Upcoming Arrivals',
    'hero.statUpcomingArrivalsDesc': 'Next stop in 4 min',
    'hero.selectedVehicle': 'SELECTED VEHICLE',
    'hero.gpsActive': 'GPS Active',
    'hero.statusLabel': 'Status',
    'hero.etaLabel': 'Est. Arrival',
    'hero.assignedDriver': 'Assigned Driver:',
    'hero.viewRouteDetails': 'View route details in Dashboard',
    'hero.mapBadgeTitle': 'Live Telemetry Map (Cairo & Intercity)',
    'hero.mapBadgeSub': 'Zero-API Map • OpenStreetMap Core',

    // Problem / Solution Section
    'probSol.badge': 'Transportation operations',
    'probSol.title': 'Transportation shouldn’t run on phone calls and spreadsheets.',
    'probSol.subtitle': 'Give transportation teams a single, clear place to understand their fleet.',
    'probSol.withoutTitle': 'Without Wasalt',
    'probSol.withoutSubtitle': 'Fragmented transportation operations',
    'probSol.prob1': 'Unclear bus locations when teams need answers quickly',
    'probSol.prob2': 'Manual driver coordination through phone calls and messages',
    'probSol.prob3': 'Scattered route, stop, and schedule information',
    'probSol.prob4': 'Difficult fleet monitoring across active transportation operations',
    'probSol.prob5': 'No centralized view of buses and route progress',
    'probSol.withTitle': 'With Wasalt',
    'probSol.withSubtitle': 'Centralized fleet operations',
    'probSol.sol1': 'Real-time bus visibility from a centralized fleet view',
    'probSol.sol2': 'Organized routes, stops, drivers, and transportation schedules',
    'probSol.sol3': 'A clear operational picture for transportation administrators',
    'probSol.sol4': 'Role-based access for the people responsible for transportation',
    'probSol.sol5': 'Organization-wide visibility without losing the details',

    // Fleet Experience
    'fleet.badge': 'Illustrative live fleet view',
    'fleet.title': 'See Your Fleet. In Real Time.',
    'fleet.subtitle': 'Know where your buses are, which routes are active, and how transportation operations are progressing — from one centralized dashboard.',
    'fleet.overviewTitle': 'FLEET OVERVIEW',
    'fleet.activeVehicles': 'Active vehicles',
    'fleet.illustrativeData': 'Illustrative data',
    'fleet.productBadge': 'The product view',
    'fleet.dashboardTitle': 'One Dashboard. Your Entire Fleet.',
    'fleet.dashboardSubtitle': 'A transportation control center that brings daily operations together without turning your work into a map app.',
    'fleet.greeting': 'Good morning, Kareem',
    'fleet.overviewHeader': 'Transportation Overview',
    'fleet.routeStatusTitle': 'Route status',
    'fleet.routeStatusSubtitle': 'Morning transport schedule',
    'fleet.tableActiveBuses': 'Active Buses',
    'fleet.thBus': 'Bus',
    'fleet.thRoute': 'Route',
    'fleet.thDriver': 'Driver',
    'fleet.thStatus': 'Status',
    'fleet.thEta': 'ETA',

    // Audience Sections
    'audience.schoolsTitle': 'School Transportation, Under Control.',
    'audience.schoolsSubtitle': 'Give transportation administrators one enterprise-ready place to organize school transportation operations.',
    'audience.companiesTitle': 'Employee Transportation, Without the Guesswork.',
    'audience.companiesSubtitle': 'Coordinate employee transportation with a clear operational view for company transportation teams.',
    'audience.sItem1': 'Manage your fleet',
    'audience.sItem2': 'Monitor route progress',
    'audience.sItem3': 'Manage drivers and assignments',
    'audience.sItem4': 'Track active buses',
    'audience.sItem5': 'Organize stops and routes',
    'audience.sItem6': 'Improve operational visibility',
    'audience.cItem1': 'Employee transportation routes',
    'audience.cItem2': 'Company buses and drivers',
    'audience.cItem3': 'Stops and schedules',
    'audience.cItem4': 'Fleet monitoring',
    'audience.cItem5': 'Route visibility',
    'audience.cItem6': 'Transportation administration',

    // Features Grid
    'features.badge': 'Core Capabilities',
    'features.title': 'Engineered for Modern Enterprise Fleets',
    'features.subtitle': 'The core tools transportation teams need to organize their fleet and understand what is happening now.',

    // How It Works
    'howItWorks.badge': 'How Wasalt Works',
    'howItWorks.title': 'From organization setup to fleet visibility.',
    'howItWorks.subtitle': 'A clear workflow for schools, companies, and transportation organizations.',
    'howItWorks.step1Title': 'Create Your Organization',
    'howItWorks.step1Desc': 'Create a transportation workspace for your school, company, or organization.',
    'howItWorks.step2Title': 'Add Your Fleet',
    'howItWorks.step2Desc': 'Add the buses, drivers, routes, and stops your transportation team manages.',
    'howItWorks.step3Title': 'Connect Drivers',
    'howItWorks.step3Desc': 'Drivers use the supported driver application or device to share their location while assigned.',
    'howItWorks.step4Title': 'Monitor Your Fleet',
    'howItWorks.step4Desc': 'Transportation administrators see active buses, routes, and route progress from one dashboard.',
    'howItWorks.step5Title': 'Manage Operations',
    'howItWorks.step5Desc': 'Use centralized transportation data to coordinate and improve daily operations.',

    // Driver & Ecosystem
    'driver.badge': 'Planned driver workflow',
    'driver.title': 'A connected driver experience.',
    'driver.subtitle': 'Drivers are part of the broader Wasalt ecosystem. This planned workflow illustrates how a supported driver application or device could support route assignments and location sharing.',
    'driver.routeViewTitle': 'Driver route view',
    'driver.routeViewSubtitle': 'Planned conceptual workflow',
    'driver.task1': 'Start an assigned route',
    'driver.task2': 'Share live location while assigned',
    'driver.task3': 'View assigned route and upcoming stops',
    'driver.task4': 'Update route status',

    'ecosystem.badge': 'Built for organizations',
    'ecosystem.title': 'One account. Multiple transportation operations.',
    'ecosystem.subtitle': 'Manage multiple schools, companies, branches, or transportation organizations with organization-specific teams, branding, and access.',
    'ecosystem.schoolTitle': 'School',
    'ecosystem.schoolDesc': 'Transportation manager → Drivers → Buses → Routes → Stops → Students',
    'ecosystem.companyTitle': 'Company',
    'ecosystem.companyDesc': 'Transportation manager → Drivers → Buses → Routes → Stops → Employees',
    'ecosystem.feat1Title': 'Organization workspaces',
    'ecosystem.feat1Desc': 'Separate transportation operations, teams, and fleets.',
    'ecosystem.feat2Title': 'Role-based access',
    'ecosystem.feat2Desc': 'Appropriate access for administrators and staff.',
    'ecosystem.feat3Title': 'Web and desktop',
    'ecosystem.feat3Desc': 'Run the control center where your operations team works.',

    // Live Theme Demo
    'theme.badge': 'Organization branding',
    'theme.title': 'Every organization gets its own transportation workspace.',
    'theme.subtitle': 'Keep the existing brand controls while giving every school or company a transportation workspace that feels like their own.',
    'theme.chooseTitle': 'Choose an organization theme',
    'theme.chooseSubtitle': 'Organizations can choose a theme for the transportation staff environment they manage.',
    'theme.customColor': 'Custom organization color',
    'theme.previewTitle': 'Live Theme Preview',
    'theme.previewSubtitle': 'Tokens update dynamically in real time',

    // Pricing Section
    'pricing.badge': 'Transparent Pricing',
    'pricing.title': 'Plans for Every Transportation Operation',
    'pricing.subtitle': 'Start with one transportation organization or scale across schools, companies, and fleets.',
    'pricing.monthly': 'Monthly Billing',
    'pricing.annual': 'Annual Billing',
    'pricing.save20': 'Save 20%',
    'pricing.perMonth': '/mo',
    'pricing.starterName': 'Starter',
    'pricing.starterTagline': 'For smaller schools and transportation organizations.',
    'pricing.proName': 'Professional',
    'pricing.proTagline': 'For growing transportation operations and teams.',
    'pricing.enterpriseName': 'Enterprise',
    'pricing.enterpriseTagline': 'For larger organizations and transportation fleets.',
    'pricing.starterCta': 'Start 14-Day Free Trial',
    'pricing.proCta': 'Launch Pro Workspace',
    'pricing.enterpriseCta': 'Contact Enterprise Sales',

    // FAQ Section
    'faq.badge': 'Answers & Clarity',
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Answers about Wasalt’s transportation platform and organization-level operations.',

    // Final CTA Banner
    'cta.pill': 'Bring your transportation operations together',
    'cta.title': 'Ready to see your transportation operations clearly?',
    'cta.subtitle': 'Create an organization workspace for your buses, drivers, routes, and transportation team.',
    'cta.button': 'Start Free Trial',
    'cta.benefit1': 'No credit card required',
    'cta.benefit2': 'Cancel anytime',
    'cta.benefit3': 'Organization-level access controls',

    // Footer
    'footer.description': 'A multi-tenant transportation platform empowering schools, companies, and bus operators with live telemetry, dynamic branding, and dispatch control.',
    'footer.builtFor': 'Built for transportation operations',
    'footer.product': 'Product',
    'footer.solutions': 'Solutions',
    'footer.security': 'Security',
    'footer.schoolTrans': 'School Transportation',
    'footer.employeeTrans': 'Employee Transportation',
    'footer.transOrgs': 'Transportation Organizations',
    'footer.multiOrg': 'Multi-Organization Operations',
    'footer.tenantGuard': 'Multi-Tenant Guard',
    'footer.wcag': 'WCAG 2.2 AA target',
    'footer.dataBoundaries': 'Organization data boundaries and access controls',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',

    // Onboarding & Plan Selection
    'plan.selectTitle': 'Choose the Perfect Plan for Your Business',
    'plan.selectSub': 'Select a plan to complete your company workspace registration and download the desktop app.',
    'plan.payAndDownload': 'Proceed to Pay & Download',
    'download.title': 'Download Wasalt Desktop Dashboard',
    'download.sub': 'Your company workspace is active! Download the desktop client for your operating system.',
    'download.mac': 'Download for macOS (Apple Silicon & Intel)',
    'download.windows': 'Download for Windows (.exe)',
    'download.linux': 'Download for Linux (.AppImage)',
    'download.web': 'Launch Web Dashboard',
    'download.successBadge': 'Payment Successful & Company Workspace Activated!',

    // Common
    'common.back': 'Back',
    'common.next': 'Next',
    'common.cancel': 'Cancel',
    'common.done': 'Done',
    'common.selected': 'Selected',
    'common.choosePlan': 'Select'
  },
  ar: {
    // Navigation
    'nav.brand': 'وصل',
    'nav.tagline': 'منصة إدارة النقل والأسطول',
    'nav.features': 'المميزات',
    'nav.howItWorks': 'كيف يعمل',
    'nav.liveTracking': 'التتبع المباشر',
    'nav.liveViewBadge': 'بث مباشر',
    'nav.forSchools': 'للمدارس',
    'nav.forCompanies': 'للشركات',
    'nav.pricing': 'الأسعار',
    'nav.faq': 'الأسئلة الشائعة',
    'nav.startTrial': 'ابدأ التجربة المجانية',
    'nav.signIn': 'تسجيل الدخول',
    'nav.dashboard': 'لوحتي',
    'nav.profile': 'الملف الشخصي',
    'nav.toggleLanguage': 'English',

    // Hero Section
    'hero.headlineMain': 'إدارة ذكية للنقل المدرسي والمؤسسي.',
    'hero.headlineGradient': 'رؤية كاملة لحركة الحافلات لحظياً.',
    'hero.subheadline': 'منصة سحابية متطورة تمكن المدارس والشركات ومشغلي الحافلات من التتبع المباشر، وتخصيص الهوية البصرية، وإدارة توجيه الرحلات باحترافية.',
    'hero.ctaStartTrial': 'ابدأ التجربة المجانية',
    'hero.ctaExplore': 'استكشف المنصة',
    'hero.badgeNoCard': 'بدون بطاقة ائتمان',
    'hero.badgeBuiltFor': 'مصمم للمدارس والشركات',
    'hero.badgeOperations': 'العمليات في مكان واحد',
    'hero.controlCenterTitle': 'مركز تحكم وصل لإدارة النقل',
    'hero.controlCenterSubtitle': 'عرض توضيحي للأسطول · إدارة المؤسسة',
    'hero.liveFleetView': 'عرض الأسطول المباشر',
    'hero.statActiveBuses': 'الحافلات النشطة',
    'hero.statActiveBusesDesc': 'عبر المسارات الفعالة',
    'hero.statActiveRoutes': 'المسارات النشطة',
    'hero.statActiveRoutesDesc': 'قيد التنفيذ الآن',
    'hero.statDriversOnline': 'السائقون المتصلون',
    'hero.statDriversOnlineDesc': 'جاهزون للانطلاق',
    'hero.statUpcomingArrivals': 'الوصول القادم',
    'hero.statUpcomingArrivalsDesc': 'المحطة القادمة خلال 4 دقائق',
    'hero.selectedVehicle': 'الحافلة المحددة',
    'hero.gpsActive': 'GPS متصل',
    'hero.statusLabel': 'الحالة',
    'hero.etaLabel': 'الوقت المتوقع للوصول',
    'hero.assignedDriver': 'السائق المعين:',
    'hero.viewRouteDetails': 'عرض تفاصيل المسار في لوحة التحكم',
    'hero.mapBadgeTitle': 'خريطة التتبع المباشر (القاهرة والمحافظات)',
    'hero.mapBadgeSub': 'خريطة مدمجة عالية الدقة • نواة OpenStreetMap',

    // Problem / Solution Section
    'probSol.badge': 'عمليات النقل',
    'probSol.title': 'إدارة النقل لا ينبغي أن تعتمد على الاتصالات الهاتفية وجداول الإكسيل.',
    'probSol.subtitle': 'امنح فرق العمليات مكاناً واحداً واضحاً لمعرفة ومتابعة الأسطول بالكامل.',
    'probSol.withoutTitle': 'بدون منصة وصل',
    'probSol.withoutSubtitle': 'عمليات نقل مشتتة وغير منسقة',
    'probSol.prob1': 'مواقع غير دقيقة للحافلات عند الحاجة إلى إجابات سريعة',
    'probSol.prob2': 'تنسيق يدوي مع السائقين عبر المكالمات والرسائل',
    'probSol.prob3': 'تشتت معلومات المسارات ومحطات التوقف وجداول المواعيد',
    'probSol.prob4': 'صعوبة مراقبة الأسطول أثناء ساعات الذروة والرحلات النشطة',
    'probSol.prob5': 'غياب رؤية مركزية شاملة لتقدم الحافلات على خطوط السير',
    'probSol.withTitle': 'مع منصة وصل',
    'probSol.withSubtitle': 'عمليات أسطول مركزية ومنظمة',
    'probSol.sol1': 'رؤية لحظية ومباشرة لمواقع الحافلات من شاشة واحدة',
    'probSol.sol2': 'تنظيم متكامل للمسارات والمحطات والسائقين وجداول الرحلات',
    'probSol.sol3': 'صورة تشغيلية واضحة ومحدثة لمسؤولي النقل',
    'probSol.sol4': 'صلاحيات وصول وأدوار محددة لكل فرد مسؤول في الفريق',
    'probSol.sol5': 'رؤية شاملة على مستوى المؤسسة مع الاحتفاظ بكافة التفاصيل الدقيقة',

    // Fleet Experience
    'fleet.badge': 'عرض توضيحي مباشر للأسطول',
    'fleet.title': 'شاهد أسطولك بالكامل. في الوقت الفعلي.',
    'fleet.subtitle': 'تعرّف على مواقع الحافلات بدقة، والمسارات النشطة حالياً، وسير عمليات النقل لحظة بلحظة — من لوحة تحكم واحدة متكاملة.',
    'fleet.overviewTitle': 'نظرة عامة على الأسطول',
    'fleet.activeVehicles': 'المركبات النشطة',
    'fleet.illustrativeData': 'بيانات توضيحية',
    'fleet.productBadge': 'معاينة المنتج',
    'fleet.dashboardTitle': 'لوحة تحكم واحدة. لأسطولك بأكمله.',
    'fleet.dashboardSubtitle': 'مركز تحكم في عمليات النقل يجمع المهام اليومية بكفاءة وسهولة.',
    'fleet.greeting': 'صباح الخير، كريم',
    'fleet.overviewHeader': 'نظرة عامة على حركة النقل',
    'fleet.routeStatusTitle': 'حالة المسار',
    'fleet.routeStatusSubtitle': 'جدول رحلات الصباح',
    'fleet.tableActiveBuses': 'الحافلات الفعالة',
    'fleet.thBus': 'الحافلة',
    'fleet.thRoute': 'المسار',
    'fleet.thDriver': 'السائق',
    'fleet.thStatus': 'الحالة',
    'fleet.thEta': 'الوقت المتوقع',

    // Audience Sections
    'audience.schoolsTitle': 'نقل مدرسي تحت السيطرة والاطمئنان.',
    'audience.schoolsSubtitle': 'وفر لمسؤولي النقل المدرسي منصة احترافية لتنظيم حركة الباصات ونقل الطلاب بأمان.',
    'audience.companiesTitle': 'نقل الموظفين بدقة وسلاسة.',
    'audience.companiesSubtitle': 'نسق مواعيد وحافلات الموظفين برؤية تشغيلية دقيقة ومريحة لفريق العمل.',
    'audience.sItem1': 'إدارة الأسطول المدرسي بالكامل',
    'audience.sItem2': 'متابعة تقدم المسار ومحطات النزول',
    'audience.sItem3': 'إدارة السائقين وتعيين الباصات',
    'audience.sItem4': 'تتبع الباصات الفعالة لحظة بلحظة',
    'audience.sItem5': 'تنظيم المحطات وجداول الصباح والمساء',
    'audience.sItem6': 'رفع كفاءة واطمئنان أولياء الأمور',
    'audience.cItem1': 'مسارات نقل الموظفين اليومية',
    'audience.cItem2': 'حافلات وسائقو الشركة',
    'audience.cItem3': 'مواعيد المحطات ونقاط التجمع',
    'audience.cItem4': 'مراقبة التزام الأسطول بالمواعيد',
    'audience.cItem5': 'وضوح مسارات التحرك والوصول',
    'audience.cItem6': 'تقارير إدارة النقل والتشغيل',

    // Features Grid
    'features.badge': 'القدرات الأساسية',
    'features.title': 'مصمم خصيصاً لأساطيل المؤسسات الحديثة',
    'features.subtitle': 'الأدوات الجوهرية التي تحتاجها فرق النقل لتنظيم الأسطول ومتابعة ما يحدث لحظة بلحظة.',

    // How It Works
    'howItWorks.badge': 'كيف تعمل المنصة',
    'howItWorks.title': 'من إعداد المؤسسة إلى الرؤية اللحظية للأسطول.',
    'howItWorks.subtitle': 'خطوات واضحة وسريعة للمدارس والشركات ومؤسسات النقل.',
    'howItWorks.step1Title': 'أنشئ حساب مؤسستك',
    'howItWorks.step1Desc': 'قم بإنشاء مساحة عمل مخصصة لمدرستك أو شركتك في ثوانٍ.',
    'howItWorks.step2Title': 'أضف أسطولك',
    'howItWorks.step2Desc': 'سجل الحافلات، السائقين، المسارات، والمحطات التي تديرها.',
    'howItWorks.step3Title': 'ربط السائقين',
    'howItWorks.step3Desc': 'يشارك السائقون مواقعهم المباشرة أثناء الرحلات المعينة لهم.',
    'howItWorks.step4Title': 'راقب أسطولك',
    'howItWorks.step4Desc': 'يشاهد مسؤولو النقل الحافلات النشطة وسير الرحلات من شاشة واحدة.',
    'howItWorks.step5Title': 'إدارة العمليات',
    'howItWorks.step5Desc': 'استفد من البيانات المركزية لتحسين جودة ومواعيد الرحلات باستمرار.',

    // Driver & Ecosystem
    'driver.badge': 'تطبيق السائق',
    'driver.title': 'تجربة سلسة ومتصلة للسائقين.',
    'driver.subtitle': 'السائقون جزء محوري في منظومة وصل. يدعم التطبيق التوجيه ومشاركة الموقع المباشر وتأكيد المحطات.',
    'driver.routeViewTitle': 'شاشة مسار السائق',
    'driver.routeViewSubtitle': 'تجربة استخدام مبسطة وسريعة',
    'driver.task1': 'بدء الرحلة والمسار المعين',
    'driver.task2': 'مشاركة الموقع المباشر تلقائياً أثناء القيادة',
    'driver.task3': 'معاينة المحطات القادمة ومواعيد الوصول',
    'driver.task4': 'تحديث حالة المسار فور الوصول',

    'ecosystem.badge': 'مصمم للمؤسسات متعددة الفروع',
    'ecosystem.title': 'حساب واحد. عمليات نقل متعددة.',
    'ecosystem.subtitle': 'أدر عدة مدارس، شركات، أو فروع مختلفة مع استقلالية تامة لكل فرع في الصلاحيات والهوية البصرية.',
    'ecosystem.schoolTitle': 'المدارس والجامعات',
    'ecosystem.schoolDesc': 'مدير النقل ← السائقون ← الحافلات ← المسارات ← المحطات ← الطلاب',
    'ecosystem.companyTitle': 'الشركات والمصانع',
    'ecosystem.companyDesc': 'مدير العمليات ← السائقون ← الحافلات ← المسارات ← المحطات ← الموظفون',
    'ecosystem.feat1Title': 'مساحات عمل مستقلة',
    'ecosystem.feat1Desc': 'فصل تام لبيانات الأسطول والفرق والعمليات.',
    'ecosystem.feat2Title': 'صلاحيات وصول دقيقة',
    'ecosystem.feat2Desc': 'صلاحيات مخصصة للمديرين والمشرفين وموظفي الاستقبال.',
    'ecosystem.feat3Title': 'تطبيق ويب وسطح مكتب',
    'ecosystem.feat3Desc': 'شغّل مركز التحكم على الويب أو كبرنامج سطح مكتب سريع.',

    // Live Theme Demo
    'theme.badge': 'الهوية البصرية للمؤسسة',
    'theme.title': 'كل مؤسسة تحصل على مساحة عمل بألوانها وشعارها الخاص.',
    'theme.subtitle': 'امنح كل مدرسة أو شركة مساحة عمل تعكس هويتها البصرية وتوفر تجربة متناسقة لفرق العمل.',
    'theme.chooseTitle': 'اختر سمة المؤسسة',
    'theme.chooseSubtitle': 'يمكن للمؤسسات اختيار لوحة ألوان تناسب هويتها الرسمية.',
    'theme.customColor': 'لون مخصص للمؤسسة',
    'theme.previewTitle': 'معاينة حية للمظهر',
    'theme.previewSubtitle': 'تتحدث الألوان والتباين فورياً في الوقت الفعلي',

    // Pricing Section
    'pricing.badge': 'خطط أسعار شفافة',
    'pricing.title': 'خطط تناسب جميع أحجام أساطيل النقل',
    'pricing.subtitle': 'ابدأ بمؤسسة واحدة أو توسع لتغطية شبكة مدارس وشركات متعددة الفروع.',
    'pricing.monthly': 'اشتراك شهري',
    'pricing.annual': 'اشتراك سنوي',
    'pricing.save20': 'وفر 20%',
    'pricing.perMonth': '/شهرياً',
    'pricing.starterName': 'البداية',
    'pricing.starterTagline': 'مثالية للمدارس والمؤسسات الصغيرة.',
    'pricing.proName': 'المحترف',
    'pricing.proTagline': 'للعمليات والشركات المتنامية وأساطيل النقل المتوسطة.',
    'pricing.enterpriseName': 'المؤسسات الكبرى',
    'pricing.enterpriseTagline': 'للأساطيل الكبيرة والشركات متعددة الفروع.',
    'pricing.starterCta': 'ابدأ تجربة مجانية 14 يوماً',
    'pricing.proCta': 'إطلاق مساحة المحترف',
    'pricing.enterpriseCta': 'تواصل مع فريق المبيعات',

    // FAQ Section
    'faq.badge': 'إجابات وتوضيحات',
    'faq.title': 'الأسئلة الأكثر شيوعاً',
    'faq.subtitle': 'إجابات واضحة حول منصة وصل وعمليات إدارة النقل المؤسسي.',

    // Final CTA Banner
    'cta.pill': 'اجمع كافة عمليات أسطولك في منصة واحدة',
    'cta.title': 'جاهز لتنظيم وإدارة أسطولك بأعلى درجات الوضوح؟',
    'cta.subtitle': 'أنشئ مساحة عمل متكاملة لحافلاتك وسائقيك ومساراتك وفريق النقل اليوم.',
    'cta.button': 'ابدأ التجربة المجانية',
    'cta.benefit1': 'بدون بطاقة ائتمان',
    'cta.benefit2': 'إلغاء في أي وقت',
    'cta.benefit3': 'حماية وأمان عالي للبيانات',

    // Footer
    'footer.description': 'المنصة السحابية المتقدمة لإدارة النقل وتتبع الأساطيل للمدارس والشركات ومشغلي الحافلات مع دعم الهوية البصرية المخصصة.',
    'footer.builtFor': 'مصمم لعمليات النقل الاحترافية',
    'footer.product': 'المنتج',
    'footer.solutions': 'الحلول',
    'footer.security': 'الأمان والحماية',
    'footer.schoolTrans': 'النقل المدرسي والجامعي',
    'footer.employeeTrans': 'نقل الموظفين والكوادر',
    'footer.transOrgs': 'شركات النقل والرحلات',
    'footer.multiOrg': 'العمليات متعددة المؤسسات والفروع',
    'footer.tenantGuard': 'عزل وحماية بيانات كل مؤسسة',
    'footer.wcag': 'معايير إمكانية الوصول والتصميم',
    'footer.dataBoundaries': 'حدود بيانات وصلاحيات دقيقة لكل منظمة',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',

    // Onboarding & Plan Selection
    'plan.selectTitle': 'اختر الخطة المناسبة لشركتك',
    'plan.selectSub': 'اختر خطة الاشتراك لإكمال تسجيل شركة وتنزيل تطبيق سطح المكتب.',
    'plan.payAndDownload': 'المتابعة للدفع والتنزيل',
    'download.title': 'تنزيل لوحة تحكم وصل للكمبيوتر',
    'download.sub': 'تم تفعيل مساحة عمل شركتك بنجاح! قم بتنزيل برنامج سطح المكتب لنظام التشغيل الخاص بك.',
    'download.mac': 'تنزيل لنظام ماك macOS (Apple Silicon & Intel)',
    'download.windows': 'تنزيل لنظام ويندوز Windows (.exe)',
    'download.linux': 'تنزيل لنظام لينكس Linux (.AppImage)',
    'download.web': 'فتح لوحة التحكم على الويب',
    'download.successBadge': 'تم الدفع وتفعيل مساحة عمل الشركة بنجاح!',

    // Common
    'common.back': 'السابق',
    'common.next': 'التالي',
    'common.cancel': 'إلغاء',
    'common.done': 'تم',
    'common.selected': 'تم الاختيار',
    'common.choosePlan': 'اختيار الخطة'
  }
};

const LanguageThemeContext = createContext<LanguageThemeContextType | undefined>(undefined);

export const LanguageThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('wasalt_lang') as Language) || 'ar'; // Defaulting to Arabic or saved choice
  });

  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    return (localStorage.getItem('wasalt_color_mode') as ColorMode) || 'light';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem('wasalt_lang', language);
  }, [language, dir]);

  useEffect(() => {
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('wasalt_color_mode', colorMode);
  }, [colorMode]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const setColorMode = (mode: ColorMode) => setColorModeState(mode);
  const toggleColorMode = () => setColorModeState((prev) => (prev === 'light' ? 'dark' : 'light'));

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageThemeContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        t,
        colorMode,
        setColorMode,
        toggleColorMode
      }}
    >
      {children}
    </LanguageThemeContext.Provider>
  );
};

export const useLanguageTheme = (): LanguageThemeContextType => {
  const ctx = useContext(LanguageThemeContext);
  if (!ctx) {
    throw new Error('useLanguageTheme must be used within LanguageThemeProvider');
  }
  return ctx;
};
