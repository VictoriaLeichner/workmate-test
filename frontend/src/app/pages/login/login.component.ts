import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  form: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.error = 'Completá usuario y contraseña (mínimo 6 caracteres).';
      return;
    }
    const { username, password } = this.form.value;
    this.auth.login(username, password).subscribe({
      next: () => {
        const role = this.auth.getRole();
        this.router.navigate([role === 'admin' ? '/admin' : '/products']);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Credenciales inválidas';
      },
    });
  }
}
