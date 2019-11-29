import { Genre, Atmosphere } from './event.model';

export interface Account {
    uid: string;
    email: string;
    zip: string;
    country: string;
    phone: string;
    city: string;
    profileImage: string;
}

export interface User extends Account {
    firstname: string;
    lastname: string;
    birthday: Date;
    sex: Sex;
    preferences: Genre|Atmosphere|Tags[];
    organizations: string[];
    recommended: string[];
    recommendedWeights: any;
}

export interface Organization extends Account {
    organization: string;
    address: string;
    about: string;
    tags: Tags[];
    connectedUsers: string[];
}

export enum Sex {
    Male = 'male',
    Female = 'female'
}

export enum Tags {
  Nightclub = 'Nightclub',
  LoudMusic = 'Loud Music',
  LiveMusic = 'Live Music',
  Venue = 'Venue',
  Culture = 'Culture',
  Resturant = 'Resturant',
  Bar = 'Bar',
  Pub = 'Pub',
  Festival = 'Festival',
  Other = 'Other'
}

