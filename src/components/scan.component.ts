import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';
import { NavbarComponent } from './navbar.component';

interface ScanResult {
  productName: string;
  brand: string;
  score: number;
  scoreLabel: string;
  scoreColor: string;
  image: string;
  origin: string;
  distance: number;
  isLocal: boolean;
  nutritionScore: string;
  ecoScore: string;
  ingredients: string[];
  alternatives: {
    name: string;
    producer: string;
    score: number;
    distance: number;
    image: string;
  }[];
}

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="h-full w-full bg-black flex flex-col relative overflow-hidden">
      
      @if (!isScanning() && !scanResult()) {
        <div class="flex-1 relative flex flex-col">
          
          <div class="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 z-0">
            <div class="absolute inset-0 opacity-20">
              <div class="w-full h-full" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 20px 20px;"></div>
            </div>
          </div>

          <div class="relative z-10 pt-12 px-6 pb-4 bg-gradient-to-b from-black/80 to-transparent flex-none">
            <div class="flex items-center justify-between">
              <button (click)="goBack()" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center active:bg-white/20 transition-colors">
                <span class="material-icons-round text-white">arrow_back</span>
              </button>
              <h1 class="text-white font-bold text-lg drop-shadow-md">Scanner</h1>
              <button class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center active:bg-white/20 transition-colors">
                <span class="material-icons-round text-white">flash_off</span>
              </button>
            </div>
          </div>

          <div class="flex-1 relative z-10 flex items-center justify-center py-8">
            <div class="relative w-64 h-64">
              <div class="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-2xl shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
              <div class="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-2xl shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
              <div class="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-2xl shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
              <div class="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-2xl shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
              
              <div class="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line shadow-[0_0_15px_var(--primary-color)]"></div>
            </div>
          </div>

          <div class="relative z-10 pb-28 pt-8 px-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center gap-6">
            
            <div class="flex gap-4">
              <button class="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium flex items-center gap-2 border border-white/5">
                <span class="material-icons-round text-sm">history</span> Historique
              </button>
              <button class="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium flex items-center gap-2 border border-white/5">
                <span class="material-icons-round text-sm">photo_library</span> Galerie
              </button>
            </div>

            <button 
              (click)="simulateScan()"
              class="group relative w-20 h-20 flex items-center justify-center active:scale-95 transition-all duration-200"
            >
              <div class="absolute inset-0 bg-primary rounded-full opacity-20 group-hover:scale-110 transition-transform duration-500 animate-pulse"></div>
              <div class="relative w-full h-full rounded-full bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] flex items-center justify-center border-4 border-white/20">
                <span class="material-icons-round text-3xl">center_focus_strong</span>
              </div>
            </button>

            <div class="text-center">
              <p class="text-white text-sm font-medium mb-1">Placez le code-barres dans le cadre</p>
              <p class="text-white/50 text-xs">Recherche automatique...</p>
            </div>

          </div>
        </div>
      }

      @if (isScanning()) {
        <div class="flex-1 flex flex-col items-center justify-center bg-gray-900 z-50 absolute inset-0">
          <div class="w-24 h-24 relative mb-8">
            <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            <span class="material-icons-round text-primary text-4xl absolute inset-0 flex items-center justify-center">qr_code_2</span>
          </div>
          <p class="text-white text-lg font-bold mb-2">Analyse en cours...</p>
          <p class="text-white/60 text-sm">Identification du produit</p>
        </div>
      }

      @if (scanResult(); as result) {
        <div class="flex-1 bg-gray-50 relative flex flex-col h-full">
          
          <div class="flex-1 overflow-y-auto pb-40">
            
            <div class="bg-white pt-12 px-6 pb-6 shadow-sm relative z-10">
              <button (click)="resetScan()" class="absolute top-12 left-4 w-10 h-10 z-20 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors">
                <span class="material-icons-round text-gray-800">close</span>
              </button>
              
              <div class="flex items-start gap-4 mt-4">
                <div class="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white flex-shrink-0">
                    <img [src]="result.image" class="w-full h-full object-cover" alt="Product">
                </div>
                <div class="flex-1 pt-1">
                  <h2 class="font-bold text-xl leading-tight text-gray-900">{{result.productName}}</h2>
                  <p class="text-sm text-gray-500 mt-1">{{result.brand}}</p>
                  <div class="flex flex-wrap gap-2 mt-3">
                    <span class="text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wide border" [ngClass]="result.scoreColor">
                      {{result.nutritionScore}}
                    </span>
                    <span class="text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {{result.ecoScore}}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mx-4 -mt-4 relative z-20">
              <div class="bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Score Global</p>
                    <p class="text-sm font-medium text-gray-600 mt-1 max-w-[140px]">{{result.scoreLabel}}</p>
                  </div>
                  <div class="w-20 h-20 rounded-full flex items-center justify-center relative shadow-inner" [ngClass]="getScoreBgClass(result.score)">
                    <svg class="absolute inset-0 w-full h-full -rotate-90 p-1">
                       <circle cx="50%" cy="50%" r="36" fill="transparent" stroke="rgba(255,255,255,0.3)" stroke-width="6" />
                       <circle cx="50%" cy="50%" r="36" fill="transparent" stroke="white" stroke-width="6" stroke-dasharray="226" [attr.stroke-dashoffset]="226 - (226 * result.score) / 100" stroke-linecap="round" />
                    </svg>
                    <div class="flex flex-col items-center">
                        <span class="text-2xl font-black text-white leading-none">{{result.score}}</span>
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between py-2 border-b border-gray-50">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <span class="material-icons-round text-base">place</span>
                      </div>
                      <span class="text-sm text-gray-600">Origine</span>
                    </div>
                    <span class="text-sm font-bold" [ngClass]="result.isLocal ? 'text-green-600' : 'text-orange-500'">
                      {{result.origin}} ({{result.distance}}km)
                    </span>
                  </div>
                  
                  <div class="flex items-center justify-between py-2 border-b border-gray-50">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <span class="material-icons-round text-base">eco</span>
                      </div>
                      <span class="text-sm text-gray-600">Impact</span>
                    </div>
                    <span class="text-sm font-bold text-gray-900">Faible émission</span>
                  </div>
                </div>
              </div>
            </div>

            @if (result.alternatives.length > 0) {
              <div class="px-6 mt-8">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <span class="material-icons-round text-primary">lightbulb</span>
                  Alternatives Locales
                </h3>
                <div class="space-y-4">
                  @for (alt of result.alternatives; track alt.name) {
                    <div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.99] transition-transform">
                      <img [src]="alt.image" class="w-16 h-16 rounded-xl object-cover shadow-sm" alt="Alternative">
                      <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start">
                           <p class="font-bold text-gray-900 truncate">{{alt.name}}</p>
                           <span class="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded ml-2">{{alt.score}}</span>
                        </div>
                        <p class="text-xs text-gray-500 mb-1">{{alt.producer}}</p>
                        <div class="flex items-center gap-1">
                          <span class="material-icons-round text-[14px] text-primary">near_me</span>
                          <span class="text-xs font-semibold text-primary">{{alt.distance}} km</span>
                        </div>
                      </div>
                      <button class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        <span class="material-icons-round text-lg">arrow_forward_ios</span>
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-30 pb-24">
            <div class="flex gap-3 max-w-md mx-auto">
                <button class="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                <span class="material-icons-round">add_shopping_cart</span>
                Trouver ce produit
                </button>
                <button class="w-14 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center active:bg-gray-200 transition-colors">
                <span class="material-icons-round">share</span>
                </button>
            </div>
          </div>
        </div>
      }

      @if (scanResult()) {
        <app-navbar activeTab="scan" class="relative z-40"></app-navbar>
      }
    </div>
  `,
  styles: [`
    @keyframes scan-line {
      0%, 100% { top: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    .animate-scan-line {
      animation: scan-line 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  `]
})
export class ScanComponent implements OnDestroy {
  store = inject(StoreService);
  isScanning = signal(false);
  scanResult = signal<ScanResult | null>(null);
  private scanTimeout: any;

  simulateScan() {
    this.isScanning.set(true);
    this.scanTimeout = setTimeout(() => {
      this.isScanning.set(false);
      this.scanResult.set({
        productName: 'Tomates Grappe Bio',
        brand: 'Carrefour Bio',
        score: 72,
        scoreLabel: 'Bon choix, mais il y a plus local !',
        scoreColor: 'bg-yellow-100 text-yellow-700',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=300',
        origin: 'Espagne',
        distance: 850,
        isLocal: false,
        nutritionScore: 'A',
        ecoScore: 'B',
        ingredients: ['Tomates bio'],
        alternatives: [
          { name: 'Tomates Anciennes', producer: 'Ferme des Garrigues', score: 95, distance: 12, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=300' },
          { name: 'Cœur de Bœuf', producer: 'Maraîcher du Lac', score: 92, distance: 45, image: 'https://images.unsplash.com/photo-1561136594-7f68413a981f?q=80&w=300' }
        ]
      });
    }, 2000);
  }

  resetScan() {
    this.scanResult.set(null);
    this.isScanning.set(false);
  }

  goBack() {
    this.store.setView('map');
  }

  getScoreBgClass(score: number): string {
    if (score >= 80) return 'bg-gradient-to-br from-green-400 to-green-600';
    if (score >= 60) return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
    return 'bg-gradient-to-br from-orange-400 to-orange-600';
  }

  ngOnDestroy() {
    if (this.scanTimeout) clearTimeout(this.scanTimeout);
  }
}