import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  private APIKEY = 'AIzaSyAxJpRUrMbG264kgpMZNhk916zvqP1K08U';

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
}
