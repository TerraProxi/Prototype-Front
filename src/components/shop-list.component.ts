
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="h-full w-full bg-gray-50 flex flex-col font-sans">
      <!-- Header -->
      <header class="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-20">
        <h1 class="text-xl font-bold text-gray-900">Producteurs Locaux</h1>
        <p class="text-sm text-gray-500">En direct du terroir héraultais</p>
      </header>

      <!-- Search & Filters -->
      <div class="p-4 space-y-3">
        <!-- Search -->
        <div class="bg-white rounded-xl shadow-sm p-3 flex items-center border border-gray-100">
           <span class="material-icons-round text-gray-400 mr-2">search</span>
           <input
             type="text"
             placeholder="Rechercher ferme, marché..."
             class="w-full text-sm outline-none text-gray-700 bg-transparent placeholder-gray-400"
             [value]="searchQuery()"
             (input)="onSearchChange($event)"
           >
        </div>

        <!-- Filters -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
           <button
             [ngClass]="activeFilter() === 'closest'
               ? 'bg-primary text-white shadow-md shadow-primary/30'
               : 'bg-white text-gray-700 border border-gray-200'"
             class="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap"
             (click)="setFilter('closest')"
           >
             <span class="material-icons-round text-sm align-middle mr-1">place</span> Plus proche
           </button>
           <button
             [ngClass]="activeFilter() === 'rating'
               ? 'bg-primary text-white shadow-md shadow-primary/30'
               : 'bg-white text-gray-700 border border-gray-200'"
             class="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap"
             (click)="setFilter('rating')"
           >
             <span class="material-icons-round text-sm align-middle mr-1">star</span> Mieux notés
           </button>
           <button
             [ngClass]="activeFilter() === 'open'
               ? 'bg-primary text-white shadow-md shadow-primary/30'
               : 'bg-white text-gray-700 border border-gray-200'"
             class="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap"
             (click)="setFilter('open')"
           >
             <span class="material-icons-round text-sm align-middle mr-1">store</span> Ouvert
           </button>
        </div>
      </div>

      <!-- List -->
      <main class="flex-1 overflow-y-auto px-4 pb-24 space-y-4">
        @for (producer of producers(); track producer.id) {
          <div (click)="openShop(producer.id)" class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform">
             <!-- Thumb -->
             <div class="relative w-24 h-24 flex-shrink-0">
               <img [src]="producer.image" class="w-full h-full object-cover rounded-xl bg-gray-200" alt="Shop">
               @if (producer.isOpen) {
                  <div class="absolute top-1 left-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">OUVERT</div>
               } @else {
                  <div class="absolute top-1 left-1 bg-gray-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">FERMÉ</div>
               }
             </div>
             
             <!-- Content -->
             <div class="flex-1 flex flex-col justify-center min-w-0">
                <div class="flex justify-between items-start">
                  <h3 class="font-bold text-gray-900 text-base truncate">{{producer.name}}</h3>
                  <div class="flex items-center gap-0.5 text-yellow-500 bg-yellow-50 px-1.5 rounded text-[10px] font-bold">
                     <span class="material-icons-round text-[12px]">star</span> {{producer.rating}}
                  </div>
                </div>
                
                <p class="text-xs text-gray-500 line-clamp-2 mt-1 mb-2">{{producer.tagline}}</p>
                
                <div class="mt-auto flex items-center justify-between">
                   <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg flex items-center gap-1">
                      <span class="material-icons-round text-[14px]">place</span> {{producer.distance}} km
                   </span>
                   
                   <span class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                      <span class="material-icons-round text-lg">arrow_forward</span>
                   </span>
                </div>
             </div>
          </div>
        }
      </main>

      <app-navbar activeTab="shop-list"></app-navbar>
    </div>
  `
})
export class ShopListComponent {
  store = inject(StoreService);

  // Filter state
  activeFilter = signal<'closest' | 'rating' | 'open'>('closest');
  searchQuery = signal('');

  // Filtered and sorted producers
  producers = computed(() => {
    const allProducers = this.store.producers();
    const filter = this.activeFilter();
    const query = this.searchQuery().toLowerCase().trim();

    let filtered = [...allProducers];

    // Apply text search (normalize text for accent-insensitive search)
    if (query) {
      const normalizeText = (text: string) =>
        text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      filtered = filtered.filter(producer =>
        normalizeText(producer.name).includes(normalizeText(query)) ||
        normalizeText(producer.tagline).includes(normalizeText(query)) ||
        normalizeText(producer.address).includes(normalizeText(query))
      );
    }

    // Apply filter
    switch (filter) {
      case 'open':
        filtered = filtered.filter(p => p.isOpen);
        break;
      case 'rating':
        // Already filtered by rating, will be sorted below
        break;
      case 'closest':
        // Already filtered by distance, will be sorted below
        break;
    }

    // Apply sorting
    switch (filter) {
      case 'closest':
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'open':
        // For open filter, sort by distance as secondary criteria
        filtered.sort((a, b) => a.distance - b.distance);
        break;
    }

    return filtered;
  });

  setFilter(filter: 'closest' | 'rating' | 'open') {
    this.activeFilter.set(filter);
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  openShop(id: string) {
    this.store.selectProducer(id);
    this.store.setView('profile');
  }
}
