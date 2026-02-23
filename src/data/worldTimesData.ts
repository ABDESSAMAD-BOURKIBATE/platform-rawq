export interface CountryDetail {
    id: string;
    cities: string[];
    citiesAr: string[];
    governance: string;
    governanceAr: string;
    ruler: string;
    rulerAr: string;
    muslimPopulation: string;
    muslimPopulationAr: string;
    muslimSafetyPercentage: number;
    location: string;
    locationAr: string;
}

export const COUNTRY_DETAILS: Record<string, CountryDetail> = {
    "Saudi Arabia": {
        id: "Saudi Arabia",
        cities: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam"],
        citiesAr: ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام"],
        governance: "Absolute Monarchy",
        governanceAr: "ملكية مطلقة",
        ruler: "King Salman bin Abdulaziz",
        rulerAr: "الملك سلمان بن عبد العزيز",
        muslimPopulation: "approx. 32 million (93%)",
        muslimPopulationAr: "حوالي 32 مليون (93%)",
        muslimSafetyPercentage: 100,
        location: "Middle East, Western Asia",
        locationAr: "الشرق الأوسط، غرب آسيا"
    },
    "Morocco": {
        id: "Morocco",
        cities: ["Rabat", "Casablanca", "Marrakesh", "Fes", "Tangier"],
        citiesAr: ["الرباط", "الدار البيضاء", "مراكش", "فاس", "طنجة"],
        governance: "Constitutional Monarchy",
        governanceAr: "ملكية دستورية",
        ruler: "King Mohammed VI",
        rulerAr: "الملك محمد السادس",
        muslimPopulation: "approx. 37 million (99%)",
        muslimPopulationAr: "حوالي 37 مليون (99%)",
        muslimSafetyPercentage: 100,
        location: "North Africa, Maghreb",
        locationAr: "شمال أفريقيا، المغرب العربي"
    },
    "UAE": {
        id: "UAE",
        cities: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Al Ain"],
        citiesAr: ["أبوظبي", "دبي", "الشارقة", "عجمان", "العين"],
        governance: "Federal Elective Monarchy",
        governanceAr: "ملكية اتحادية وراثية",
        ruler: "Sheikh Mohamed bin Zayed Al Nahyan",
        rulerAr: "الشيخ محمد بن زايد آل نهيان",
        muslimPopulation: "approx. 7.5 million (76%)",
        muslimPopulationAr: "حوالي 7.5 مليون (76%)",
        muslimSafetyPercentage: 100,
        location: "Middle East, Arabian Peninsula",
        locationAr: "الشرق الأوسط، الجزيرة العربية"
    },
    "Egypt": {
        id: "Egypt",
        cities: ["Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said"],
        citiesAr: ["القاهرة", "الإسكندرية", "الجيزة", "شبرا الخيمة", "بورسعيد"],
        governance: "Republic",
        governanceAr: "جمهورية",
        ruler: "Abdel Fattah el-Sisi",
        rulerAr: "عبد الفتاح السيسي",
        muslimPopulation: "approx. 95 million (90%)",
        muslimPopulationAr: "حوالي 95 مليون (90%)",
        muslimSafetyPercentage: 98,
        location: "North Africa",
        locationAr: "شمال أفريقيا"
    },
    "Turkey": {
        id: "Turkey",
        cities: ["Ankara", "Istanbul", "Izmir", "Bursa", "Antalya"],
        citiesAr: ["أنقرة", "إسطنبول", "إزمير", "بورصة", "أنطاليا"],
        governance: "Presidential Republic",
        governanceAr: "جمهورية رئاسية",
        ruler: "Recep Tayyip Erdoğan",
        rulerAr: "رجب طيب أردوغان",
        muslimPopulation: "approx. 83 million (99%)",
        muslimPopulationAr: "حوالي 83 مليون (99%)",
        muslimSafetyPercentage: 99,
        location: "Western Asia & Southeast Europe",
        locationAr: "غرب آسيا وجنوب شرق أوروبا"
    },
    "Qatar": {
        id: "Qatar",
        cities: ["Doha", "Al Wakrah", "Al Khor", "Al Rayyan", "Madinat ash Shamal"],
        citiesAr: ["الدوحة", "الوكرة", "الخور", "الريان", "مدينة الشمال"],
        governance: "Semi-constitutional Monarchy",
        governanceAr: "ملكية شبه دستورية",
        ruler: "Sheikh Tamim bin Hamad Al Thani",
        rulerAr: "الشيخ تميم بن حمد آل ثاني",
        muslimPopulation: "approx. 2.1 million (67%)",
        muslimPopulationAr: "حوالي 2.1 مليون (67%)",
        muslimSafetyPercentage: 100,
        location: "Middle East, Arabian Peninsula",
        locationAr: "الشرق الأوسط، الجزيرة العربية"
    },
    "Indonesia": {
        id: "Indonesia",
        cities: ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang"],
        citiesAr: ["جاكرتا", "سورابايا", "باندونج", "ميدان", "سمارانج"],
        governance: "Republic",
        governanceAr: "جمهورية",
        ruler: "Prabowo Subianto",
        rulerAr: "برابوو سوبيانتو",
        muslimPopulation: "approx. 231 million (87%)",
        muslimPopulationAr: "حوالي 231 مليون (87%)",
        muslimSafetyPercentage: 97,
        location: "Southeast Asia",
        locationAr: "جنوب شرق آسيا"
    },
    "Malaysia": {
        id: "Malaysia",
        cities: ["Kuala Lumpur", "George Town", "Ipoh", "Shah Alam", "Johor Bahru"],
        citiesAr: ["كوالالمبور", "جورج تاون", "إيبوه", "شاه علم", "جوهر بهرو"],
        governance: "Federal Constitutional Monarchy",
        governanceAr: "ملكية دستورية اتحادية",
        ruler: "Sultan Ibrahim ibni Sultan Iskandar",
        rulerAr: "السلطان إبراهيم بن السلطان إسكندر",
        muslimPopulation: "approx. 20 million (63%)",
        muslimPopulationAr: "حوالي 20 مليون (63%)",
        muslimSafetyPercentage: 100,
        location: "Southeast Asia",
        locationAr: "جنوب شرق آسيا"
    },
    "Palestine": {
        id: "Palestine",
        cities: ["Jerusalem", "Gaza City", "Hebron", "Nablus", "Ramallah"],
        citiesAr: ["القدس الشريف", "غزة", "الخليل", "نابلس", "رام الله"],
        governance: "Semi-presidential Republic",
        governanceAr: "جمهورية شبه رئاسية",
        ruler: "Mahmoud Abbas",
        rulerAr: "محمود عباس",
        muslimPopulation: "approx. 5 million (93%)",
        muslimPopulationAr: "حوالي 5 مليون (93%)",
        muslimSafetyPercentage: 20,
        location: "Middle East, Levant",
        locationAr: "الشرق الأوسط، بلاد الشام"
    },
    "Algeria": {
        id: "Algeria",
        cities: ["Algiers", "Oran", "Constantine", "Annaba", "Blida"],
        citiesAr: ["الجزائر العاصمة", "وهران", "قسنطينة", "عنابة", "البليدة"],
        governance: "Semi-presidential Republic",
        governanceAr: "جمهورية شبه رئاسية",
        ruler: "Abdelmadjid Tebboune",
        rulerAr: "عبد المجيد تبون",
        muslimPopulation: "approx. 44 million (99%)",
        muslimPopulationAr: "حوالي 44 مليون (99%)",
        muslimSafetyPercentage: 100,
        location: "North Africa, Maghreb",
        locationAr: "شمال أفريقيا، المغرب العربي"
    },
    "Tunisia": {
        id: "Tunisia",
        cities: ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte"],
        citiesAr: ["تونس العاصمة", "صفاقس", "سوسة", "القيروان", "بنزرت"],
        governance: "Unitary Presidential Republic",
        governanceAr: "جمهورية رئاسية موحدة",
        ruler: "Kais Saied",
        rulerAr: "قيس سعيد",
        muslimPopulation: "approx. 11.5 million (99%)",
        muslimPopulationAr: "حوالي 11.5 مليون (99%)",
        muslimSafetyPercentage: 100,
        location: "North Africa, Maghreb",
        locationAr: "شمال أفريقيا، المغرب العربي"
    },
    "Kuwait": {
        id: "Kuwait",
        cities: ["Kuwait City", "Al Ahmadi", "Hawalli", "Salmiya", "Sabah Al Salem"],
        citiesAr: ["مدينة الكويت", "الأحمدي", "حولي", "السالمية", "صباح السالم"],
        governance: "Unitary Semi-constitutional Monarchy",
        governanceAr: "ملكية دستورية",
        ruler: "Sheikh Mishal Al-Ahmad Al-Jaber Al-Sabah",
        rulerAr: "الشيخ مشعل الأحمد الجابر الصباح",
        muslimPopulation: "approx. 3.5 million (74%)",
        muslimPopulationAr: "حوالي 3.5 مليون (74%)",
        muslimSafetyPercentage: 100,
        location: "Middle East, Arabian Peninsula",
        locationAr: "الشرق الأوسط، الجزيرة العربية"
    },
    "Oman": {
        id: "Oman",
        cities: ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur"],
        citiesAr: ["مسقط", "صلالة", "صحار", "نزوى", "صور"],
        governance: "Absolute Monarchy",
        governanceAr: "ملكية مطلقة",
        ruler: "Haitham bin Tariq",
        rulerAr: "هيثم بن طارق",
        muslimPopulation: "approx. 4.5 million (86%)",
        muslimPopulationAr: "حوالي 4.5 مليون (86%)",
        muslimSafetyPercentage: 100,
        location: "Middle East, Arabian Peninsula",
        locationAr: "الشرق الأوسط، الجزيرة العربية"
    },
    "Jordan": {
        id: "Jordan",
        cities: ["Amman", "Zarqa", "Irbid", "Aqaba", "Madaba"],
        citiesAr: ["عمان", "الزرقاء", "إربد", "العقبة", "مادبا"],
        governance: "Constitutional Monarchy",
        governanceAr: "ملكية دستورية",
        ruler: "King Abdullah II",
        rulerAr: "الملك عبد الله الثاني",
        muslimPopulation: "approx. 10 million (97%)",
        muslimPopulationAr: "حوالي 10 مليون (97%)",
        muslimSafetyPercentage: 100,
        location: "Middle East, Levant",
        locationAr: "الشرق الأوسط، بلاد الشام"
    }
    // More can be added as needed
};
