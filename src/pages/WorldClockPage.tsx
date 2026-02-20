import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, MagnifyingGlass, GlobeHemisphereWest, GlobeHemisphereEast, MapTrifold, MapPin, Compass } from '@phosphor-icons/react';

interface CountryTime {
    name: string;
    nameAr: string;
    nameFr: string;
    city: string; // Added city for display
    cityAr: string;
    cityFr: string;
    timezone: string;
    flag: string;
    continent: string;
}

const COUNTRIES: CountryTime[] = [
    // Asia (Middle East)
    { name: 'Saudi Arabia', nameAr: 'السعودية', nameFr: 'Arabie Saoudite', city: 'RIYADH', cityAr: 'الرياض', cityFr: 'Riyad', timezone: 'Asia/Riyadh', flag: '🇸🇦', continent: 'asia' },
    { name: 'UAE', nameAr: 'الإمارات', nameFr: 'Émirats Arabes Unis', city: 'DUBAI', cityAr: 'دبي', cityFr: 'Dubaï', timezone: 'Asia/Dubai', flag: '🇦🇪', continent: 'asia' },
    { name: 'Kuwait', nameAr: 'الكويت', nameFr: 'Koweït', city: 'KUWAIT', cityAr: 'الكويت', cityFr: 'Koweït', timezone: 'Asia/Kuwait', flag: '🇰🇼', continent: 'asia' },
    { name: 'Qatar', nameAr: 'قطر', nameFr: 'Qatar', city: 'DOHA', cityAr: 'الدوحة', cityFr: 'Doha', timezone: 'Asia/Qatar', flag: '🇶🇦', continent: 'asia' },
    { name: 'Bahrain', nameAr: 'البحرين', nameFr: 'Bahreïn', city: 'MANAMA', cityAr: 'المنامة', cityFr: 'Manama', timezone: 'Asia/Bahrain', flag: '🇧🇭', continent: 'asia' },
    { name: 'Oman', nameAr: 'عمان', nameFr: 'Oman', city: 'MUSCAT', cityAr: 'مسقط', cityFr: 'Mascate', timezone: 'Asia/Muscat', flag: '🇴🇲', continent: 'asia' },
    { name: 'Yemen', nameAr: 'اليمن', nameFr: 'Yémen', city: "SANA'A", cityAr: 'صنعاء', cityFr: 'Sanaa', timezone: 'Asia/Aden', flag: '🇾🇪', continent: 'asia' },
    { name: 'Iraq', nameAr: 'العراق', nameFr: 'Irak', city: 'BAGHDAD', cityAr: 'بغداد', cityFr: 'Bagdad', timezone: 'Asia/Baghdad', flag: '🇮🇶', continent: 'asia' },
    { name: 'Jordan', nameAr: 'الأردن', nameFr: 'Jordanie', city: 'AMMAN', cityAr: 'عمان', cityFr: 'Amman', timezone: 'Asia/Amman', flag: '🇯🇴', continent: 'asia' },
    { name: 'Palestine', nameAr: 'فلسطين', nameFr: 'Palestine', city: 'JERUSALEM', cityAr: 'القدس', cityFr: 'Jérusalem', timezone: 'Asia/Hebron', flag: '🇵🇸', continent: 'asia' },
    { name: 'Lebanon', nameAr: 'لبنان', nameFr: 'Liban', city: 'BEIRUT', cityAr: 'بيروت', cityFr: 'Beyrouth', timezone: 'Asia/Beirut', flag: '🇱🇧', continent: 'asia' },
    { name: 'Syria', nameAr: 'سوريا', nameFr: 'Syrie', city: 'DAMASCUS', cityAr: 'دمشق', cityFr: 'Damas', timezone: 'Asia/Damascus', flag: '🇸🇾', continent: 'asia' },
    { name: 'Turkey', nameAr: 'تركيا', nameFr: 'Turquie', city: 'ISTANBUL', cityAr: 'إسطنبول', cityFr: 'Istanbul', timezone: 'Europe/Istanbul', flag: '🇹🇷', continent: 'asia' },
    { name: 'Iran', nameAr: 'إيران', nameFr: 'Iran', city: 'TEHRAN', cityAr: 'طهران', cityFr: 'Téhéran', timezone: 'Asia/Tehran', flag: '🇮🇷', continent: 'asia' },

    // Asia (South)
    { name: 'Afghanistan', nameAr: 'أفغانستان', nameFr: 'Afghanistan', city: 'KABUL', cityAr: 'كابل', cityFr: 'Kaboul', timezone: 'Asia/Kabul', flag: '🇦🇫', continent: 'asia' },
    { name: 'Pakistan', nameAr: 'باكستان', nameFr: 'Pakistan', city: 'KARACHI', cityAr: 'كراتشي', cityFr: 'Karachi', timezone: 'Asia/Karachi', flag: '🇵🇰', continent: 'asia' },
    { name: 'India', nameAr: 'الهند', nameFr: 'Inde', city: 'NEW DELHI', cityAr: 'نيودلهي', cityFr: 'New Delhi', timezone: 'Asia/Kolkata', flag: '🇮🇳', continent: 'asia' },
    { name: 'Bangladesh', nameAr: 'بنغلاديش', nameFr: 'Bangladesh', city: 'DHAKA', cityAr: 'دكا', cityFr: 'Dacca', timezone: 'Asia/Dhaka', flag: '🇧🇩', continent: 'asia' },
    { name: 'Sri Lanka', nameAr: 'سريلانكا', nameFr: 'Sri Lanka', city: 'COLOMBO', cityAr: 'كولومبو', cityFr: 'Colombo', timezone: 'Asia/Colombo', flag: '🇱🇰', continent: 'asia' },
    { name: 'Nepal', nameAr: 'نيبال', nameFr: 'Népal', city: 'KATHMANDU', cityAr: 'كاتماندو', cityFr: 'Katmandou', timezone: 'Asia/Kathmandu', flag: '🇳🇵', continent: 'asia' },
    { name: 'Bhutan', nameAr: 'بوتان', nameFr: 'Bhoutan', city: 'THIMPHU', cityAr: 'تيمفو', cityFr: 'Thimphou', timezone: 'Asia/Thimphu', flag: '🇧🇹', continent: 'asia' },
    { name: 'Maldives', nameAr: 'المالديف', nameFr: 'Maldives', city: 'MALÉ', cityAr: 'ماليه', cityFr: 'Malé', timezone: 'Indian/Maldives', flag: '🇲🇻', continent: 'asia' },

    // Asia (East)
    { name: 'China', nameAr: 'الصين', nameFr: 'Chine', city: 'BEIJING', cityAr: 'بكين', cityFr: 'Pékin', timezone: 'Asia/Shanghai', flag: '🇨🇳', continent: 'asia' },
    { name: 'Japan', nameAr: 'اليابان', nameFr: 'Japon', city: 'TOKYO', cityAr: 'طوكيو', cityFr: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵', continent: 'asia' },
    { name: 'South Korea', nameAr: 'كوريا الجنوبية', nameFr: 'Corée du Sud', city: 'SEOUL', cityAr: 'سيول', cityFr: 'Séoul', timezone: 'Asia/Seoul', flag: '🇰🇷', continent: 'asia' },
    { name: 'North Korea', nameAr: 'كوريا الشمالية', nameFr: 'Corée du Nord', city: 'PYONGYANG', cityAr: 'بيونغيانغ', cityFr: 'Pyongyang', timezone: 'Asia/Pyongyang', flag: '🇰🇵', continent: 'asia' },
    { name: 'Taiwan', nameAr: 'تايوان', nameFr: 'Taïwan', city: 'TAIPEI', cityAr: 'تايبيه', cityFr: 'Taipei', timezone: 'Asia/Taipei', flag: '🇹🇼', continent: 'asia' },
    { name: 'Mongolia', nameAr: 'منغوليا', nameFr: 'Mongolie', city: 'ULAANBAATAR', cityAr: 'أولان باتور', cityFr: 'Oulan-Bator', timezone: 'Asia/Ulaanbaatar', flag: '🇲🇳', continent: 'asia' },

    // Asia (Southeast)
    { name: 'Indonesia', nameAr: 'إندونيسيا', nameFr: 'Indonésie', city: 'JAKARTA', cityAr: 'جاكرتا', cityFr: 'Jakarta', timezone: 'Asia/Jakarta', flag: '🇮🇩', continent: 'asia' },
    { name: 'Malaysia', nameAr: 'ماليزيا', nameFr: 'Malaisie', city: 'KUALA LUMPUR', cityAr: 'كوالالمبور', cityFr: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾', continent: 'asia' },
    { name: 'Singapore', nameAr: 'سنغافورة', nameFr: 'Singapour', city: 'SINGAPORE', cityAr: 'سنغافورة', cityFr: 'Singapour', timezone: 'Asia/Singapore', flag: '🇸🇬', continent: 'asia' },
    { name: 'Philippines', nameAr: 'الفلبين', nameFr: 'Philippines', city: 'MANILA', cityAr: 'مانيلا', cityFr: 'Manille', timezone: 'Asia/Manila', flag: '🇵🇭', continent: 'asia' },
    { name: 'Vietnam', nameAr: 'فيتنام', nameFr: 'Vietnam', city: 'HANOI', cityAr: 'هانوي', cityFr: 'Hanoï', timezone: 'Asia/Ho_Chi_Minh', flag: '🇻🇳', continent: 'asia' },
    { name: 'Thailand', nameAr: 'تايلاند', nameFr: 'Thaïlande', city: 'BANGKOK', cityAr: 'بانكوك', cityFr: 'Bangkok', timezone: 'Asia/Bangkok', flag: '🇹🇭', continent: 'asia' },
    { name: 'Myanmar', nameAr: 'ميانمار', nameFr: 'Myanmar', city: 'YANGON', cityAr: 'يانغون', cityFr: 'Rangoun', timezone: 'Asia/Yangon', flag: '🇲🇲', continent: 'asia' },
    { name: 'Cambodia', nameAr: 'كمبوديا', nameFr: 'Cambodge', city: 'PHNOM PENH', cityAr: 'بنوم بنه', cityFr: 'Phnom Penh', timezone: 'Asia/Phnom_Penh', flag: '🇰🇭', continent: 'asia' },
    { name: 'Laos', nameAr: 'لاوس', nameFr: 'Laos', city: 'VIENTIANE', cityAr: 'فيينتيان', cityFr: 'Vientiane', timezone: 'Asia/Vientiane', flag: '🇱🇦', continent: 'asia' },
    { name: 'Brunei', nameAr: 'بروناي', nameFr: 'Brunei', city: 'BANDAR', cityAr: 'بندر', cityFr: 'Bandar', timezone: 'Asia/Brunei', flag: '🇧🇳', continent: 'asia' },

    // Asia (Central & Caucasus)
    { name: 'Kazakhstan', nameAr: 'كازاخستان', nameFr: 'Kazakhstan', city: 'ASTANA', cityAr: 'أستانا', cityFr: 'Astana', timezone: 'Asia/Almaty', flag: '🇰🇿', continent: 'asia' },
    { name: 'Uzbekistan', nameAr: 'أوزبكستان', nameFr: 'Ouzbékistan', city: 'TASHKENT', cityAr: 'طشقند', cityFr: 'Tachkent', timezone: 'Asia/Tashkent', flag: '🇺🇿', continent: 'asia' },
    { name: 'Turkmenistan', nameAr: 'تركمانستان', nameFr: 'Turkménistan', city: 'ASHGABAT', cityAr: 'عشق آباد', cityFr: 'Achgabat', timezone: 'Asia/Ashgabat', flag: '🇹🇲', continent: 'asia' },
    { name: 'Kyrgyzstan', nameAr: 'قرغيزستان', nameFr: 'Kirghizistan', city: 'BISHKEK', cityAr: 'بيشكيك', cityFr: 'Bichkek', timezone: 'Asia/Bishkek', flag: '🇰🇬', continent: 'asia' },
    { name: 'Tajikistan', nameAr: 'طاجيكستان', nameFr: 'Tadjikistan', city: 'DUSHANBE', cityAr: 'دوشنبه', cityFr: 'Douchanbé', timezone: 'Asia/Dushanbe', flag: '🇹🇯', continent: 'asia' },
    { name: 'Azerbaijan', nameAr: 'أذربيجان', nameFr: 'Azerbaïdjan', city: 'BAKU', cityAr: 'باكو', cityFr: 'Bakou', timezone: 'Asia/Baku', flag: '🇦🇿', continent: 'asia' },
    { name: 'Armenia', nameAr: 'أرمينيا', nameFr: 'Arménie', city: 'YEREVAN', cityAr: 'يريفان', cityFr: 'Erevan', timezone: 'Asia/Yerevan', flag: '🇦🇲', continent: 'asia' },
    { name: 'Georgia', nameAr: 'جورجيا', nameFr: 'Géorgie', city: 'TBILISI', cityAr: 'تبليسي', cityFr: 'Tbilissi', timezone: 'Asia/Tbilisi', flag: '🇬🇪', continent: 'asia' },

    // Africa (North)
    { name: 'Egypt', nameAr: 'مصر', nameFr: 'Égypte', city: 'CAIRO', cityAr: 'القاهرة', cityFr: 'Le Caire', timezone: 'Africa/Cairo', flag: '🇪🇬', continent: 'africa' },
    { name: 'Morocco', nameAr: 'المغرب', nameFr: 'Maroc', city: 'RABAT', cityAr: 'الرباط', cityFr: 'Rabat', timezone: 'Africa/Casablanca', flag: '🇲🇦', continent: 'africa' },
    { name: 'Algeria', nameAr: 'الجزائر', nameFr: 'Algérie', city: 'ALGIERS', cityAr: 'الجزائر', cityFr: 'Alger', timezone: 'Africa/Algiers', flag: '🇩🇿', continent: 'africa' },
    { name: 'Tunisia', nameAr: 'تونس', nameFr: 'Tunisie', city: 'TUNIS', cityAr: 'تونس', cityFr: 'Tunis', timezone: 'Africa/Tunis', flag: '🇹🇳', continent: 'africa' },
    { name: 'Libya', nameAr: 'ليبيا', nameFr: 'Libye', city: 'TRIPOLI', cityAr: 'طرابلس', cityFr: 'Tripoli', timezone: 'Africa/Tripoli', flag: '🇱🇾', continent: 'africa' },
    { name: 'Sudan', nameAr: 'السودان', nameFr: 'Soudan', city: 'KHARTOUM', cityAr: 'الخرطوم', cityFr: 'Khartoum', timezone: 'Africa/Khartoum', flag: '🇸🇩', continent: 'africa' },

    // Africa (West)
    { name: 'Nigeria', nameAr: 'نيجيريا', nameFr: 'Nigéria', city: 'ABUJA', cityAr: 'أبوجا', cityFr: 'Abuja', timezone: 'Africa/Lagos', flag: '🇳🇬', continent: 'africa' },
    { name: 'Ghana', nameAr: 'غانا', nameFr: 'Ghana', city: 'ACCRA', cityAr: 'أكرا', cityFr: 'Accra', timezone: 'Africa/Accra', flag: '🇬🇭', continent: 'africa' },
    { name: 'Senegal', nameAr: 'السنغال', nameFr: 'Sénégal', city: 'DAKAR', cityAr: 'داكار', cityFr: 'Dakar', timezone: 'Africa/Dakar', flag: '🇸🇳', continent: 'africa' },
    { name: 'Mali', nameAr: 'مالي', nameFr: 'Mali', city: 'BAMAKO', cityAr: 'باماكو', cityFr: 'Bamako', timezone: 'Africa/Bamako', flag: '🇲🇱', continent: 'africa' },
    { name: 'Niger', nameAr: 'النيجر', nameFr: 'Niger', city: 'NIAMEY', cityAr: 'نيامي', cityFr: 'Niamey', timezone: 'Africa/Niamey', flag: '🇳🇪', continent: 'africa' },
    { name: 'Côte d\'Ivoire', nameAr: 'ساحل العاج', nameFr: 'Côte d\'Ivoire', city: 'ABIDJAN', cityAr: 'أبيدجان', cityFr: 'Abidjan', timezone: 'Africa/Abidjan', flag: '🇨🇮', continent: 'africa' },
    { name: 'Burkina Faso', nameAr: 'بوركينا فاسو', nameFr: 'Burkina Faso', city: 'OUAGADOUGOU', cityAr: 'واغادوغو', cityFr: 'Ouagadougou', timezone: 'Africa/Ouagadougou', flag: '🇧🇫', continent: 'africa' },
    { name: 'Guinea', nameAr: 'غينيا', nameFr: 'Guinée', city: 'CONAKRY', cityAr: 'كوناكري', cityFr: 'Conakry', timezone: 'Africa/Conakry', flag: '🇬🇳', continent: 'africa' },
    { name: 'Benin', nameAr: 'بنين', nameFr: 'Bénin', city: 'PORTO-NOVO', cityAr: 'بورتو نوفو', cityFr: 'Porto-Novo', timezone: 'Africa/Porto-Novo', flag: '🇧🇯', continent: 'africa' },
    { name: 'Togo', nameAr: 'توجو', nameFr: 'Togo', city: 'LOMÉ', cityAr: 'لومي', cityFr: 'Lomé', timezone: 'Africa/Lome', flag: '🇹🇬', continent: 'africa' },
    { name: 'Liberia', nameAr: 'ليبيريا', nameFr: 'Libéria', city: 'MONROVIA', cityAr: 'مونروفيا', cityFr: 'Monrovia', timezone: 'Africa/Monrovia', flag: '🇱🇷', continent: 'africa' },
    { name: 'Sierra Leone', nameAr: 'سيراليون', nameFr: 'Sierra Leone', city: 'FREETOWN', cityAr: 'فريتاون', cityFr: 'Freetown', timezone: 'Africa/Freetown', flag: '🇸🇱', continent: 'africa' },
    { name: 'Gambia', nameAr: 'غامبيا', nameFr: 'Gambie', city: 'BANJUL', cityAr: 'بانجول', cityFr: 'Banjul', timezone: 'Africa/Banjul', flag: '🇬🇲', continent: 'africa' },
    { name: 'Guinea-Bissau', nameAr: 'غينيا بيساو', nameFr: 'Guinée-Bissau', city: 'BISSAU', cityAr: 'بيساو', cityFr: 'Bissau', timezone: 'Africa/Bissau', flag: '🇬🇼', continent: 'africa' },
    { name: 'Mauritania', nameAr: 'موريتانيا', nameFr: 'Mauritanie', city: 'NOUAKCHOTT', cityAr: 'نواكشوط', cityFr: 'Nouakchott', timezone: 'Africa/Nouakchott', flag: '🇲🇷', continent: 'africa' },
    { name: 'Cape Verde', nameAr: 'الرأس الأخضر', nameFr: 'Cap-Vert', city: 'PRAIA', cityAr: 'برايا', cityFr: 'Praia', timezone: 'Atlantic/Cape_Verde', flag: '🇨🇻', continent: 'africa' },

    // Africa (East)
    { name: 'Ethiopia', nameAr: 'إثيوبيا', nameFr: 'Éthiopie', city: 'ADDIS ABABA', cityAr: 'أديس أبابا', cityFr: 'Addis-Abeba', timezone: 'Africa/Addis_Ababa', flag: '🇪🇹', continent: 'africa' },
    { name: 'Kenya', nameAr: 'كينيا', nameFr: 'Kenya', city: 'NAIROBI', cityAr: 'نيروبي', cityFr: 'Nairobi', timezone: 'Africa/Nairobi', flag: '🇰🇪', continent: 'africa' },
    { name: 'Tanzania', nameAr: 'تنزانيا', nameFr: 'Tanzanie', city: 'DODOMA', cityAr: 'دودوما', cityFr: 'Dodoma', timezone: 'Africa/Dar_es_Salaam', flag: '🇹🇿', continent: 'africa' },
    { name: 'Uganda', nameAr: 'أوغندا', nameFr: 'Ouganda', city: 'KAMPALA', cityAr: 'كمبالا', cityFr: 'Kampala', timezone: 'Africa/Kampala', flag: '🇺🇬', continent: 'africa' },
    { name: 'Somalia', nameAr: 'الصومال', nameFr: 'Somalie', city: 'MOGADISHU', cityAr: 'مقدشيو', cityFr: 'Mogadiscio', timezone: 'Africa/Mogadishu', flag: '🇸🇴', continent: 'africa' },
    { name: 'Rwanda', nameAr: 'رواندا', nameFr: 'Rwanda', city: 'KIGALI', cityAr: 'كيغالي', cityFr: 'Kigali', timezone: 'Africa/Kigali', flag: '🇷🇼', continent: 'africa' },
    { name: 'Burundi', nameAr: 'بوروندي', nameFr: 'Burundi', city: 'BUJUMBURA', cityAr: 'بوجومبورا', cityFr: 'Bujumbura', timezone: 'Africa/Bujumbura', flag: '🇧🇮', continent: 'africa' },
    { name: 'Djibouti', nameAr: 'جيبوتي', nameFr: 'Djibouti', city: 'DJIBOUTI', cityAr: 'جيبوتي', cityFr: 'Djibouti', timezone: 'Africa/Djibouti', flag: '🇩🇯', continent: 'africa' },
    { name: 'Eritrea', nameAr: 'إريتريا', nameFr: 'Érythrée', city: 'ASMARA', cityAr: 'أسمرة', cityFr: 'Asmara', timezone: 'Africa/Asmara', flag: '🇪🇷', continent: 'africa' },
    { name: 'Madagascar', nameAr: 'مدغشقر', nameFr: 'Madagascar', city: 'ANTANANARIVO', cityAr: 'أنتاناناريفو', cityFr: 'Antananarivo', timezone: 'Indian/Antananarivo', flag: '🇲🇬', continent: 'africa' },
    { name: 'Seychelles', nameAr: 'سيشل', nameFr: 'Seychelles', city: 'VICTORIA', cityAr: 'فيكتوريا', cityFr: 'Victoria', timezone: 'Indian/Mahe', flag: '🇸🇨', continent: 'africa' },
    { name: 'Comoros', nameAr: 'جزر القمر', nameFr: 'Comores', city: 'MORONI', cityAr: 'موروني', cityFr: 'Moroni', timezone: 'Indian/Comoro', flag: '🇰🇲', continent: 'africa' },
    { name: 'Mauritius', nameAr: 'موريشيوس', nameFr: 'Maurice', city: 'PORT LOUIS', cityAr: 'بورت لويس', cityFr: 'Port-Louis', timezone: 'Indian/Mauritius', flag: '🇲🇺', continent: 'africa' },

    // Africa (Central)
    { name: 'DR Congo', nameAr: 'الكونغو الديمقراطية', nameFr: 'RD Congo', city: 'KINSHASA', cityAr: 'كينشاسا', cityFr: 'Kinshasa', timezone: 'Africa/Kinshasa', flag: '🇨🇩', continent: 'africa' },
    { name: 'Angola', nameAr: 'أنغولا', nameFr: 'Angola', city: 'LUANDA', cityAr: 'لواندا', cityFr: 'Luanda', timezone: 'Africa/Luanda', flag: '🇦🇴', continent: 'africa' },
    { name: 'Cameroon', nameAr: 'الكاميرون', nameFr: 'Cameroun', city: 'YAOUNDÉ', cityAr: 'ياوندي', cityFr: 'Yaoundé', timezone: 'Africa/Douala', flag: '🇨🇲', continent: 'africa' },
    { name: 'Chad', nameAr: 'تشاد', nameFr: 'Tchad', city: "N'DJAMENA", cityAr: 'نجامينا', cityFr: "N'Djaména", timezone: 'Africa/Ndjamena', flag: '🇹🇩', continent: 'africa' },
    { name: 'Congo', nameAr: 'الكونغو', nameFr: 'Congo', city: 'BRAZZAVILLE', cityAr: 'برازافيل', cityFr: 'Brazzaville', timezone: 'Africa/Brazzaville', flag: '🇨🇬', continent: 'africa' },
    { name: 'Central African Republic', nameAr: 'إفريقيا الوسطى', nameFr: 'RCA', city: 'BANGUI', cityAr: 'بانغي', cityFr: 'Bangui', timezone: 'Africa/Bangui', flag: '🇨🇫', continent: 'africa' },
    { name: 'Gabon', nameAr: 'الغابون', nameFr: 'Gabon', city: 'LIBREVILLE', cityAr: 'ليبرفيل', cityFr: 'Libreville', timezone: 'Africa/Libreville', flag: '🇬🇦', continent: 'africa' },
    { name: 'Equatorial Guinea', nameAr: 'غينيا الاستوائية', nameFr: 'Guinée éq.', city: 'MALABO', cityAr: 'مالابو', cityFr: 'Malabo', timezone: 'Africa/Malabo', flag: '🇬🇶', continent: 'africa' },
    { name: 'Sao Tome and Principe', nameAr: 'ساو تومي وبرينسيب', nameFr: 'Sao Tomé', city: 'SÃO TOMÉ', cityAr: 'ساو تومي', cityFr: 'São Tomé', timezone: 'Africa/Sao_Tome', flag: '🇸🇹', continent: 'africa' },

    // Africa (Southern)
    { name: 'South Africa', nameAr: 'جنوب إفريقيا', nameFr: 'Afrique du Sud', city: 'JOHANNESBURG', cityAr: 'جوهانسبرغ', cityFr: 'Johannesburg', timezone: 'Africa/Johannesburg', flag: '🇿🇦', continent: 'africa' },
    { name: 'Zimbabwe', nameAr: 'زيمبابوي', nameFr: 'Zimbabwe', city: 'HARARE', cityAr: 'هراري', cityFr: 'Harare', timezone: 'Africa/Harare', flag: '🇿🇼', continent: 'africa' },
    { name: 'Zambia', nameAr: 'زامبيا', nameFr: 'Zambie', city: 'LUSAKA', cityAr: 'لوساكا', cityFr: 'Lusaka', timezone: 'Africa/Lusaka', flag: '🇿🇲', continent: 'africa' },
    { name: 'Mozambique', nameAr: 'موزمبيق', nameFr: 'Mozambique', city: 'MAPUTO', cityAr: 'مابوتو', cityFr: 'Maputo', timezone: 'Africa/Maputo', flag: '🇲🇿', continent: 'africa' },
    { name: 'Malawi', nameAr: 'مالاوي', nameFr: 'Malawi', city: 'LILONGWE', cityAr: 'ليلونغوي', cityFr: 'Lilongwe', timezone: 'Africa/Blantyre', flag: '🇲🇼', continent: 'africa' },
    { name: 'Namibia', nameAr: 'ناميبيا', nameFr: 'Namibie', city: 'WINDHOEK', cityAr: 'ويندهوك', cityFr: 'Windhoek', timezone: 'Africa/Windhoek', flag: '🇳🇦', continent: 'africa' },
    { name: 'Botswana', nameAr: 'بوتسوانا', nameFr: 'Botswana', city: 'GABORONE', cityAr: 'غابورون', cityFr: 'Gaborone', timezone: 'Africa/Gaborone', flag: '🇧🇼', continent: 'africa' },
    { name: 'Lesotho', nameAr: 'ليسوتو', nameFr: 'Lesotho', city: 'MASERU', cityAr: 'ماسيرو', cityFr: 'Maseru', timezone: 'Africa/Maseru', flag: '🇱🇸', continent: 'africa' },
    { name: 'Eswatini', nameAr: 'إسواتيني', nameFr: 'Eswatini', city: 'MBABANE', cityAr: 'مبابان', cityFr: 'Mbabane', timezone: 'Africa/Mbabane', flag: '🇸🇿', continent: 'africa' },

    // Europe (Western & Northern)
    { name: 'UK', nameAr: 'بريطانيا', nameFr: 'Royaume-Uni', city: 'LONDON', cityAr: 'لندن', cityFr: 'Londres', timezone: 'Europe/London', flag: '🇬🇧', continent: 'europe' },
    { name: 'Ireland', nameAr: 'أيرلندا', nameFr: 'Irlande', city: 'DUBLIN', cityAr: 'دبلن', cityFr: 'Dublin', timezone: 'Europe/Dublin', flag: '🇮🇪', continent: 'europe' },
    { name: 'France', nameAr: 'فرنسا', nameFr: 'France', city: 'PARIS', cityAr: 'باريس', cityFr: 'Paris', timezone: 'Europe/Paris', flag: '🇫🇷', continent: 'europe' },
    { name: 'Germany', nameAr: 'ألمانيا', nameFr: 'Allemagne', city: 'BERLIN', cityAr: 'برلين', cityFr: 'Berlin', timezone: 'Europe/Berlin', flag: '🇩🇪', continent: 'europe' },
    { name: 'Netherlands', nameAr: 'هولندا', nameFr: 'Pays-Bas', city: 'AMSTERDAM', cityAr: 'أمستردام', cityFr: 'Amsterdam', timezone: 'Europe/Amsterdam', flag: '🇳🇱', continent: 'europe' },
    { name: 'Belgium', nameAr: 'بلجيكا', nameFr: 'Belgique', city: 'BRUSSELS', cityAr: 'بروكسل', cityFr: 'Bruxelles', timezone: 'Europe/Brussels', flag: '🇧🇪', continent: 'europe' },
    { name: 'Switzerland', nameAr: 'سويسرا', nameFr: 'Suisse', city: 'ZURICH', cityAr: 'زيورخ', cityFr: 'Zurich', timezone: 'Europe/Zurich', flag: '🇨🇭', continent: 'europe' },
    { name: 'Austria', nameAr: 'النمسا', nameFr: 'Autriche', city: 'VIENNA', cityAr: 'فيينا', cityFr: 'Vienne', timezone: 'Europe/Vienna', flag: '🇦🇹', continent: 'europe' },
    { name: 'Sweden', nameAr: 'السويد', nameFr: 'Suède', city: 'STOCKHOLM', cityAr: 'ستوكهولم', cityFr: 'Stockholm', timezone: 'Europe/Stockholm', flag: '🇸🇪', continent: 'europe' },
    { name: 'Norway', nameAr: 'النرويج', nameFr: 'Norvège', city: 'OSLO', cityAr: 'أوسلو', cityFr: 'Oslo', timezone: 'Europe/Oslo', flag: '🇳🇴', continent: 'europe' },
    { name: 'Denmark', nameAr: 'الدنمارك', nameFr: 'Danemark', city: 'COPENHAGEN', cityAr: 'كوبنهاغن', cityFr: 'Copenhague', timezone: 'Europe/Copenhagen', flag: '🇩🇰', continent: 'europe' },
    { name: 'Finland', nameAr: 'فنلندا', nameFr: 'Finlande', city: 'HELSINKI', cityAr: 'هلسنكي', cityFr: 'Helsinki', timezone: 'Europe/Helsinki', flag: '🇫🇮', continent: 'europe' },
    { name: 'Iceland', nameAr: 'أيسلندا', nameFr: 'Islande', city: 'REYKJAVIK', cityAr: 'ريكيافيك', cityFr: 'Reykjavik', timezone: 'Atlantic/Reykjavik', flag: '🇮🇸', continent: 'europe' },

    // Europe (Southern & Eastern)
    { name: 'Italy', nameAr: 'إيطاليا', nameFr: 'Italie', city: 'ROME', cityAr: 'روما', cityFr: 'Rome', timezone: 'Europe/Rome', flag: '🇮🇹', continent: 'europe' },
    { name: 'Spain', nameAr: 'إسبانيا', nameFr: 'Espagne', city: 'MADRID', cityAr: 'مدريد', cityFr: 'Madrid', timezone: 'Europe/Madrid', flag: '🇪🇸', continent: 'europe' },
    { name: 'Portugal', nameAr: 'البرتغال', nameFr: 'Portugal', city: 'LISBON', cityAr: 'لشبونة', cityFr: 'Lisbonne', timezone: 'Europe/Lisbon', flag: '🇵🇹', continent: 'europe' },
    { name: 'Greece', nameAr: 'اليونان', nameFr: 'Grèce', city: 'ATHENS', cityAr: 'أثينا', cityFr: 'Athènes', timezone: 'Europe/Athens', flag: '🇬🇷', continent: 'europe' },
    { name: 'Russia', nameAr: 'روسيا', nameFr: 'Russie', city: 'MOSCOW', cityAr: 'موسكو', cityFr: 'Moscou', timezone: 'Europe/Moscow', flag: '🇷🇺', continent: 'europe' },
    { name: 'Ukraine', nameAr: 'أوكرانيا', nameFr: 'Ukraine', city: 'KYIV', cityAr: 'كييف', cityFr: 'Kiev', timezone: 'Europe/Kiev', flag: '🇺🇦', continent: 'europe' },
    { name: 'Poland', nameAr: 'بولندا', nameFr: 'Pologne', city: 'WARSAW', cityAr: 'وارسو', cityFr: 'Varsovie', timezone: 'Europe/Warsaw', flag: '🇵🇱', continent: 'europe' },
    { name: 'Romania', nameAr: 'رومانيا', nameFr: 'Roumanie', city: 'BUCHAREST', cityAr: 'بوخارست', cityFr: 'Bucarest', timezone: 'Europe/Bucharest', flag: '🇷🇴', continent: 'europe' },
    { name: 'Czechia', nameAr: 'التشيك', nameFr: 'Tchéquie', city: 'PRAGUE', cityAr: 'براغ', cityFr: 'Prague', timezone: 'Europe/Prague', flag: '🇨🇿', continent: 'europe' },
    { name: 'Hungary', nameAr: 'المجر', nameFr: 'Hongrie', city: 'BUDAPEST', cityAr: 'بودابست', cityFr: 'Budapest', timezone: 'Europe/Budapest', flag: '🇭🇺', continent: 'europe' },
    { name: 'Serbia', nameAr: 'صربيا', nameFr: 'Serbie', city: 'BELGRADE', cityAr: 'بلغراد', cityFr: 'Belgrade', timezone: 'Europe/Belgrade', flag: '🇷🇸', continent: 'europe' },
    { name: 'Bulgaria', nameAr: 'بلغاريا', nameFr: 'Bulgarie', city: 'SOFIA', cityAr: 'صوفيا', cityFr: 'Sofia', timezone: 'Europe/Sofia', flag: '🇧🇬', continent: 'europe' },
    { name: 'Croatia', nameAr: 'كرواتيا', nameFr: 'Croatie', city: 'ZAGREB', cityAr: 'زغرب', cityFr: 'Zagreb', timezone: 'Europe/Zagreb', flag: '🇭🇷', continent: 'europe' },
    { name: 'Bosnia', nameAr: 'البوسنة', nameFr: 'Bosnie', city: 'SARAJEVO', cityAr: 'سراييفو', cityFr: 'Sarajevo', timezone: 'Europe/Sarajevo', flag: '🇧🇦', continent: 'europe' },
    { name: 'Albania', nameAr: 'ألبانيا', nameFr: 'Albanie', city: 'TIRANA', cityAr: 'تيرانا', cityFr: 'Tirana', timezone: 'Europe/Tirane', flag: '🇦🇱', continent: 'europe' },

    // Americas (North)
    { name: 'USA (NY)', nameAr: 'أمريكا (نيويورك)', nameFr: 'USA (NY)', city: 'NEW YORK', cityAr: 'نيويورك', cityFr: 'New York', timezone: 'America/New_York', flag: '🇺🇸', continent: 'americas' },
    { name: 'USA (LA)', nameAr: 'أمريكا (لوس أنجلوس)', nameFr: 'USA (LA)', city: 'LOS ANGELES', cityAr: 'لوس أنجلوس', cityFr: 'Los Angeles', timezone: 'America/Los_Angeles', flag: '🇺🇸', continent: 'americas' },
    { name: 'USA (Chicago)', nameAr: 'أمريكا (شيكاغو)', nameFr: 'USA (Chicago)', city: 'CHICAGO', cityAr: 'شيكاغو', cityFr: 'Chicago', timezone: 'America/Chicago', flag: '🇺🇸', continent: 'americas' },
    { name: 'Canada (Toronto)', nameAr: 'كندا (تورونتو)', nameFr: 'Canada (Tor.)', city: 'TORONTO', cityAr: 'تورونتو', cityFr: 'Toronto', timezone: 'America/Toronto', flag: '🇨🇦', continent: 'americas' },
    { name: 'Canada (Vancouver)', nameAr: 'كندا (فانكوفر)', nameFr: 'Canada (Van.)', city: 'VANCOUVER', cityAr: 'فانكوفر', cityFr: 'Vancouver', timezone: 'America/Vancouver', flag: '🇨🇦', continent: 'americas' },
    { name: 'Mexico', nameAr: 'المكسيك', nameFr: 'Mexique', city: 'MEXICO CITY', cityAr: 'مكسيكو سيتي', cityFr: 'Mexico', timezone: 'America/Mexico_City', flag: '🇲🇽', continent: 'americas' },

    // Americas (Central & Caribbean)
    { name: 'Cuba', nameAr: 'كوبا', nameFr: 'Cuba', city: 'HAVANA', cityAr: 'هافانا', cityFr: 'La Havane', timezone: 'America/Havana', flag: '🇨🇺', continent: 'americas' },
    { name: 'Jamaica', nameAr: 'جامايكا', nameFr: 'Jamaïque', city: 'KINGSTON', cityAr: 'كينغستون', cityFr: 'Kingston', timezone: 'America/Jamaica', flag: '🇯🇲', continent: 'americas' },
    { name: 'Panama', nameAr: 'بنما', nameFr: 'Panama', city: 'PANAMA CITY', cityAr: 'بنما سيتي', cityFr: 'Panama', timezone: 'America/Panama', flag: '🇵🇦', continent: 'americas' },
    { name: 'Costa Rica', nameAr: 'كوستاريكا', nameFr: 'Costa Rica', city: 'SAN JOSÉ', cityAr: 'سان خوسيه', cityFr: 'San José', timezone: 'America/Costa_Rica', flag: '🇨🇷', continent: 'americas' },
    { name: 'Dominican Republic', nameAr: 'الدومينيكان', nameFr: 'Rép. Dominicaine', city: 'SANTO DOMINGO', cityAr: 'سانتو دومينغو', cityFr: 'Saint-Domingue', timezone: 'America/Santo_Domingo', flag: '🇩🇴', continent: 'americas' },
    { name: 'Haiti', nameAr: 'هايتي', nameFr: 'Haïti', city: 'PORT-AU-PRINCE', cityAr: 'بورت أو برانس', cityFr: 'Port-au-Prince', timezone: 'America/Port-au-Prince', flag: '🇭🇹', continent: 'americas' },

    // Americas (South)
    { name: 'Brazil (Rio)', nameAr: 'البرازيل (ريو)', nameFr: 'Brésil (Rio)', city: 'RIO', cityAr: 'ريو', cityFr: 'Rio', timezone: 'America/Sao_Paulo', flag: '🇧🇷', continent: 'americas' },
    { name: 'Brazil (Manaus)', nameAr: 'البرازيل (ماناوس)', nameFr: 'Brésil (Manaus)', city: 'MANAUS', cityAr: 'ماناوس', cityFr: 'Manaus', timezone: 'America/Manaus', flag: '🇧🇷', continent: 'americas' },
    { name: 'Argentina', nameAr: 'الأرجنتين', nameFr: 'Argentine', city: 'BUENOS AIRES', cityAr: 'بوينس آيرس', cityFr: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', continent: 'americas' },
    { name: 'Chile', nameAr: 'تشيلي', nameFr: 'Chili', city: 'SANTIAGO', cityAr: 'سانتياغو', cityFr: 'Santiago', timezone: 'America/Santiago', flag: '🇨🇱', continent: 'americas' },
    { name: 'Colombia', nameAr: 'كولومبيا', nameFr: 'Colombie', city: 'BOGOTÁ', cityAr: 'بوغوتا', cityFr: 'Bogota', timezone: 'America/Bogota', flag: '🇨🇴', continent: 'americas' },
    { name: 'Peru', nameAr: 'بيرو', nameFr: 'Pérou', city: 'LIMA', cityAr: 'ليما', cityFr: 'Lima', timezone: 'America/Lima', flag: '🇵🇪', continent: 'americas' },
    { name: 'Venezuela', nameAr: 'فنزويلا', nameFr: 'Venezuela', city: 'CARACAS', cityAr: 'كاراكاس', cityFr: 'Caracas', timezone: 'America/Caracas', flag: '🇻🇪', continent: 'americas' },
    { name: 'Ecuador', nameAr: 'الإكوادور', nameFr: 'Équateur', city: 'QUITO', cityAr: 'كيتو', cityFr: 'Quito', timezone: 'America/Guayaquil', flag: '🇪🇨', continent: 'americas' },
    { name: 'Bolivia', nameAr: 'بوليڤيا', nameFr: 'Bolivie', city: 'LA PAZ', cityAr: 'لاباز', cityFr: 'La Paz', timezone: 'America/La_Paz', flag: '🇧🇴', continent: 'americas' },
    { name: 'Paraguay', nameAr: 'باراغواي', nameFr: 'Paraguay', city: 'ASUNCIÓN', cityAr: 'أسونسيون', cityFr: 'Asuncion', timezone: 'America/Asuncion', flag: '🇵🇾', continent: 'americas' },
    { name: 'Uruguay', nameAr: 'أوروغواي', nameFr: 'Uruguay', city: 'MONTEVIDEO', cityAr: 'مونتيفيديو', cityFr: 'Montevideo', timezone: 'America/Montevideo', flag: '🇺🇾', continent: 'americas' },

    // Oceania
    { name: 'Australia (Sydney)', nameAr: 'أستراليا (سيدني)', nameFr: 'Australie (Syd)', city: 'SYDNEY', cityAr: 'سيدني', cityFr: 'Sydney', timezone: 'Australia/Sydney', flag: '🇦🇺', continent: 'oceania' },
    { name: 'Australia (Perth)', nameAr: 'أستراليا (بيرث)', nameFr: 'Australie (Perth)', city: 'PERTH', cityAr: 'بيرث', cityFr: 'Perth', timezone: 'Australia/Perth', flag: '🇦🇺', continent: 'oceania' },
    { name: 'New Zealand', nameAr: 'نيوزيلندا', nameFr: 'N.-Zélande', city: 'AUCKLAND', cityAr: 'أوكلاند', cityFr: 'Auckland', timezone: 'Pacific/Auckland', flag: '🇳🇿', continent: 'oceania' },
    { name: 'Fiji', nameAr: 'فيجي', nameFr: 'Fidji', city: 'SUVA', cityAr: 'سوفا', cityFr: 'Suva', timezone: 'Pacific/Fiji', flag: '🇫🇯', continent: 'oceania' },
    { name: 'Papua New Guinea', nameAr: 'بابوا غينيا الجديدة', nameFr: 'Papouasie', city: 'PORT MORESBY', cityAr: 'بورت مورسبي', cityFr: 'Port Moresby', timezone: 'Pacific/Port_Moresby', flag: '🇵🇬', continent: 'oceania' },
    { name: 'Samoa', nameAr: 'ساموا', nameFr: 'Samoa', city: 'APIA', cityAr: 'أبيا', cityFr: 'Apia', timezone: 'Pacific/Apia', flag: '🇼🇸', continent: 'oceania' },
];

const CONTINENTS = [
    { key: 'all', labelAr: 'الكل', Icon: Globe },
    { key: 'asia', labelAr: 'آسيا', Icon: GlobeHemisphereEast },
    { key: 'africa', labelAr: 'أفريقيا', Icon: MapTrifold },
    { key: 'europe', labelAr: 'أوروبا', Icon: MapPin },
    { key: 'americas', labelAr: 'الأمريكتان', Icon: GlobeHemisphereWest },
    { key: 'oceania', labelAr: 'أوقيانوسيا', Icon: Compass },
];

function getTimeInfo(timezone: string) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
    const hour = parseInt(timeStr.split(':')[0]);

    let periodAr: string;
    let periodEn: string;
    let gradient: string;

    // Day/Night logic for styling
    if (hour >= 5 && hour < 7) {
        periodAr = 'شروق'; periodEn = 'Sunrise';
        gradient = 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)';
    } else if (hour >= 7 && hour < 16) {
        periodAr = 'النهار'; periodEn = 'Day';
        gradient = 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)';
    } else if (hour >= 16 && hour < 19) {
        periodAr = 'غروب'; periodEn = 'Sunset';
        gradient = 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)';
    } else {
        periodAr = 'الليل'; periodEn = 'Night';
        gradient = 'linear-gradient(135deg, #141E30 0%, #243B55 100%)';
    }

    const isDay = hour >= 6 && hour < 18;

    return { timeStr, hour, periodAr, periodEn, gradient, isDay };
}

