
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService, Product } from '../services/store.service';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="h-full w-full bg-gray-50 flex flex-col font-sans">
      <!-- Header -->
      <header class="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button (click)="goBack()" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition">
          <span class="material-icons-round text-gray-800">arrow_back</span>
        </button>
        <div class="flex flex-col items-center">
          <span class="text-[10px] font-bold text-primary uppercase tracking-wider">Producteur</span>
          <h1 class="text-lg font-bold text-gray-900 leading-none">{{producer()?.name}}</h1>
        </div>
        <div class="w-10"></div> <!-- spacer -->
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto pb-32">
        <!-- Producer Mini Header -->
        <div class="p-4">
          <div class="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
             <img [src]="producer()?.avatar" class="w-12 h-12 rounded-full border border-gray-100" alt="Avatar">
             <div class="flex-1">
               <p class="text-xs font-bold text-gray-900">Bio & Local</p>
               <p class="text-[10px] text-gray-500 line-clamp-2 mt-0.5">{{producer()?.tagline}}</p>
             </div>
          </div>
        </div>

        <!-- Search -->
        <div class="px-4 mb-4">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-400">search</span>
            <input type="text" placeholder="Rechercher produits..." class="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm border-none shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none">
          </div>
        </div>

        <!-- Categories -->
        <div class="pl-4 mb-6 overflow-x-auto no-scrollbar">
          <div class="flex space-x-2 pr-4">
            <button class="px-5 py-2 bg-primary text-white rounded-full text-xs font-bold shadow-md shadow-primary/30">Tous</button>
            <button class="px-5 py-2 bg-white text-gray-700 border border-gray-200 rounded-full text-xs font-bold whitespace-nowrap">Légumes</button>
            <button class="px-5 py-2 bg-white text-gray-700 border border-gray-200 rounded-full text-xs font-bold whitespace-nowrap">Crèmerie</button>
            <button class="px-5 py-2 bg-white text-gray-700 border border-gray-200 rounded-full text-xs font-bold whitespace-nowrap">Fruits</button>
          </div>
        </div>

        <!-- Grid -->
        <div class="px-4 grid grid-cols-2 gap-4">
          @for (product of products(); track product.id) {
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col h-full">
              <!-- Image -->
              <div class="relative h-32 overflow-hidden bg-gray-100">
                <img [src]="product.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" [alt]="product.name">
                @if(product.isBestseller) {
                   <div class="absolute top-2 left-2 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">Top Vente</div>
                }
                @if(product.isSeasonal) {
                   <div class="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-gray-800 shadow-sm">De Saison</div>
                }
                <button class="absolute top-2 right-2 bg-white/60 p-1 rounded-full text-gray-500 hover:text-red-500 transition-colors backdrop-blur-sm">
                   <span class="material-icons-round text-sm">favorite_border</span>
                </button>
              </div>
              
              <!-- Details -->
              <div class="p-3 flex flex-col flex-1">
                <h3 class="font-bold text-sm text-gray-900 leading-tight mb-1">{{product.name}}</h3>
                <p class="text-xs text-gray-500 mb-3">{{product.unit}}</p>
                <div class="mt-auto flex items-center justify-between">
                  <span class="font-bold text-primary text-base">{{product.price.toFixed(2)}} €</span>
                  <button (click)="add(product)" class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 active:scale-95 transition-transform hover:bg-primary-dark">
                    <span class="material-icons-round text-lg">add</span>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </main>

      <!-- Float Cart Summary -->
      @if (cartCount() > 0) {
        <div class="fixed bottom-24 left-4 right-4 z-30 animate-fade-in-up">
          <div (click)="goToCart()" class="bg-gray-900 text-white rounded-xl p-4 shadow-xl flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
             <div class="flex items-center gap-3">
               <div class="bg-white/20 px-2 py-1 rounded text-sm font-bold min-w-[2rem] text-center">{{cartCount()}}</div>
               <div class="flex flex-col">
                 <span class="text-sm font-bold">Voir Panier</span>
                 <span class="text-xs opacity-70">{{cartTotal().toFixed(2)}} € Total</span>
               </div>
             </div>
             <div class="flex items-center gap-1 font-bold text-sm">
               Payer <span class="material-icons-round text-sm">arrow_forward</span>
             </div>
          </div>
        </div>
      }

      <app-navbar activeTab="catalog"></app-navbar>
    </div>
  `
})
export class CatalogComponent {
  store = inject(StoreService);
  producer = this.store.selectedProducer;
  products = this.store.producerProducts;
  cartCount = this.store.cartCount;
  cartTotal = this.store.cartTotal;

  goBack() { this.store.setView('profile'); }
  goToCart() { this.store.setView('cart'); }
  
  add(product: Product) {
    this.store.addToCart(product);
  }
}
