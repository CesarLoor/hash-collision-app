import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
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
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 2rem;
    }
    
    .card {
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
    
    .register-form .p-field {
      margin-bottom: 1.5rem;
    }
    
    .register-form label {
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
    
    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #6c757d;
    }
    
    .login-link a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }
    
    .login-link a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 600px) {
      .register-container {
        padding: 1rem;
      }
      
      .card {
        padding: 1.5rem;
      }
    }
  `],
  template: `
    <div class="register-container">
      <p-toast></p-toast>
      <div class="card">
        <h2>Create Account</h2>
        <form (ngSubmit)="onRegister()" class="register-form">
          <div class="p-field">
            <label for="username" class="p-d-block">Username</label>
            <input 
              pInputText 
              id="username" 
              [(ngModel)]="user.username" 
              name="username"
              placeholder="Choose a username"
              class="p-d-block"
              required>
          </div>
          <div class="p-field">
            <label for="password" class="p-d-block">Password</label>
            <p-password 
              id="password" 
              [(ngModel)]="user.password" 
              name="password"
              placeholder="Create a password"
              [feedback]="true"
              [toggleMask]="true"
              class="p-d-block"
              required>
              <ng-template pTemplate="header">
                <h6>Pick a strong password</h6>
              </ng-template>
              <ng-template pTemplate="footer">
                <p class="p-mt-2">Requirements</p>
                <p class="p-ml-2 p-mt-0" style="font-size: 0.8rem;">At least 8 characters</p>
              </ng-template>
            </p-password>
          </div>
          <p-button 
            type="submit" 
            label="Create Account" 
            styleClass="p-button-primary p-button-block"
            [loading]="loading">
          </p-button>
          <div class="login-link">
            Already have an account? <a [routerLink]="['/login']">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  user = { username: '', password: '' };
  loading = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private messageService: MessageService
  ) {}

  onRegister(): void {
    this.loading = true;
    this.authService.register(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Account created successfully! Please log in.',
          life: 3000
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Registration Failed', 
          detail: error.error?.message || 'An error occurred during registration',
          life: 5000
        });
      }
    });
  }
}