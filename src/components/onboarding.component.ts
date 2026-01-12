
import { Component, inject } from '@angular/core';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  template: `
    <div class="h-full w-full flex flex-col justify-between bg-white dark:bg-gray-900 relative overflow-hidden font-display">
      
      <!-- Decor Balls -->
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-40 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Skip Button -->
      <div class="p-6 flex justify-end z-20">
        <button (click)="skip()" class="text-gray-500 font-semibold text-sm hover:text-primary transition-colors">Passer</button>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col items-center justify-center px-8 z-10 text-center -mt-10">
        <!-- Image Circle -->
        <div class="relative w-72 h-72 flex items-center justify-center mb-10">
          <div class="absolute inset-0 border-2 border-dashed border-accent/40 rounded-full animate-[spin_60s_linear_infinite]"></div>
          
          <!-- Floating Markers -->
          <div class="absolute top-10 right-10 text-accent animate-bounce" style="animation-duration: 3s"><span class="material-icons-round text-3xl drop-shadow-sm">place</span></div>
          <div class="absolute bottom-16 left-8 text-primary animate-bounce" style="animation-duration: 4s; animation-delay: 1s"><span class="material-icons-round text-2xl drop-shadow-sm">place</span></div>
          
          <!-- Center Image -->
          <div class="relative z-10 w-48 h-48 bg-white rounded-full shadow-2xl p-1 flex items-center justify-center overflow-hidden">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP8_PEIIIXkhEV8jwwfl7mRWS7La_bqE34Zvrr_Qn0uZDy2BwOHrr6Ku2x1i-V2XSTlp9RB2njMKnJ-SB4cD_nZQ2CanDrZqsiVjNDlQBWTr1R-guB7volIMFu9ytIufgjvoqfk4qJZf-QIk-fMn3DHjmB8Qk3NQMGiBEU6K8rOZS-NA2Au4MxD0rSZILV2kpfhQJK9RONXGrvHFEWWw3MM_lcIqOh1IQBYMKFyziqsvJCgrTBm1IsHvC8QemskB7LoSEc48qoMWs" class="w-full h-full object-cover rounded-full" alt="World">
          </div>
        </div>

        <!-- Text -->
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white leading-tight mb-4">
          La Fraîcheur <br> <span class="text-primary">Au Coin de la Rue</span>
        </h1>
        <p class="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
          Connectez-vous directement aux fermiers de l'Hérault. Trouvez les meilleurs produits de saison à deux pas de chez vous.
        </p>

        <!-- Pagination Dots -->
        <div class="flex gap-2 mt-8">
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
          <div class="w-8 h-2 rounded-full bg-primary shadow-sm"></div>
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      <!-- Bottom Action -->
      <div class="p-6 pb-10 z-20">
        <button (click)="skip()" class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 group active:scale-95 transition-all">
          <span>C'est parti</span>
          <span class="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
        <p class="text-center text-xs text-gray-400 mt-4">Déjà un compte ? <button (click)="login()" class="text-primary font-bold cursor-pointer hover:underline">Se connecter</button></p>
      </div>
    </div>
  `
})
export class OnboardingComponent {
  private store = inject(StoreService);

  skip() {
    this.store.setView('map');
  }

  login() {
    this.store.setView('auth');
  }
}
