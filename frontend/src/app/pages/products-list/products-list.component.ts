import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  page = 1;
  limit = 5;
  total = 0;
  loading = false;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.list(this.page, this.limit).subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.total = res.total ?? this.products.length;
        this.loading = false;
        this.error = '';
      },
      error: () => {
        this.loading = false;
        this.error = 'Error cargando productos';
      },
    });
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.loadProducts();
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
