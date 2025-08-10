import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HashService } from '../hash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  styles: [`
    .history-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .search-container {
      margin-bottom: 1.5rem;
    }
    
    .search-container input {
      width: 300px;
    }
    
    .filename {
      font-weight: 500;
      word-break: break-word;
    }
    
    .hash-value {
      font-family: monospace;
      font-size: 0.9em;
      color: #666;
      margin: 0.25rem 0;
      cursor: help;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .p-button.p-button-sm {
      width: 2rem;
      height: 2rem;
    }
    
    @media (max-width: 960px) {
      .p-datatable {
        overflow-x: auto;
        display: block;
      }
    }
  `],
  template: `
    <div class="history-container">
      <p-toast></p-toast>
      <div class="card">
        <h2>Upload History</h2>
        
        <div class="search-container">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input type="text" pInputText placeholder="Search files..." [(ngModel)]="searchText" (input)="applyFilter()" />
          </span>
        </div>
        
        <p-table [value]="filteredHistory" [scrollable]="true" scrollHeight="500px" 
                [paginator]="true" [rows]="10" [loading]="loading">
          <ng-template pTemplate="header">
            <tr>
              <th>Filename</th>
              <th>Hashes</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="loadingbody">
            <tr>
              <td colspan="4" class="text-center p-4">
                <p-progressSpinner></p-progressSpinner>
              </td>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-item>
            <tr>
              <td class="filename">
                <div *ngIf="editingId === item._id">
                  <input type="text" pInputText [(ngModel)]="item.filename" 
                         (keyup.enter)="saveEdit(item)" (keyup.escape)="cancelEdit()"
                         style="width: 100%;" autofocus>
                </div>
                <span *ngIf="editingId !== item._id">{{item.filename}}</span>
              </td>
              <td>
                <div class="hash-value" [pTooltip]="item.md5">MD5: {{item.md5 | slice:0:8}}...</div>
                <div class="hash-value" [pTooltip]="item.sha256">SHA-256: {{item.sha256 | slice:0:8}}...</div>
              </td>
              <td>{{item.date | date:'short'}}</td>
              <td class="actions">
                <button pButton pRipple type="button" icon="pi pi-pencil" 
                        class="p-button-rounded p-button-text p-button-sm"
                        pTooltip="Edit"
                        (click)="startEdit(item)" 
                        *ngIf="editingId !== item._id">
                </button>
                <button pButton pRipple type="button" icon="pi pi-check" 
                        class="p-button-rounded p-button-text p-button-success p-button-sm"
                        pTooltip="Save"
                        (click)="saveEdit(item)" 
                        *ngIf="editingId === item._id">
                </button>
                <button pButton pRipple type="button" icon="pi pi-trash" 
                        class="p-button-rounded p-button-text p-button-danger p-button-sm"
                        pTooltip="Delete"
                        (click)="confirmDelete(item)">
                </button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  history: Array<{
    _id: string;
    filename: string;
    md5: string;
    sha1: string;
    sha256: string;
    date: Date;
  }> = [];
  
  selectedItem: any = null;
  
  filteredHistory: Array<{
    _id: string;
    filename: string;
    md5: string;
    sha1: string;
    sha256: string;
    date: Date;
  }> = [];
  
  editingId: string | null = null;
  loading = false;
  searchText = '';
  confirmDialog: any;

  constructor(private hashService: HashService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.hashService.getHistory().subscribe({
      next: (data) => {
        this.history = data;
        this.filteredHistory = [...data];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: error.error?.message || 'Failed to load history',
          life: 5000
        });
      }
    });
  }
  
  applyFilter(): void {
    if (!this.searchText) {
      this.filteredHistory = [...this.history];
      return;
    }
    
    const searchLower = this.searchText.toLowerCase();
    this.filteredHistory = this.history.filter(item => 
      item.filename.toLowerCase().includes(searchLower) ||
      item.md5.toLowerCase().includes(searchLower) ||
      item.sha1.toLowerCase().includes(searchLower) ||
      item.sha256.toLowerCase().includes(searchLower)
    );
  }

  startEdit(item: any): void {
    this.editingId = item._id;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.loadHistory(); // Reload to discard changes
  }

  saveEdit(item: any): void {
    if (!item.filename?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Filename cannot be empty',
        life: 3000
      });
      return;
    }

    this.hashService.updateHistory(item._id, { filename: item.filename.trim() })
      .subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Item updated successfully',
            life: 3000
          });
          this.editingId = null;
          this.loadHistory();
        },
        error: (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: error.error?.message || 'Failed to update item',
            life: 5000
          });
        }
      });
  }

  confirmDelete(item: any): void {
    this.selectedItem = item;
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${item.filename}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteItem(item._id)
    });
  }

  deleteItem(id: string): void {
    this.hashService.deleteHistory(id).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Item deleted successfully',
          life: 3000
        });
        this.loadHistory();
      },
      error: (error: any) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: error.error?.message || 'Failed to delete item',
          life: 5000
        });
      }
    });
  }
}