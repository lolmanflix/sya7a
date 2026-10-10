/** Security & system hygiene page strings (AR). */
export default {
  'security.title': 'الأمن ونظافة النظام',
  'security.subtitle': 'التحكم في الوصول القائم على الأدوار وفحوصات سلامة قاعدة البيانات وتوصيات القواعد.',
  'security.rbacTitle': 'التحكم في الوصول القائم على الأدوار (RBAC)',
  'security.rbacSubtitle': 'حدود امتيازات صارمة متعددة المستأجرين',
  'security.superAdminRole': 'المدير العام',
  'security.unrestricted': 'بلا قيود',
  'security.superAdminDesc':
    'صلاحية كاملة عبر الهيئات النقلية السبع وإعادة تعيين خطوط السائقين وإنهاء البث المباشر وإنشاء الشركات.',
  'security.dispatcherRole': 'منسّق الشركة (مثال: مسؤول CTA)',
  'security.tenantScoped': 'محدود بالمستأجر',
  'security.dispatcherDesc':
    'مقيّد بدومين المشغّل فقط (مثال: @cta.eg). يمكنه إنشاء المسارات وتعيين السائقين التابعة لشركته فقط.',
  'security.hygieneTitle': 'نظافة قاعدة البيانات وكشف الشذوذ',
  'security.hygieneSubtitle': 'فاحص اتساق آلي',
  'security.duplicateDetected': 'تم اكتشاف عقدة مكرّرة: "BRT" مقابل "brt"',
  'security.duplicateDescBefore': 'تحتوي قاعدة البيانات على كل من',
  'security.duplicateDescMiddle': '(7 حافلات و6 خطوط) و',
  'security.duplicateDescAfter': '(نسخة مكرّرة فارغة). إزالة العقدة الزائدة ينظّم استعلامات العملاء.',
  'security.cleaning': 'جارٍ التنظيف...',
  'security.deduplicate': 'إزالة التكرار وحذف "BRT"',
  'security.cleanSuccess': 'جميع مفاتيح مشغّلي النقل نظيفة وموحّدة. لم يتم اكتشاف عقد مكرّرة.',
  'security.cleanError': 'فشل تنظيف العقدة المكرّرة',
  'security.cleanToast': 'تمت إزالة عقدة الاختبار المكرّرة "BRT" بنجاح مع الحفاظ على العقدة النشطة "brt".',
  'security.credentialGuard': 'حارس أمن بيانات الاعتماد',
  'security.credentialDescBefore': 'مفاتيح خدمة Firebase Admin والرموز البيئية محمية بصرامة بواسطة',
  'security.credentialDescAfter': 'ولا تُضمّ أبدًا في أصول الإنتاج الخاصة بالعميل.',
};