export function WorldClockPage() {
    const { t } = useTranslation();
    const [currentTick, setCurrentTick] = useState(0);
    const [continent, setContinent] = useState('all');
    const [search, setSearch] = useState('');

    // Tick every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTick(t => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const filtered = COUNTRIES.filter(c => {
        const matchContinent = continent === 'all' || c.continent === continent;
        const matchSearch = !search || c.nameAr.includes(search) || c.name.toLowerCase().includes(search.toLowerCase());
        return matchContinent && matchSearch;
    });

    return (
        <div className="flex flex-col gap-lg">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                    <Globe size={24} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 8 }} color="var(--accent-gold)" weight="duotone" />
                    {' '}ساعات العالم
                </h1>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    الوقت الحالي في مختلف دول العالم
                </p>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col gap-md animate-slide-up">
                <div className="relative">
                    <MagnifyingGlass
                        size={18}
                        style={{
                            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                            right: 'var(--space-md)', color: 'var(--text-muted)',
                        }}
                    />
                    <input
                        className="input"
                        style={{ paddingRight: 'calc(var(--space-md) + 26px)' }}
                        placeholder="ابحث عن دولة..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="scroll-bar-hide flex gap-sm stagger-1" style={{
                    overflowX: 'auto',
                    paddingBottom: '12px', /* Space for selection shadow/animation */
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}>
                    <style>{`
                        .scroll-bar-hide::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {CONTINENTS.map(({ key, labelAr, Icon }) => {
                        const isActive = continent === key;
                        return (
                            <button
                                key={key}
                                className={`chip ${isActive ? 'active' : ''}`}
                                onClick={() => setContinent(key)}
                                style={{
                                    flexShrink: 0,
                                    padding: '8px 16px',
                                    fontSize: '0.9rem',
                                    transform: isActive ? 'translateY(-2px)' : 'none',
                                    boxShadow: isActive ? 'var(--shadow-gold)' : 'none',
                                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                }}
                            >
                                <Icon
                                    size={20}
                                    weight={isActive ? "fill" : "duotone"}
                                    className={isActive ? "animate-float" : ""}
                                    style={{ transition: 'all 0.3s ease' }}
                                />
                                <span>{labelAr}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Countries Grid */}
            <div className="grid grid-2 gap-md">
                {filtered.map((country, i) => {
                    const info = getTimeInfo(country.timezone);
                    const fullTime = new Date().toLocaleTimeString('en-US', {
                        timeZone: country.timezone, hour: '2-digit', minute: '2-digit', hour12: true,
                    });

                    return (
                        <div
                            key={country.name}
                            className={`animate-scale-in stagger-${Math.min(i % 6 + 1, 6)}`}
                            style={{
                                position: 'relative',
                                height: 160,
                                borderRadius: 'var(--radius-xl)',
                                overflow: 'hidden',
                                background: info.gradient,
                                boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                                color: info.isDay ? '#1a202c' : '#ffffff', // Dynamic text color
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 'var(--space-md)',
                            }}
                        >
                            {/* Decorative Elements */}

                            {/* Sun/Moon */}
                            <div style={{
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                background: info.isDay ? '#FDB813' : '#F4F6F0',
                                boxShadow: info.isDay
                                    ? '0 0 20px rgba(253, 184, 19, 0.6)'
                                    : '0 0 20px rgba(244, 246, 240, 0.3)',
                                zIndex: 1,
                                opacity: 0.9,
                            }} />

                            {/* Clouds (Pure CSS) */}
                            <div style={{
                                position: 'absolute',
                                bottom: -10,
                                right: 60,
                                width: 80,
                                height: 40,
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '40px',
                                zIndex: 1,
                                filter: 'blur(4px)',
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: 20,
                                left: -20,
                                width: 100,
                                height: 50,
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50px',
                                zIndex: 1,
                                filter: 'blur(8px)',
                            }} />

                            {/* Top Badge (Period & Flag) */}
                            <div style={{
                                zIndex: 10,
                                background: info.isDay ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: 'var(--radius-full)',
                                padding: '4px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                alignSelf: 'center',
                                border: info.isDay ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{info.periodAr}</span>
                                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{country.flag}</span>
                            </div>

                            {/* Main Content */}
                            <div className="flex flex-col items-center text-center" style={{ zIndex: 10, marginTop: 'auto', marginBottom: 'auto' }}>
                                <h2 style={{
                                    fontSize: '1.4rem', // Reduced from 1.8rem
                                    fontWeight: 700,
                                    marginBottom: 4, // Added slight margin
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    lineHeight: 1.2
                                }}>
                                    {country.nameAr}
                                </h2>
                                <span style={{
                                    fontSize: '0.65rem', // Reduced from 0.75rem
                                    letterSpacing: 1.5, // Reduced letter spacing
                                    textTransform: 'uppercase',
                                    opacity: 0.9,
                                    fontFamily: 'sans-serif'
                                }}>
                                    {country.city}
                                </span>
                            </div>

                            {/* Time Display (Optional, can be added if needed, user didn't explicitly ask for time digits but usually expected) */}
                            <div style={{
                                zIndex: 10,
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                background: info.isDay ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-sm)'
                            }}>
                                {fullTime}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
