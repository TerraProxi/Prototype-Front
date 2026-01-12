
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="h-full w-full bg-gray-50 flex flex-col font-sans">
      <!-- Header -->
      <header class="bg-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-sm z-10">
        <div class="flex items-center gap-4">
          <div class="relative">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md">
            <button class="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-sm hover:bg-primary-dark">
              <span class="material-icons-round text-sm block">edit</span>
            </button>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Alex Morgan</h1>
            <p class="text-sm text-gray-500">Membre Gourmand</p>
          </div>
        </div>
        
        <div class="flex gap-4 mt-6">
          <div class="flex-1 bg-green-50 rounded-xl p-3 flex flex-col items-center">
             <span class="text-lg font-bold text-primary">12</span>
             <span class="text-[10px] uppercase font-bold text-gray-400">Commandes</span>
          </div>
          <div class="flex-1 bg-orange-50 rounded-xl p-3 flex flex-col items-center">
             <span class="text-lg font-bold text-secondary">5</span>
             <span class="text-[10px] uppercase font-bold text-gray-400">Favoris</span>
          </div>
          <div class="flex-1 bg-blue-50 rounded-xl p-3 flex flex-col items-center">
             <span class="text-lg font-bold text-blue-500">240 €</span>
             <span class="text-[10px] uppercase font-bold text-gray-400">Économisé</span>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-24">
        
        <!-- Menu Group 1 -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div class="flex items-center gap-3">
              <span class="material-icons-round text-gray-400 bg-gray-50 p-2 rounded-lg">shopping_bag</span>
              <span class="font-bold text-sm text-gray-800">Mes Commandes</span>
            </div>
            <span class="material-icons-round text-gray-300">chevron_right</span>
          </button>
          <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div class="flex items-center gap-3">
              <span class="material-icons-round text-gray-400 bg-gray-50 p-2 rounded-lg">favorite</span>
              <span class="font-bold text-sm text-gray-800">Favoris</span>
            </div>
            <span class="material-icons-round text-gray-300">chevron_right</span>
          </button>
          <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <span class="material-icons-round text-gray-400 bg-gray-50 p-2 rounded-lg">credit_card</span>
              <span class="font-bold text-sm text-gray-800">Moyens de paiement</span>
            </div>
            <span class="material-icons-round text-gray-300">chevron_right</span>
          </button>
        </section>

        <!-- Menu Group 2 -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div class="flex items-center gap-3">
              <span class="material-icons-round text-gray-400 bg-gray-50 p-2 rounded-lg">notifications</span>
              <span class="font-bold text-sm text-gray-800">Notifications</span>
            </div>
            <div class="w-8 h-5 bg-primary rounded-full relative"><div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div></div>
          </button>
          <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div class="flex items-center gap-3">
              <span class="material-icons-round text-gray-400 bg-gray-50 p-2 rounded-lg">help</span>
              <span class="font-bold text-sm text-gray-800">Aide & Support</span>
            </div>
            <span class="material-icons-round text-gray-300">chevron_right</span>
          </button>
        </section>

        <button (click)="logout()" class="w-full p-4 text-center text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-colors">
          Déconnexion
        </button>
      </main>

      <app-navbar activeTab="profile"></app-navbar>
    </div>
  `
})
export class UserProfileComponent {
  store = inject(StoreService);

  logout() {
    this.store.setView('splash');
  }
}
