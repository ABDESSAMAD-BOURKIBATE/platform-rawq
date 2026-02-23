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
        governanceAr: "ملكبة مطلقة",
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
    }
    // More can be added as needed
};
