import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HashService } from '../hash';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  styles: [`
    .upload-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .card {
      background: var(--surface-card);
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }
    
    .upload-button {
      margin-bottom: 2rem;
    }
    
    .result-container {
      margin-top: 2rem;
    }
    
    .result-card {
      background: var(--surface-50);
      border-left: 4px solid var(--primary-color);
      padding: 1.5rem;
      border-radius: 6px;
      margin-top: 1rem;
    }
    
    .result-card.collision {
      border-left-color: var(--red-500);
    }
    
    .hash-row {
      display: flex;
      margin-bottom: 0.75rem;
      font-family: monospace;
    }
    
    .hash-label {
      font-weight: 600;
      width: 80px;
      color: var(--text-color-secondary);
    }
    
    .hash-value {
      flex: 1;
      word-break: break-all;
    }
    
    .status {
      display: flex;
      align-items: center;
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 4px;
      font-weight: 500;
    }
    
    .status i {
      margin-right: 0.5rem;
    }
    
    .status-success {
      background-color: var(--green-100);
      color: var(--green-700);
    }
    
    .status-warning {
      background-color: var(--orange-100);
      color: var(--orange-700);
    }
    
    @media (max-width: 600px) {
      .upload-container {
        padding: 1rem;
      }
      
      .card {
        padding: 1.25rem;
      }
      
      .hash-row {
        flex-direction: column;
      }
      
      .hash-label {
        margin-bottom: 0.25rem;
        width: 100%;
      }
    }
  `],
  template: `
    <div class="upload-container">
      <p-toast></p-toast>
      <div class="card">
        <h2>Upload File</h2>
        <p-fileUpload 
          mode="basic" 
          (onSelect)="onFileSelect($event)" 
          chooseLabel="Choose File"
          accept=".txt,.pdf,.doc,.docx"
          [showUploadButton]="false"
          [showCancelButton]="false"
          [auto]="true"
          class="upload-button">
        </p-fileUpload>
        
        <p-progressSpinner *ngIf="uploading" styleClass="w-4rem h-4rem" strokeWidth="4" fill="var(--surface-ground)" animationDuration=".5s"></p-progressSpinner>
        
        <div *ngIf="result" class="result-container">
          <div class="result-card" [ngClass]="{'collision': result.collision}">
            <h3>Hash Results</h3>
            <div class="hash-row">
              <span class="hash-label">MD5:</span>
              <span class="hash-value">{{result.hashes.md5}}</span>
            </div>
            <div class="hash-row">
              <span class="hash-label">SHA-1:</span>
              <span class="hash-value">{{result.hashes.sha1}}</span>
            </div>
            <div class="hash-row">
              <span class="hash-label">SHA-256:</span>
              <span class="hash-value">{{result.hashes.sha256}}</span>
            </div>
            <div class="status" [ngClass]="{'status-warning': result.collision, 'status-success': !result.collision}">
              <i [class]="result.collision ? 'pi pi-exclamation-triangle' : 'pi pi-check-circle'"></i>
              {{ result.collision ? 'Collision Detected!' : 'No Collision Detected' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UploadComponent {
  result: { hashes: { md5: string; sha1: string; sha256: string }; collision: boolean } | null = null;
  uploading = false;

  constructor(private hashService: HashService, private messageService: MessageService) {}

  onFileSelect(event: { files: File[] }): void {
    const file = event.files[0];
    if (!file) return;
    
    this.uploading = true;
    this.result = null;
    
    this.hashService.uploadFile(file).subscribe({
      next: (res) => {
        this.uploading = false;
        this.result = res;
        
        if (res.collision) {
          this.messageService.add({ 
            severity: 'warn', 
            summary: 'Collision Detected!',
            detail: 'This file matches a previously uploaded file.',
            life: 5000
          });
        } else {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Upload Successful',
            detail: 'File has been processed successfully.',
            life: 3000
          });
        }
      },
      error: (error: any) => {
        this.uploading = false;
        console.error('Upload error:', error);
        const errorMessage = error?.error?.message || 'An error occurred while processing the file.';
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Upload Failed',
          detail: errorMessage,
          life: 5000
        });
      }
    });
  }
}