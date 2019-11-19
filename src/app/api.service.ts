import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiError } from './interfaces/api-responses';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private http: HttpClient) {}

  fetchApi(url: string) {
    return this.http.get(url);
  }

  hasError(res: any): res is ApiError {
    return (res as ApiError).error !== undefined;
  } 
}
