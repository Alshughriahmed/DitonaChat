export type Gender = 'female' | 'male' | 'couple' | 'lgbtq' | 'unknown';
export interface PeerProfile {
  name?: string;
  gender: Gender;
  country?: string;
  city?: string;
  likes?: number;
  isVip?: boolean;
  avatarDataUrl?: string; // صورة مصغّرة base64 (اختيارية)
}
