
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="h-full w-full bg-gray-50 flex flex-col font-sans">
      <!-- Header -->
      <header class="bg-white px-6 py-5 border-b border-gray-100 sticky top-0 z-20">
        <h1 class="text-xl font-bold text-gray-900">Mes Coups de Cœur</h1>
        <p class="text-sm text-gray-500">Retrouvez vos produits et artisans préférés</p>
      </header>

      <!-- Tabs -->
      <div class="px-4 pt-4">
        <div class="flex p-1 bg-gray-100 rounded-xl">
           <button 
             (click)="tab.set('producers')" 
             [class.bg-white]="tab() === 'producers'" 
             [class.shadow-sm]="tab() === 'producers'"
             class="flex-1 py-2 rounded-lg text-xs font-bold transition-all text-gray-700">
             Producteurs
           </button>
           <button 
             (click)="tab.set('products')" 
             [class.bg-white]="tab() === 'products'" 
             [class.shadow-sm]="tab() === 'products'"
             class="flex-1 py-2 rounded-lg text-xs font-bold transition-all text-gray-700">
             Produits
           </button>
        </div>
      </div>

      <main class="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        
        @if (tab() === 'producers') {
          <!-- Mocked Favorite Producers (Taking the first one) -->
          @for (p of producers().slice(0, 1); track p.id) {
             <div (click)="openShop(p.id)" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform">
                <img [src]="p.avatar" class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md bg-gray-200" alt="Avatar">
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between">
                     <h3 class="font-bold text-gray-900 truncate">{{p.name}}</h3>
                     <span class="material-icons-round text-red-500 text-lg">favorite</span>
                  </div>
                  <p class="text-xs text-gray-500 line-clamp-2 mt-1">{{p.tagline}}</p>
                  <div class="flex gap-2 mt-2">
                     <span class="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded">Bio</span>
                     <span class="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">Local</span>
                  </div>
                </div>
             </div>
          }
        } @else {
          <!-- Mocked Favorite Products -->
          <div class="grid grid-cols-2 gap-3">
             @for (product of products().slice(0, 2); track product.id) {
               <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                  <div class="relative h-28">
                    <img [src]="product.image" class="w-full h-full object-cover">
                    <button class="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 shadow-sm backdrop-blur-sm">
                       <span class="material-icons-round text-sm">favorite</span>
                    </button>
                  </div>
                  <div class="p-3">
                     <h3 class="font-bold text-xs text-gray-900 mb-0.5 truncate">{{product.name}}</h3>
                     <p class="text-[10px] text-gray-500 mb-2">{{product.unit}}</p>
                     <div class="flex justify-between items-center">
                        <span class="font-bold text-primary text-sm">{{product.price}} €</span>
                        <button (click)="add(product)" class="bg-primary text-white w-6 h-6 rounded flex items-center justify-center shadow-sm active:scale-90 transition-transform">
                          <span class="material-icons-round text-sm">add</span>
                        </button>
                     </div>
                  </div>
               </div>
             }
          </div>
        }

        <!-- Suggestion / Inspiration -->
        <div class="mt-6 pt-6 border-t border-gray-100">
           <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
             <span class="material-icons-round text-secondary">lightbulb</span> Inspiration de saison
           </h3>
           <div class="bg-gradient-to-r from-orange-100 to-red-50 p-4 rounded-2xl flex items-center gap-4">
              <div class="bg-white p-2 rounded-xl shadow-sm text-2xl">🥧</div>
              <div>
                <p class="font-bold text-gray-800 text-sm">Tarte aux Abricots</p>
                <p class="text-[10px] text-gray-600 leading-tight mt-1">Les abricots de Mauguio sont parfaits en ce moment !</p>
              </div>
              <button class="ml-auto bg-white text-orange-500 font-bold text-xs px-3 py-2 rounded-lg shadow-sm">Voir</button>
           </div>
        </div>

      </main>

      <app-navbar activeTab="favorites"></app-navbar>
    </div>
  `
})
export class FavoritesComponent {
  store = inject(StoreService);
  tab = signal<'producers' | 'products'>('producers');
  
  // Mock data for favorites (just slicing existing data)
  producers = this.store.producers;
  products = this.store.products;

  openShop(id: string) {
    this.store.selectProducer(id);
    this.store.setView('profile');
  }

  add(product: any) {
    this.store.addToCart(product);
  }
}
