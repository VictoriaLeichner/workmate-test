import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.scss'],
})
export class AdminComponent implements OnInit {
  @ViewChild('formSection') formSection!: ElementRef;

  form!: FormGroup;
  products: Product[] = [];
  loading = false;
  error = '';

  editingProduct: Product | null = null;
  toast: { type: 'success' | 'error'; message: string } | null = null;

  showForm = false;
  page = 1;
  limit = 50;
  total = 0;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page = this.page, limit = this.limit): void {
    this.loading = true;
    this.productService.list(page, limit).subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.total = res.total ?? (this.products.length || 0);
        this.page = res.page ?? page;
        this.limit = res.limit ?? limit;
        this.loading = false;
        this.error = '';
      },
      error: () => {
        this.loading = false;
        this.error = 'Error cargando productos';
        this.showToast('error', 'Error cargando productos');
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.markAllAsTouched();
      this.showToast('error', 'Completá los campos obligatorios correctamente');
      return;
    }

    const payload: Product = {
      name: String(this.form.value['name']).trim(),
      description: String(this.form.value['description']).trim(),
      price: Number(this.form.value['price']),
    };

    if (this.editingProduct) {
      this.productService.update(this.editingProduct.id!, payload).subscribe({
        next: () => {
          this.showToast('success', 'Producto actualizado');
          this.cancelEdit();
          this.loadProducts();
        },
        error: () => this.showToast('error', 'Error al actualizar producto'),
      });
    } else {
      this.productService.create(payload).subscribe({
        next: () => {
          this.showToast('success', 'Producto creado');
          this.form.reset();
          this.form.patchValue({ price: null });
          this.loadProducts();
        },
        error: () => this.showToast('error', 'Error creando producto'),
      });
    }
  }

  edit(product: Product): void {
    this.editingProduct = product;
    this.form.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    this.showForm = true;
    this.scrollToForm();
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.form.reset();
    this.form.patchValue({ price: null });
    this.showForm = false;
  }

  delete(id: number | undefined): void {
    if (!id || !confirm('¿Eliminar producto?')) return;
    this.productService.remove(id).subscribe({
      next: () => {
        this.showToast('success', 'Producto eliminado');
        this.loadProducts();
      },
      error: () => this.showToast('error', 'Error al eliminar producto'),
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

  scrollToForm() {
    if (this.formSection) {
      this.formSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.showForm = true;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  private showToast(type: 'success' | 'error', message: string) {
    this.toast = { type, message };
    setTimeout(() => (this.toast = null), 3000);
  }

  private markAllAsTouched() {
    Object.values(this.form.controls).forEach((c) => c.markAsTouched());
  }
} 
