
import { Component, OnInit, inject } from '@angular/core';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  template: `
    <div class="h-full w-full flex flex-col items-center justify-between bg-white dark:bg-gray-900 pb-12 relative overflow-hidden">
      <div class="h-1/6"></div>
      
      <!-- Logo Section -->
      <div class="flex flex-col items-center z-10 animate-fade-in-up">
        <div class="w-48 mb-6 animate-bounce-soft">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvSynCwChlaUiytjZWKAJn935mj8AS5NoP946qIS2BbYyvjnGvUvBIwessk-1YCFPlcARbXPspn6BxXvIYfpShawTCyqHqoaQ6qq29I0yMiUvgXeNP2K51mYZt-6twZqXv72fa6h5luYkDt_hIiVplTAWd2NBQ2bhgk5jx-QlvpDQIzj780mRQb4E9mxE3c_NqNjIoxVfvcvHTs7K2HKLF3l3DOk7fYzxS5MLwvMqTEnKkH-_1qqIvvluIUqeXZwfztxFb0lF1kro" alt="Logo" class="w-full drop-shadow-lg">
        </div>
        <div class="text-center space-y-2 opacity-0 animate-fade-in-up" style="animation-delay: 0.3s">
          <p class="text-2xl font-medium text-gray-700 dark:text-gray-300 font-sans tracking-tight">
            Du producteur à <br>
            <span class="text-primary font-bold text-3xl">votre porte</span>
          </p>
        </div>
      </div>

      <!-- Footer/Loading -->
      <div class="flex flex-col items-center space-y-6 opacity-0 animate-fade-in-up" style="animation-delay: 0.6s">
        <div class="flex space-x-2">
          <div class="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
        <div class="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase flex items-center gap-2">
          <span class="material-icons-round text-sm">eco</span>
          100% Local & Bio
        </div>
      </div>
    </div>
  `
})
export class SplashComponent implements OnInit {
  private store = inject(StoreService);

  ngOnInit() {
    setTimeout(() => {
      this.store.setView('onboarding');
    }, 3000);
  }
}
