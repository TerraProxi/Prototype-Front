
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (producer(); as p) {
      <div class="h-full w-full bg-gray-50 overflow-y-auto no-scrollbar pb-24 font-sans">
        <!-- Header Image -->
        <div class="relative h-64 w-full">
          <img [src]="p.coverImage" class="w-full h-full object-cover" alt="Cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <!-- Top Nav -->
          <div class="absolute top-0 w-full p-4 pt-safe flex justify-between items-center z-10">
            <button (click)="goBack()" class="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition">
              <span class="material-icons-round">arrow_back</span>
            </button>
            <div class="flex gap-3">
              <button class="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition">
                <span class="material-icons-round">favorite_border</span>
              </button>
              <button class="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition">
                <span class="material-icons-round">share</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Content Card -->
        <div class="relative px-4 -mt-12 mb-4">
          <div class="bg-white rounded-2xl shadow-lg p-5">
            <div class="flex flex-col items-center -mt-16">
              <div class="relative">
                <img [src]="p.avatar" class="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md bg-gray-100" alt="Avatar">
                <div class="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <span class="material-icons-round text-white text-[14px]">check</span>
                </div>
              </div>
              
              <h1 class="text-2xl font-bold mt-3 text-gray-900 text-center">{{p.name}}</h1>
              <p class="text-sm text-gray-500 font-medium">Depuis 2015 • Certifié Bio</p>
              
              <div class="flex items-center gap-1 mt-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                <span class="material-icons-round text-yellow-500 text-sm">star</span>
                <span class="text-sm font-bold text-gray-800">{{p.rating}}</span>
                <span class="text-xs text-gray-500">({{p.reviewCount}} Avis)</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 mt-6">
              <button (click)="goToCatalog()" class="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/30 transition-all active:scale-95">
                <span class="material-icons-round text-xl">storefront</span> Voir Boutique
              </button>
              <button (click)="goToChat()" class="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95">
                <span class="material-icons-round text-xl">chat_bubble_outline</span> Message
              </button>
            </div>
          </div>
        </div>

        <!-- About Section -->
        <div class="px-4 space-y-6">
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="material-icons-round text-primary">info</span> À propos
            </h2>
            <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p class="text-gray-600 text-sm leading-relaxed">{{p.description}}</p>
              <button class="mt-2 text-primary font-semibold text-sm flex items-center">
                Lire plus <span class="material-icons-round text-base">expand_more</span>
              </button>
              <div class="flex flex-wrap gap-2 mt-4">
                @for (cat of p.categories; track cat) {
                  <span class="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">{{cat}}</span>
                }
              </div>
            </div>
          </section>
          
          <!-- Location Placeholder -->
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span class="material-icons-round text-primary">location_on</span> Localisation
            </h2>
            <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
               <div class="h-32 bg-gray-200 w-full relative">
                  <!-- Simplified static map representation -->
                  <div class="absolute inset-0 map-pattern opacity-50"></div>
                  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span class="material-icons-round text-primary text-4xl drop-shadow-md">location_on</span>
                  </div>
               </div>
               <div class="p-4 flex justify-between items-center">
                 <div>
                   <p class="font-semibold text-gray-800 text-sm">{{p.address}}</p>
                   <p class="text-xs text-primary font-medium mt-1">à {{p.distance}} km</p>
                 </div>
                 <button class="bg-gray-100 p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition">
                   <span class="material-icons-round">directions</span>
                 </button>
               </div>
            </div>
          </section>
        </div>
      </div>
    }
  `
})
export class ProfileComponent {
  store = inject(StoreService);
  producer = this.store.selectedProducer;

  goBack() { this.store.setView('map'); }
  goToCatalog() { this.store.setView('catalog'); }
  goToChat() { this.store.setView('chat'); }
}
