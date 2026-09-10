export interface EgyptianLandmark {
  name: string;
  lat: number;
  lng: number;
}

export const OFFLINE_EGYPTIAN_LANDMARKS: EgyptianLandmark[] = [
  { name: 'الجامعة المصرية الصينية (ECU Nasr City)', lat: 30.0345, lng: 31.3588 },
  { name: 'ميدان التحرير (Tahrir Square)', lat: 30.0444, lng: 31.2357 },
  { name: 'ميدان رمسيس / محطة مصر (Ramses)', lat: 30.0626, lng: 31.2469 },
  { name: 'مدينة نصر - مكرم عبيد (Nasr City)', lat: 30.0561, lng: 31.3300 },
  { name: 'ميدان لبنان - المهندسين (Lebanon Sq)', lat: 30.0610, lng: 31.2017 },
  { name: 'التجمع الخامس (New Cairo / 5th Settl)', lat: 30.0073, lng: 31.4916 },
  { name: 'مطار القاهرة الدولي (Cairo Airport)', lat: 30.1219, lng: 31.4055 },
  { name: 'أهرامات الجيزة (Giza Pyramids)', lat: 29.9792, lng: 31.1342 },
  { name: 'جامعة القاهرة (Cairo University)', lat: 30.0264, lng: 31.2086 },
  { name: 'المعادي (Maadi)', lat: 29.9600, lng: 31.2700 },
  { name: 'مدينة 6 أكتوبر (6th of October)', lat: 29.9637, lng: 30.9177 },
];
