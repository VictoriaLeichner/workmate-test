import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  list(page = 1, limit = 10): Observable<{ data: Product[]; total: number; page: number; limit: number }> {
    return this.http.get<{ data: Product[]; total: number; page: number; limit: number }>(
      `${this.baseUrl}?page=${page}&limit=${limit}`
    );
  }

  get(id: number) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(payload: Product) {
    return this.http.post<Product>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<Product>) {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: number) {
    return this.http.delete<{ deleted: boolean }>(`${this.baseUrl}/${id}`);
  }
}
