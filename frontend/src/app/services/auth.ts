import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'access_token';
  private readonly baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(`${this.baseUrl}/login`, { username, password })
      .pipe(tap(res => localStorage.setItem(this.tokenKey, res.access_token)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserFromToken(): { sub?: number; username?: string; role?: string } | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { sub: payload.sub, username: payload.username, role: payload.role };
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    return this.getUserFromToken()?.role ?? null;
  }
}
