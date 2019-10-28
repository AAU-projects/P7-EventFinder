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
}

export interface Organizer extends Account {
    organization: string;
    address: string;
    tags: Tags[];
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

