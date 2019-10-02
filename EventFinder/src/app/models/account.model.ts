export interface Account {
    uid: string;
    email: string;
    name: string;
    zip: string;
    country: string;
    phone: string;
}

export interface User extends Account {
    birthday: Date;
    sex: Sex;
}

export interface Organizer extends Account {
    organization: string;
    address: string;
}

export enum Sex {
    Male = 'male',
    Female = 'female'
}
