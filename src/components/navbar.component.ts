
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-6 z-40 flex justify-between items-center shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] text-gray-400">
      
      <button class="flex flex-col items-center gap-1 transition-colors" [ngClass]="activeTab === 'discover' ? 'text-primary' : 'hover:text-gray-600'" (click)="nav('map')">
        <span class="material-icons-round text-2xl">map</span>
        <span class="text-[10px] font-bold">Carte</span>
      </button>

      <button class="flex flex-col items-center gap-1 transition-colors" [ngClass]="['catalog', 'shop-list'].includes(activeTab) ? 'text-primary' : 'hover:text-gray-600'" (click)="nav('shop-list')">
        <span class="material-icons-outlined text-2xl">storefront</span>
        <span class="text-[10px] font-medium">Boutiques</span>
      </button>

      <!-- QR Code / Scan Center Button -->
      <div class="relative -top-6">
        <button class="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 transform active:scale-95 transition-all border-4 border-gray-100">
          <span class="material-icons-round text-2xl">qr_code_scanner</span>
        </button>
      </div>

      <button class="flex flex-col items-center gap-1 transition-colors" [ngClass]="activeTab === 'favorites' ? 'text-primary' : 'hover:text-gray-600'" (click)="nav('favorites')">
        <span class="material-icons-round text-2xl" [class.text-red-500]="activeTab === 'favorites'">favorite</span>
        <span class="text-[10px] font-medium">Favoris</span>
      </button>

      <button class="flex flex-col items-center gap-1 transition-colors" [ngClass]="activeTab === 'profile' ? 'text-primary' : 'hover:text-gray-600'" (click)="nav('user-profile')">
        <span class="material-icons-outlined text-2xl">person</span>
        <span class="text-[10px] font-medium">Profil</span>
      </button>

    </nav>
  `
})
export class NavbarComponent {
  @Input() activeTab: string = '';
  store = inject(StoreService);

  nav(view: any) {
    this.store.setView(view);
  }
}
