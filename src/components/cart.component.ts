
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full w-full bg-gray-50 flex flex-col font-sans">
      <header class="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button (click)="goBack()" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition"><span class="material-icons-round">arrow_back</span></button>
        <h1 class="text-xl font-bold text-gray-900">Votre Panier</h1>
      </header>

      <main class="flex-1 overflow-y-auto p-5 pb-32 space-y-6">
        @if (cart().length === 0) {
          <div class="flex flex-col items-center justify-center py-20 opacity-50">
             <span class="material-icons-round text-6xl text-gray-300 mb-4">shopping_basket</span>
             <p class="text-gray-500 font-medium">Votre panier est vide</p>
             <button (click)="goBack()" class="mt-4 text-primary font-bold">Commencer vos achats</button>
          </div>
        } @else {
          <!-- Items List -->
          <section class="space-y-4">
             <h2 class="font-bold text-lg text-gray-800">Articles</h2>
             @for (item of cart(); track item.product.id) {
               <div class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                 <img [src]="item.product.image" class="w-16 h-16 rounded-xl object-cover bg-gray-100" alt="Product">
                 <div class="flex-1 min-w-0">
                   <h3 class="font-bold text-gray-900 truncate">{{item.product.name}}</h3>
                   <p class="text-xs text-gray-500">{{item.product.unit}} • {{item.product.price.toFixed(2)}} €</p>
                 </div>
                 <!-- Quantity Controls -->
                 <div class="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                    <button (click)="remove(item.product.id)" class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white rounded-md transition-all">
                      <span class="material-icons-round text-base">remove</span>
                    </button>
                    <span class="w-6 text-center text-sm font-bold text-gray-800">{{item.quantity}}</span>
                    <button (click)="add(item.product)" class="w-7 h-7 flex items-center justify-center text-gray-800 hover:text-primary hover:bg-white rounded-md transition-all shadow-sm">
                      <span class="material-icons-round text-base">add</span>
                    </button>
                 </div>
               </div>
             }
          </section>

          <!-- Delivery -->
          <section class="space-y-4">
             <h2 class="font-bold text-lg text-gray-800">Mode de livraison</h2>
             <div class="grid grid-cols-2 gap-3">
               <label class="cursor-pointer relative group">
                 <input type="radio" name="delivery" class="peer sr-only" checked>
                 <div class="p-4 rounded-xl bg-white border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-green-50 transition-all text-center h-full flex flex-col justify-center items-center gap-2">
                    <span class="material-icons-round text-primary text-2xl">local_shipping</span>
                    <span class="font-bold text-sm text-gray-800">Livraison</span>
                    <span class="text-xs text-gray-500">+5.00 €</span>
                 </div>
                 <div class="absolute top-2 right-2 text-primary opacity-0 peer-checked:opacity-100 transition-opacity"><span class="material-icons-round text-sm">check_circle</span></div>
               </label>
               <label class="cursor-pointer relative group">
                 <input type="radio" name="delivery" class="peer sr-only">
                 <div class="p-4 rounded-xl bg-white border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-green-50 transition-all text-center h-full flex flex-col justify-center items-center gap-2">
                    <span class="material-icons-round text-gray-400 text-2xl group-hover:text-primary transition-colors">storefront</span>
                    <span class="font-bold text-sm text-gray-800">Retrait</span>
                    <span class="text-xs text-gray-500">Gratuit</span>
                 </div>
               </label>
             </div>
             
             <!-- Address -->
             <div class="bg-white p-3 px-4 rounded-xl border border-gray-200 flex items-center justify-between">
                <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><span class="material-icons-round text-sm">location_on</span></div>
                   <div>
                     <p class="text-sm font-bold text-gray-900">Domicile</p>
                     <p class="text-xs text-gray-500">12 Place de la Comédie, Montpellier</p>
                   </div>
                </div>
                <button class="text-primary text-xs font-bold">Modifier</button>
             </div>
          </section>

          <!-- Summary -->
          <section class="space-y-2 pt-2 border-t border-gray-200">
             <div class="flex justify-between text-sm"><span class="text-gray-500">Sous-total</span> <span class="font-medium">{{cartTotal().toFixed(2)}} €</span></div>
             <div class="flex justify-between text-sm"><span class="text-gray-500">Livraison</span> <span class="font-medium">5.00 €</span></div>
             <div class="flex justify-between text-sm"><span class="text-gray-500">TVA (5.5%)</span> <span class="font-medium">{{(cartTotal() * 0.055).toFixed(2)}} €</span></div>
             <div class="flex justify-between items-end pt-2">
                <span class="text-gray-500 font-medium">Total</span>
                <span class="text-2xl font-bold text-gray-900">{{(cartTotal() + 5 + (cartTotal() * 0.055)).toFixed(2)}} €</span>
             </div>
          </section>
        }
      </main>

      @if (cart().length > 0) {
        <div class="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 pb-8 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)] z-20">
           <button class="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 text-lg">
             <span>Payer avec Stripe</span>
             <span class="material-icons-round text-xl">lock</span>
           </button>
           <p class="text-center text-[10px] text-gray-400 mt-3 flex justify-center items-center gap-1">
             <span class="material-icons-round text-[12px]">verified_user</span> Paiement sécurisé SSL 256-bit
           </p>
        </div>
      }
    </div>
  `
})
export class CartComponent {
  store = inject(StoreService);
  cart = this.store.cart;
  cartTotal = this.store.cartTotal;

  goBack() {
    this.store.setView('catalog');
  }

  add(product: any) { this.store.addToCart(product); }
  remove(id: string) { this.store.removeFromCart(id); }
}
