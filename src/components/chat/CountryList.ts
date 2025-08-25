export type Country = { code: string; name: string };

/** القائمة الكاملة ككائنات */
export const COUNTRY_PAIRS: Country[] = [
  // English-speaking
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "IE", name: "Ireland" },

  // Europe (EU + EEA/EFTA)
  { code: "DE", name: "Germany" }, { code: "FR", name: "France" },
  { code: "IT", name: "Italy" }, { code: "ES", name: "Spain" },
  { code: "PT", name: "Portugal" }, { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" }, { code: "LU", name: "Luxembourg" },
  { code: "AT", name: "Austria" }, { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" }, { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" }, { code: "IS", name: "Iceland" },
  { code: "CH", name: "Switzerland" }, { code: "LI", name: "Liechtenstein" },
  { code: "PL", name: "Poland" }, { code: "CZ", name: "Czechia" },
  { code: "SK", name: "Slovakia" }, { code: "HU", name: "Hungary" },
  { code: "SI", name: "Slovenia" }, { code: "HR", name: "Croatia" },
  { code: "RO", name: "Romania" }, { code: "BG", name: "Bulgaria" },
  { code: "GR", name: "Greece" }, { code: "EE", name: "Estonia" },
  { code: "LV", name: "Latvia" }, { code: "LT", name: "Lithuania" },
  { code: "MT", name: "Malta" }, { code: "CY", name: "Cyprus" },
  // Wider Europe & nearby
  { code: "TR", name: "Turkey" }, { code: "UA", name: "Ukraine" },
  { code: "RS", name: "Serbia" }, { code: "BA", name: "Bosnia & Herzegovina" },
  { code: "ME", name: "Montenegro" }, { code: "MK", name: "North Macedonia" },
  { code: "AL", name: "Albania" }, { code: "MD", name: "Moldova" },

  // MENA
  { code: "AE", name: "United Arab Emirates" }, { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" }, { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" }, { code: "OM", name: "Oman" },
  { code: "JO", name: "Jordan" }, { code: "LB", name: "Lebanon" },
  { code: "IL", name: "Israel" }, { code: "EG", name: "Egypt" },

  // South Asia
  { code: "IN", name: "India" }, { code: "PK", name: "Pakistan" },
  { code: "BD", name: "Bangladesh" }, { code: "LK", name: "Sri Lanka" },
  { code: "NP", name: "Nepal" }, { code: "BT", name: "Bhutan" },
  { code: "MV", name: "Maldives" },

  // East Asia
  { code: "CN", name: "China" }, { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" }, { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },

  // Southeast Asia
  { code: "SG", name: "Singapore" }, { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" }, { code: "PH", name: "Philippines" },
  { code: "TH", name: "Thailand" }, { code: "VN", name: "Vietnam" },
  { code: "KH", name: "Cambodia" }, { code: "LA", name: "Laos" },
  { code: "MM", name: "Myanmar" }, { code: "BN", name: "Brunei" },

  // Central Asia & Caucasus
  { code: "KZ", name: "Kazakhstan" }, { code: "UZ", name: "Uzbekistan" },
  { code: "TM", name: "Turkmenistan" }, { code: "KG", name: "Kyrgyzstan" },
  { code: "TJ", name: "Tajikistan" }, { code: "GE", name: "Georgia" },
  { code: "AM", name: "Armenia" }, { code: "AZ", name: "Azerbaijan" },

  // Oceania (extra)
  { code: "FJ", name: "Fiji" }, { code: "PG", name: "Papua New Guinea" }
];

/** نسخة جاهزة للاستخدام في الـUI: تتضمن "All Countries" في الأعلى */
export const COUNTRY_OPTIONS: Country[] = [
  { code: "", name: "All Countries" },
  ...COUNTRY_PAIRS,
];

/** توافق قديم: مصفوفة أسماء فقط (كانت متوقعة في الواجهة الحالية) */
export const COUNTRIES: string[] = COUNTRY_OPTIONS.map(c => c.name);

/** default = الأسماء فقط (توافقاً مع الاستيراد القديم) */
export default COUNTRIES;
