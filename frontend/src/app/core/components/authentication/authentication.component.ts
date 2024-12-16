import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'nta-authentication',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
<!-- login.component.html -->
<div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
  <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">


  

    <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Sign In</h2>
    
    <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4">
      <!-- Username Field -->
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
        <input 
          type="text" 
          id="username" 
          formControlName="username"
          placeholder="Enter your username"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1"
          [ngClass]="loginForm.get('username')?.invalid && (loginForm.get('username')?.dirty || loginForm.get('username')?.touched)?'border-red-400 focus:ring-red-500':'focus:ring-green-400'"
        >
        <small 
          *ngIf="loginForm.get('username')?.invalid && (loginForm.get('username')?.dirty || loginForm.get('username')?.touched)"
          class="text-red-500 text-xs mt-1"
        >
          Username is required
        </small>
      </div>

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input 
          type="password" 
          id="password" 
          formControlName="password"
          placeholder="Enter your password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          [ngClass]="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)?'border-red-400 focus:ring-red-500':'focus:ring-green-400'"
        >
        <small 
          *ngIf="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)"
          class="text-red-500 text-xs mt-1"
        >
          Password is required and must be at least 6 characters
        </small>
      </div>

      <!-- Login Button -->
      <button 
        type="submit" 
        [disabled]="loginForm.invalid"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[yellow] hover:bg-[#8B9F82]/95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed outline-none"
      >
        Sign In
      </button>

      <!-- Forgotten Password and Register Links -->
      <div class="flex justify-between text-sm text-gray-600 mt-2">
        <a (click)="navigateToForgetPassword()" class="hover:text-green-600 cursor-pointer">Forgot Password?</a>
        <a (click)="navigateToRegister()" class="hover:text-green-600 cursor-pointer">Not registered yet?</a>
      </div>

      
    </form>
  </div>
</div>

  `,
  styles: [],
})


export class AuthenticationComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/home']);
      }
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  // Method for Google login
  loginWithGoogle() {
    console.log('Logging in with Google');
    // Logic for Google login
  }

  // Method for GitHub login
  loginWithGitHub() {
    console.log('Logging in with GitHub');
    // Logic for GitHub login
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToForgetPassword() {
    this.router.navigate(['/forget-password']);
  }
}
