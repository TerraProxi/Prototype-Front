
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full w-full bg-white flex flex-col px-8 py-10 font-sans">
      <div class="flex-1 flex flex-col justify-center">
        <!-- Header -->
        <div class="mb-10 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 animate-bounce-soft">
            <span class="material-icons-round text-3xl">spa</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Bon retour</h1>
          <p class="text-gray-500">Connectez-vous pour accéder à votre marché local</p>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-700 ml-1">Email</label>
            <div class="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all">
              <span class="material-icons-round text-gray-400 mr-2">email</span>
              <input type="email" placeholder="jean@exemple.com" class="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-gray-900">
            </div>
          </div>
          
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-700 ml-1">Mot de passe</label>
            <div class="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all">
              <span class="material-icons-round text-gray-400 mr-2">lock</span>
              <input type="password" placeholder="••••••••" class="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-gray-900">
              <span class="text-xs font-bold text-gray-400 cursor-pointer hover:text-gray-600">Voir</span>
            </div>
          </div>

          <div class="flex justify-end">
            <button class="text-xs font-bold text-primary hover:text-primary-dark">Mot de passe oublié ?</button>
          </div>
        </div>

        <!-- Action -->
        <button (click)="login()" class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 mt-8 transition-transform active:scale-95 flex items-center justify-center gap-2">
          <span>Se Connecter</span>
          <span class="material-icons-round text-sm">arrow_forward</span>
        </button>

        <!-- Social -->
        <div class="mt-8 text-center">
          <div class="relative mb-6">
             <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-100"></div></div>
             <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-2 text-gray-400 font-bold">Ou continuer avec</span></div>
          </div>
          <div class="flex gap-4 justify-center">
            <button class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition text-gray-600"><span class="font-bold text-lg">G</span></button>
            <button class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"><span class="material-icons-round text-gray-800 text-xl">apple</span></button>
            <button class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"><span class="material-icons-round text-blue-600 text-xl">facebook</span></button>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center text-sm text-gray-500">
        Pas encore de compte ? <button class="text-primary font-bold hover:underline">S'inscrire</button>
      </div>
    </div>
  `
})
export class AuthComponent {
  store = inject(StoreService);

  login() {
    this.store.setView('map');
  }
}
