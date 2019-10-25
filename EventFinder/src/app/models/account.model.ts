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
}

export interface Organizer extends Account {
    organization: string;
    address: string;
    about: string;
    profileImage: string;
}

export enum Sex {
    Male = 'male',
    Female = 'female'
}
