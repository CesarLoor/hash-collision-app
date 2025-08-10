import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HashService {
  private apiUrl = 'http://localhost:3000/hash';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  uploadFile(file: File): Observable<{ hashes: { md5: string; sha1: string; sha256: string }; collision: boolean }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/upload`, formData, { headers: this.getHeaders() });
  }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`, { headers: this.getHeaders() });
  }

  updateHistory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/history/${id}`, data, { headers: this.getHeaders() });
  }

  deleteHistory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/history/${id}`, { headers: this.getHeaders() });
  }
}