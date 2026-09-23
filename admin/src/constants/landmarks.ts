/**
 * @file landmarks.ts
 * @description Curated offline gazetteer of major Egyptian transit hubs, squares, universities,
 * and interchange terminals across Greater Cairo, Alexandria, and surrounding metro areas.
 */

export interface EgyptianLandmark {
  name: string;
  category?: string;
  lat: number;
  lng: number;
}

export const OFFLINE_EGYPTIAN_LANDMARKS: EgyptianLandmark[] = [
  // Universities & Campuses
  { name: 'الجامعة المصرية الصينية (ECU Nasr City)', category: 'university', lat: 30.0345, lng: 31.3588 },
  { name: 'جامعة القاهرة (Cairo University)', category: 'university', lat: 30.0264, lng: 31.2086 },
  { name: 'جامعة عين شمس (Ain Shams University)', category: 'university', lat: 30.0772, lng: 31.2853 },
  { name: 'الجامعة الأمريكية بالتجمع (AUC New Cairo)', category: 'university', lat: 30.0194, lng: 31.4994 },
  { name: 'الجامعة الألمانية (GUC New Cairo)', category: 'university', lat: 29.9869, lng: 31.4409 },
  { name: 'جامعة حلوان (Helwan University)', category: 'university', lat: 29.8667, lng: 31.3167 },
  { name: 'القرية الذكية (Smart Village 6th Oct)', category: 'corporate_campus', lat: 30.0744, lng: 31.0189 },

  // Transit Hubs & Terminals
  { name: 'ميدان رمسيس / محطة مصر (Ramses Railway Station)', category: 'railway_station', lat: 30.0626, lng: 31.2469 },
  { name: 'ميدan التحرير (Tahrir Square & Metro Hub)', category: 'metro_hub', lat: 30.0444, lng: 31.2357 },
  { name: 'مطار القاهرة الدولي (Cairo International Airport)', category: 'airport', lat: 30.1219, lng: 31.4055 },
  { name: 'محطة عدلي منصور التبادلية (Adly Mansour Interchange)', category: 'metro_hub', lat: 30.1472, lng: 31.4208 },
  { name: 'ميدان الجيزة (Giza Square & Metro Hub)', category: 'metro_hub', lat: 30.0131, lng: 31.2089 },
  { name: 'محطة حافلات المرج (El Marg Bus Terminal)', category: 'bus_terminal', lat: 30.1558, lng: 31.3361 },
  { name: 'محطة ترومان / كوليدج العباسية (Abbasiya Interchange)', category: 'bus_terminal', lat: 30.0667, lng: 31.2833 },
  { name: 'موقف العاشر من رمضان / السلام (El Salam Hub)', category: 'bus_terminal', lat: 30.1633, lng: 31.4328 },
  { name: 'محطة قطارات بشتيل / الصعيد (Bashtil Station)', category: 'railway_station', lat: 30.0765, lng: 31.1982 },

  // Key Commercial & Residential Nodes
  { name: 'مدينة نصر - مكرم عبيد (Makram Ebeid Nasr City)', category: 'commercial', lat: 30.0561, lng: 31.3300 },
  { name: 'مدينة نصر - عباس العقاد (Abbas El Akkad)', category: 'commercial', lat: 30.0578, lng: 31.3411 },
  { name: 'مصر الجديدة - الكوربة (Korba Heliopolis)', category: 'commercial', lat: 30.0906, lng: 31.3258 },
  { name: 'ميدان لبنان - المهندسين (Lebanon Square Mohandessin)', category: 'transit_hub', lat: 30.0610, lng: 31.2017 },
  { name: 'ميدان سفنكس (Sphinx Square Mohandessin)', category: 'transit_hub', lat: 30.0583, lng: 31.2122 },
  { name: 'التجمع الخامس - شارع التسعين (90th St New Cairo)', category: 'commercial', lat: 30.0247, lng: 31.4361 },
  { name: 'التجمع الأول (First Settlement New Cairo)', category: 'residential', lat: 30.0683, lng: 31.4633 },
  { name: 'المعادي - شارع النصر (El Nasr St Maadi)', category: 'commercial', lat: 29.9744, lng: 31.2800 },
  { name: 'دجلة المعادي (Degla Maadi)', category: 'residential', lat: 29.9600, lng: 31.2700 },
  { name: 'مدينة 6 أكتوبر - الحصري (Hosary Mosque 6th Oct)', category: 'transit_hub', lat: 29.9739, lng: 30.9525 },
  { name: 'الشيخ زايد - هايبر وان (Hyper One Sheikh Zayed)', category: 'commercial', lat: 30.0433, lng: 31.0261 },
  { name: 'أهرامات الجيزة (Giza Pyramids Complex)', category: 'tourism', lat: 29.9792, lng: 31.1342 },
  { name: 'شبرا الخيمة (Shubra El Kheima Hub)', category: 'transit_hub', lat: 30.1286, lng: 31.2422 },
  { name: 'شبرا مصر - دوران شبرا (Dawaran Shubra)', category: 'commercial', lat: 30.0811, lng: 31.2467 },
  { name: 'العاصمة الإدارية الجديدة (New Administrative Capital)', category: 'government', lat: 30.0167, lng: 31.7500 },
  { name: 'مدينتي - البوابة الرئيسية (Madinaty Main Gate)', category: 'residential', lat: 30.1111, lng: 31.6250 },
  { name: 'مدينة الشروق (El Shorouk City Entrance)', category: 'residential', lat: 30.1389, lng: 31.6056 },
  { name: 'مدينة العبور (El Obour City Center)', category: 'residential', lat: 30.2222, lng: 31.4667 },
  { name: 'محطة مصر بالإسكندرية (Alexandria Train Station)', category: 'railway_station', lat: 31.1931, lng: 29.9056 },
  { name: 'سيدي جابر - الإسكندرية (Sidi Gaber Alexandria)', category: 'railway_station', lat: 31.2186, lng: 29.9428 }
];
