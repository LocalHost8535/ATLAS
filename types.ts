
export enum AppStep {
  SPLASH = 'SPLASH',
  LOGIN = 'LOGIN',
  PROFILE = 'PROFILE',
  MAIN = 'MAIN'
}

export interface StopInfo {
  name: string;
  time: string;
  fareFromStart: string;
}

export interface BusRoute {
  id: string;
  busNumber: string;
  arrivalTime: string;
  passingAreas: string[];
  endDestination: string;
  duration: string;
  type: string;
  isLate: boolean;
  baseFare: string;
  provider: string; // e.g., APSRTC
  schedule: StopInfo[];
  currentLocation?: { lat: number; lng: number }; 
  verifiedSources?: { title: string; uri: string }[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: { title: string; uri: string }[];
}

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  email: string;
  phone: string;
  language: string;
  favorites: string[];
  history: {
    date: string;
    route: string;
    busNumber: string;
  }[];
}

export interface TravelSearch {
  pickup: string;
  drop: string;
}
