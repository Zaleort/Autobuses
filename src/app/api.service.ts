import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  fetchApi(url: string) {
    console.log(url);
    return this.http.get(url);
  }
}
