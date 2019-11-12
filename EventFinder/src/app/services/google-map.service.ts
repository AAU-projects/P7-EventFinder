import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  private APIKEY = 'AIzaSyCj6DAd2_FVNu73UmA41f4mjnbfP2Y2NhU';

  constructor(private httpClient: HttpClient) {}

  get_location(address) {
    return this.httpClient.get(this.get_api_address(address));
  }

  private get_api_address(address) {
    return (
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      address +
      '&key=' +
      this.APIKEY
    );
  }

  get_city_from_zip(zipcode) {
    return this.httpClient.get(this.get_api_zip(zipcode));
  }

  private get_api_zip(zipcode) {
    return ('https://maps.google.com/maps/api/geocode/json?components=country:DK%7Cpostal_code:' +
    zipcode +
    '&key=' +
    this.APIKEY
    );
  }
}
