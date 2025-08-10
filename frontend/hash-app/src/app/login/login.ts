import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    RouterModule
  ],
  providers: [MessageService],
  template: `
    <div class="login-container">
      <p-toast></p-toast>
      <div class="login-card">
        <h2>Login</h2>
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="p-field">
            <label for="username" class="p-d-block">Username</label>
            <input 
              pInputText 
              id="username" 
              [(ngModel)]="user.username" 
              name="username"
              placeholder="Enter your username"
              class="p-d-block"
              required>
          </div>
          <div class="p-field">
            <label for="password" class="p-d-block">Password</label>
            <p-password 
              id="password" 
              [(ngModel)]="user.password" 
              name="password"
              placeholder="Enter your password"
              [feedback]="false"
              [toggleMask]="true"
              class="p-d-block"
              required>
            </p-password>
          </div>
          <p-button 
            type="submit" 
            label="Sign In" 
            styleClass="p-button-primary p-button-block"
            [disabled]="loading"
            [loading]="loading">
          </p-button>
          
          <div class="register-link">
            Don't have an account? <a [routerLink]="['/register']">Create one</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 2rem;
    }
    
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      text-align: center;
      color: #333;
    }
    
    .login-form .p-field {
      margin-bottom: 1.5rem;
    }
    
    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #6c757d;
    }
    
    .register-link a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }
    
    .register-link a:hover {
      text-decoration: underline;
    }
    
    .login-form label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #495057;
    }
    
    .p-password, .p-inputtext {
      width: 100%;
    }
    
    .p-button {
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  user = { username: '', password: '' };
  loading = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private messageService: MessageService
  ) {}

  onLogin(): void {
    this.loading = true;
    this.authService.login(this.user).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Login successful',
          life: 3000
        });
        this.router.navigate(['/upload']);
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: error.error?.message || 'Invalid credentials',
          life: 3000
        });
      }
    });
  }
}