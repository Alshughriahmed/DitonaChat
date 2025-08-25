export type Gender = 'female'|'male'|'couple'|'lgbtq';
export type UserPrefs = {
  name: string;
  avatarDataUrl?: string|null;
  autoTranslate: boolean;
  language: string;
  hideLocation: boolean;   // VIP gate
  gender: Gender;
  introEnabled: boolean;   // VIP gate
  introText: string;
  vipSim?: boolean;        // dev only
};

const KEY='ditona:prefs:v1';

const defaults: UserPrefs = {
  name: '',
  avatarDataUrl: null,
  autoTranslate: false,
  language: typeof navigator!=='undefined' ? navigator.language : 'en',
  hideLocation: false,
  gender: 'female',
  introEnabled: false,
  introText: '',
  vipSim: false,
};

export function loadPrefs(): UserPrefs {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...defaults, ...JSON.parse(raw) }; }
  catch {}
  return { ...defaults };
}
export function savePrefs(p: UserPrefs) { localStorage.setItem(KEY, JSON.stringify(p)); }

export function isVip(p: UserPrefs): boolean { return !!p.vipSim; } // لاحقاً اربطها بحالة الاشتراك الحقيقية
