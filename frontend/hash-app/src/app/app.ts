import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG Theme - Add this in your styles.scss or angular.json
// @import "primeng/resources/themes/lara-light-blue/theme.css";
// @import "primeng/resources/primeng.min.css";
// @import "primeicons/primeicons.css";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AppComponent {}