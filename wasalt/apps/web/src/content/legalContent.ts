/**
 * Legal page content — Privacy Policy & Terms of Service (EN + AR).
 * Kept outside LanguageThemeContext so the translation dictionary stays lean.
 */

export type LegalDocId = 'privacy' | 'terms';

export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  contactHeading: string;
  contact: string;
}

export const LEGAL_CONTENT: Record<LegalDocId, Record<'en' | 'ar', LegalDoc>> = {
  privacy: {
    en: {
      title: 'Privacy Policy',
      updated: 'Last updated: October 3, 2026',
      intro:
        'This Privacy Policy explains how Wasalt ("we", "us") collects, uses, and protects your information when you use the Wasalt transportation management platform, website, and related services.',
      sections: [
        {
          heading: '1. Information We Collect',
          body: 'Account information (name, email address, organization details), workspace data you create (companies, buses, drivers, routes, stops), billing-related records for subscriptions, and technical data such as device type, browser, and usage logs. Live tracking features process vehicle location data only while a bus or driver is assigned to an active route.',
        },
        {
          heading: '2. How We Use Your Information',
          body: 'We use your information to provide and operate the platform, manage subscriptions and trials, send transactional notifications, provide customer support, protect the security of the service, and improve product features. We do not sell your personal information.',
        },
        {
          heading: '3. Multi-Tenant Data Isolation',
          body: 'Wasalt is a multi-tenant platform. Your organization data is logically separated from other organizations, and access is restricted by role. Only administrators and members you invite into your workspace can see its data, subject to Firebase Realtime Database security rules.',
        },
        {
          heading: '4. Sharing & Service Providers',
          body: 'We share data only with infrastructure providers that power the service — Google Firebase (authentication, hosting, and realtime database) and OpenStreetMap-based mapping services — under contracts that limit their use of your data to providing those services.',
        },
        {
          heading: '5. Data Retention & Deletion',
          body: 'We keep your data for as long as your account is active or as needed to provide the service, comply with legal obligations, and resolve disputes. You may request deletion of your account and associated data at any time by contacting us.',
        },
        {
          heading: '6. Security',
          body: 'Data is encrypted in transit (HTTPS/TLS). Access to production data is limited to authorized personnel and is governed by role-based authorization rules. We regularly review our security practices to protect your information.',
        },
        {
          heading: '7. Cookies & Local Storage',
          body: 'We use essential cookies and browser local storage to keep you signed in and remember your preferences (language, theme). These are required for the platform to work and cannot be disabled without breaking sign-in.',
        },
        {
          heading: '8. Your Rights',
          body: 'You may access, correct, or request deletion of your personal information at any time from your profile settings or by contacting us. If you are located in Egypt or the EU, you may also lodge a complaint with your local data protection authority.',
        },
      ],
      contactHeading: 'Contact Us',
      contact:
        'Questions about this policy? Email privacy@wasalt.io or write to Wasalt Platform, Cairo, Egypt.',
    },
    ar: {
      title: 'سياسة الخصوصية',
      updated: 'آخر تحديث: 3 أكتوبر 2026',
      intro:
        'توضح سياسة الخصوصية هذه كيفية جمع "وسالت" ("نحن") لبياناتك واستخدامها وحمايتها عند استخدامك لمنصة إدارة النقل الخاصة بوسالت والموقع الإلكتروني والخدمات ذات الصلة.',
      sections: [
        {
          heading: '١. المعلومات التي نجمعها',
          body: 'معلومات الحساب (الاسم والبريد الإلكتروني وبيانات المؤسسة)، وبيانات مساحة العمل التي تنشئها (الشركات والباصات والسائقون وخطوط السير والمحطات)، والسجلات المتعلقة بالفوترة للاشتراكات، والبيانات التقنية مثل نوع الجهاز والمتصفح وسجلات الاستخدام. تُعالج بيانات مواقع المركبات عبر ميزة التتبع الحي فقط أثناء قيام الباص أو السائق بمسار نشط.',
        },
        {
          heading: '٢. كيف نستخدم معلوماتك',
          body: 'نستخدم معلوماتك لتشغيل المنصة وإتاحتها، وإدارة الاشتراكات والفترات التجريبية، وإرسال الإشعارات التشغيلية، وتقديم الدعم الفني، وحماية أمن الخدمة، وتحسين ميزات المنتج. لا نبيع معلوماتك الشخصية.',
        },
        {
          heading: '٣. عزل بيانات المستأجرين المتعددين',
          body: 'وسالت منصة متعددة المستأجرين؛ يتم فصل بيانات مؤسستك منطقياً عن غيرها، والوصول إليها مقيّد حسب الدور. لا يستطيع رؤيتها سوى المسؤولين والأعضاء الذين تدعوهم إلى مساحة عملك، وفقاً لقواعد أمان قاعدة بيانات Firebase اللحظية.',
        },
        {
          heading: '٤. المشاركة ومزودو الخدمة',
          body: 'نشترك البيانات فقط مع مزودي البنية التحتية الذين يشغّلون الخدمة — Google Firebase (المصادقة والاستضافة وقاعدة البيانات اللحظية) وخدمات الخرائط المبنية على OpenStreetMap — بعقود تحدّ من استخدامهم لبياناتك تقديم تلك الخدمات فقط.',
        },
        {
          heading: '٥. الاحتفاظ بالبيانات وحذفها',
          body: 'نحتفظ ببياناتك طالما كان حسابك نشطاً أو لتقديم الخدمة، أو للامتثال للالتزامات القانونية، أو لتسوية النزاعات. يمكنك طلب حذف حسابك وبياناته المرتبطة في أي وقت عبر التواصل معنا.',
        },
        {
          heading: '٦. الأمان',
          body: 'تُنقل البيانات مشفرة (HTTPS/TLS). الوصول إلى بيانات الإنتاج محدود بالأشخاص المصرح لهم ويخضع لقواعد تفويض قائمة على الأدوار. نراجع ممارسات الأمن لدينا بانتظام لحماية معلوماتك.',
        },
        {
          heading: '٧. ملفات تعريف الارتباط والتخزين المحلي',
          body: 'نستخدم ملفات تعريف الارتعاط الضرورية وتخزين المتصفح لإبقائك مسجّلاً وحفظ تفضيلاتك (اللغة والمظهر). هذه مطلوبة لعمل المنصة ولا يمكن تعطيلها دون تعطيل تسجيل الدخول.',
        },
        {
          heading: '٨. حقوقك',
          body: 'يمكنك الوصول إلى معلوماتك الشخصية أو تصحيحها أو طلب حذفها في أي وقت من إعدادات ملفك الشخصي أو عبر التواصل معنا. وإذا كنت في مصر أو الاتحاد الأوروبي، يمكنك أيضاً تقديم شكوى إلى جهاز حماية البيانات المحلي.',
        },
      ],
      contactHeading: 'تواصل معنا',
      contact:
        'لديك أسئلة حول هذه السياسة؟ راسلنا على privacy@wasalt.io أو إلى منصة وسالت، القاهرة، مصر.',
    },
  },
  terms: {
    en: {
      title: 'Terms of Service',
      updated: 'Last updated: October 3, 2026',
      intro:
        'These Terms of Service ("Terms") govern your access to and use of the Wasalt transportation management platform. By creating an account or using the service, you agree to these Terms.',
      sections: [
        {
          heading: '1. Accounts & Registration',
          body: 'You must provide accurate information when creating an account and keep your credentials confidential. You are responsible for all activity that happens under your account, including actions taken by members you invite into your workspace.',
        },
        {
          heading: '2. Free Trial',
          body: 'New workspaces start with a 14-day free trial of the selected plan. No payment is charged during the trial. If you do not activate a subscription before the trial ends, access may be limited until a plan is selected.',
        },
        {
          heading: '3. Billing & Payment',
          body: 'Paid subscriptions are priced in Egyptian Pounds (EGP) per month, billed according to the selected cycle (monthly or annual). Payment is made via bank transfer or Vodafone Cash, and the subscription is activated after Wasalt confirms the payment. Prices may change with advance notice; changes apply at your next renewal.',
        },
        {
          heading: '4. Acceptable Use',
          body: 'You agree not to misuse the service — including attempting to access data of other organizations, disrupting the service, reverse engineering the platform except where permitted by law, or using Wasalt for any unlawful purpose.',
        },
        {
          heading: '5. Customer Data',
          body: 'You retain ownership of the data you put into Wasalt. You grant us the license needed to store and process that data solely to provide the service to you. You are responsible for the accuracy of your data and for managing access for your team.',
        },
        {
          heading: '6. Intellectual Property',
          body: 'Wasalt, its logos, design, and software are owned by Wasalt Platform and are protected by applicable intellectual property laws. These Terms do not grant you any right to our intellectual property beyond the limited use of the service.',
        },
        {
          heading: '7. Third-Party Services',
          body: 'The service integrates third-party components including Google Firebase and OpenStreetMap. Their use is governed by their own terms and policies, and we are not responsible for third-party content or availability.',
        },
        {
          heading: '8. Suspension & Termination',
          body: 'You may cancel your subscription at any time; service continues until the end of the paid period. We may suspend or terminate access for material breach of these Terms, with notice where reasonably possible.',
        },
        {
          heading: '9. Disclaimer & Limitation of Liability',
          body: 'The service is provided "as is" without warranties of any kind to the extent permitted by law. To the maximum extent permitted, Wasalt is not liable for indirect, incidental, or consequential damages, and our total liability is limited to the amount you paid in the 12 months before the claim.',
        },
        {
          heading: '10. Governing Law',
          body: 'These Terms are governed by the laws of the Arab Republic of Egypt, and the courts of Cairo have exclusive jurisdiction over any dispute arising from them.',
        },
      ],
      contactHeading: 'Contact Us',
      contact: 'Questions about these Terms? Email legal@wasalt.io or write to Wasalt Platform, Cairo, Egypt.',
    },
    ar: {
      title: 'شروط الخدمة',
      updated: 'آخر تحديث: 3 أكتوبر 2026',
      intro:
        'تحكم شروط الخدمة هذه ("الشروط") استخدامك ووصولك لمنصة وسالت لإدارة النقل. بإنشائك حساباً أو باستخدامك للخدمة، فإنك توافق على هذه الشروط.',
      sections: [
        {
          heading: '١. الحسابات والتسجيل',
          body: 'يجب تقديم معلومات صحيحة عند إنشاء الحساب والحفاظ على سرية بيانات الدخول. أنت مسؤول عن كل نشاط يحدث تحت حسابك، بما في ذلك أفعال الأعضاء الذين تدعوهم إلى مساحة عملك.',
        },
        {
          heading: '٢. الفترة التجريبية المجانية',
          body: 'تبدأ مساحات العمل الجديدة بفترة تجريبية مجانية لمدة 14 يوماً للخطة المختارة. لا يُخصم أي مبلغ أثناء التجربة. إذا لم تفعّل اشتراكاً قبل انتهاء التجربة، قد يُقتصر الوصول حتى اختيار خطة.',
        },
        {
          heading: '٣. الفوترة والدفع',
          body: 'الاشتراكات المدفوعة تُسعّر بالجنيه المصري شهرياً وتُفوتر وفق الدورة المختارة (شهرية أو سنوية). يتم الدفع عبر تحويل بنكي أو فودافون كاش، ويُفعّل الاشتراك بعد تأكيد وسالت للدفع. قد تتغير الأسعار بإشعار مسبق وتُطبَّق عند التجديد التالي.',
        },
        {
          heading: '٤. الاستخدام المقبول',
          body: 'تتعهد بعدم سوء استخدام الخدمة — بما في ذلك محاولة الوصول لبيانات مؤسسات أخرى، أو تعطيل الخدمة، أو هندسة المنصة عكسياً ما لم يسمح به القانون، أو استخدام وسالت لأي غرض غير قانوني.',
        },
        {
          heading: '٥. بيانات العميل',
          body: 'تبقى ملكيتك لبياناتك التي تُدخلها في وسالت. تمنحنا الترخيص اللازم لتخزين معالجتها لتوفير الخدمة لك فقط. أنت مسؤول عن دقة بياناتك وعن إدارة وصول فريقك.',
        },
        {
          heading: '٦. الملكية الفكرية',
          body: 'منصة وسالت وشعاراتها وتصميمها وبرمجياتها ملك لمنصة وسالت ومحمية بقوانين الملكية الفكرية المعمول بها. لا تمنحك هذه الشروط أي حق في ملكيتنا يتجاوز الاستخدام المحدود للخدمة.',
        },
        {
          heading: '٧. خدمات طرف ثالث',
          body: 'تشتمل الخدمة على مكونات من أطراف ثالثة تشمل Google Firebase وOpenStreetMap. استخدامها يخضع لشروطها وسياساتها، ولسنا مسؤولين عن محتوى أو توفر أطراف ثالثة.',
        },
        {
          heading: '٨. التعليق والإنهاء',
          body: 'يمكنك إلغاء اشتراكك في أي وقت وتستمر الخدمة حتى نهاية الفترة المدفوعة. يجوز لنا تعليق أو إنهاء الوصول عند إخلال جوهري بهذه الشروط، مع إشعار متى كان ذلك ممكناً.',
        },
        {
          heading: '٩. إخلاء المسؤولية وحدود المسؤولية',
          body: 'تُقدَّم الخدمة "كما هي" دون أي ضمانات إلى الحد المسموح به قانوناً. وبحد أقصى يسمح به القانون، لا تتحمل وسالت أي أضرار غير مباشرة أو عرضية أو تبعية، وتُقتصر مسؤوليتها الإجمالية على المبلغ الذي دفعته خلال الاثني عشر شهراً السابقة للمطالبة.',
        },
        {
          heading: '١٠. القانون الواجب التطبيق',
          body: 'تخضع هذه الشروط لقوانين جمهورية مصر العربية، ولمحاكم القاهرة اختصاص حصري بأي نزاع ينشأ عنها.',
        },
      ],
      contactHeading: 'تواصل معنا',
      contact: 'لديك أسئلة حول هذه الشروط؟ راسلنا على legal@wasalt.io أو إلى منصة وسالت، القاهرة، مصر.',
    },
  },
};
