
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="h-full w-full bg-gray-50 flex flex-col font-body">
      <!-- Header -->
      <header class="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
             <span class="material-icons-round text-primary text-xl">spa</span>
          </div>
          <div>
            <h1 class="text-sm font-bold text-primary tracking-wide">TERRAPROXI</h1>
            <p class="text-[10px] text-gray-400">Bonjour, Ferme des Garrigues</p>
          </div>
        </div>
        <button class="relative p-2 rounded-full hover:bg-gray-100"><span class="material-icons-round text-gray-400">notifications</span><span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span></button>
      </header>

      <main class="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
             <div class="flex items-center gap-2 mb-2 text-secondary">
               <span class="material-icons-round bg-orange-50 p-1 rounded-md text-sm">shopping_bag</span>
               <span class="text-[10px] font-bold uppercase text-gray-400">Ventes</span>
             </div>
             <h2 class="text-2xl font-bold text-gray-900">482.50 €</h2>
             <p class="text-[10px] text-green-600 font-bold mt-1 flex items-center"><span class="material-icons-round text-[12px] mr-0.5">trending_up</span> +12% vs hier</p>
          </div>
          <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
             <div class="flex items-center gap-2 mb-2 text-blue-500">
               <span class="material-icons-round bg-blue-50 p-1 rounded-md text-sm">local_shipping</span>
               <span class="text-[10px] font-bold uppercase text-gray-400">Commandes</span>
             </div>
             <h2 class="text-2xl font-bold text-gray-900">8</h2>
             <p class="text-[10px] text-orange-500 font-bold mt-1">4 en attente</p>
          </div>
        </div>

        <!-- Graph Placeholder -->
        <section class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
           <div class="flex justify-between items-center mb-4">
             <h3 class="font-bold text-gray-800">Statistiques Ventes</h3>
             <span class="text-xs text-primary font-bold bg-green-50 px-2 py-1 rounded-lg">Hebdo</span>
           </div>
           <div class="flex items-end justify-between h-32 gap-2">
              @for (h of [40, 65, 30, 85, 55, 15, 45]; track $index) {
                <div class="w-full bg-gray-100 rounded-t-lg relative group h-full flex items-end">
                   <div class="w-full bg-primary rounded-t-lg transition-all group-hover:bg-primary-dark" [style.height.%]="h"></div>
                </div>
              }
           </div>
           <div class="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase">
             <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
           </div>
        </section>

        <!-- Stock Alerts -->
        <section>
           <h3 class="font-bold text-gray-800 mb-3">Alertes Stock</h3>
           <div class="flex gap-4 overflow-x-auto no-scrollbar pb-1">
              <div class="min-w-[220px] bg-red-50 border border-red-100 p-4 rounded-2xl">
                 <div class="flex justify-between items-start mb-2">
                    <span class="text-2xl bg-white p-1 rounded-lg shadow-sm">🍅</span>
                    <span class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">RUPTURE</span>
                 </div>
                 <h4 class="font-bold text-gray-900">Tomates Anciennes</h4>
                 <p class="text-[10px] text-gray-500 mt-1 leading-tight">Plus que 3kg. Rupture prévue: 2h.</p>
                 <button class="mt-3 text-xs font-bold text-red-600 uppercase">Restocker</button>
              </div>
              <div class="min-w-[220px] bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                 <div class="flex justify-between items-start mb-2">
                    <span class="text-2xl bg-white p-1 rounded-lg shadow-sm">🥕</span>
                    <span class="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">DATE COURTE</span>
                 </div>
                 <h4 class="font-bold text-gray-900">Carottes Fanes</h4>
                 <p class="text-[10px] text-gray-500 mt-1 leading-tight">Lot #402 expire dans 2 jours. Promo ?</p>
                 <button class="mt-3 text-xs font-bold text-orange-600 uppercase">Promouvoir</button>
              </div>
           </div>
        </section>
      </main>

      <!-- FAB -->
      <div class="fixed bottom-24 right-6 z-30">
        <button class="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg shadow-primary/30 flex gap-2 items-center pr-6 group active:scale-95 transition-transform">
           <span class="material-icons-round text-xl">add</span>
           <span class="font-bold text-sm">Nouveau Produit</span>
        </button>
      </div>

      <app-navbar activeTab="dashboard"></app-navbar>
    </div>
  `
})
export class DashboardComponent {}
