import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  async sendPostReq(endpoint: string, jsonData: any) {
    return await this.http.post(`${this.apiUrl}${endpoint}`, jsonData).toPromise();
  }
}
