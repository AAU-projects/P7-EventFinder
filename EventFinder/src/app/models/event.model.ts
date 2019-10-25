export interface Event {
  organizerId: string;
  title: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  age: number;
  price: number;
  description: string;
  startDate: Date;
  endDate: Date;
  banner: string;
  genre: Genre[];
  atmosphere: Atmosphere[];
  atmosphereCustom: string[];
  dresscode: Dresscode;
}

export enum Genre {
  Jazz = 'Jazz',
  Rock = 'Rock',
  HipHop = 'HipHop',
  Classical = 'Clasical',
  Country = 'Country',
  Pop = 'Pop',
  EDM = 'EDM',
  Rap = 'Rap',
  Disco = 'Disco',
  Techno = 'Techno',
  Alternative = 'Alternative',
  Dance = 'Dance',
  House = 'House',
}

export enum Atmosphere {
  Underground = 'Underground',
  Alternative = 'Alternative',
  International = 'International',
  Bar = 'Bar',
  Student = 'Student',
  LivePerformance = 'Live Performance',
  Hipster = 'Hispter',
}

export enum Dresscode {
  Casual = 'Casual',
  Elegant = 'Elegant',
  Smart = 'Smart',
  Masquerade = 'Masquerade'
}
