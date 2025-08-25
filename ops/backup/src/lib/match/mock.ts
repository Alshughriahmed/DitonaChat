export type DemoPeer = {
  id: string;
  name: string;
  avatarUrl?: string;
  gender?: 'male'|'female'|'couple'|'lgbtq';
  country?: string; // ISO alpha-2
  city?: string;
  likes?: number;
  isVip?: boolean;
};

export const demoProfiles: DemoPeer[] = [
  { id: "p1", name: "Mia",  gender: "female", country:"DE", city:"Berlin", likes: 12, isVip: true  },
  { id: "p2", name: "Luca", gender: "male",   country:"IT", city:"Rome",   likes: 7,  isVip: false },
  { id: "p3", name: "Alex", gender: "lgbtq",  country:"US", city:"NYC",    likes: 19, isVip: true  },
];

export class MockMatchService {
  private i = 0;
  current(){ return demoProfiles[this.i]; }
  next(){ this.i = (this.i + 1) % demoProfiles.length; return this.current(); }
  prev(){ this.i = (this.i - 1 + demoProfiles.length) % demoProfiles.length; return this.current(); }
}
