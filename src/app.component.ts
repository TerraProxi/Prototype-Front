
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from './services/store.service';

import { SplashComponent } from './components/splash.component';
import { OnboardingComponent } from './components/onboarding.component';
import { AuthComponent } from './components/auth.component';
import { MapDiscoveryComponent } from './components/map-discovery.component';
import { ProfileComponent } from './components/profile.component';
import { UserProfileComponent } from './components/user-profile.component';
import { CatalogComponent } from './components/producer-catalog.component';
import { CartComponent } from './components/cart.component';
import { ChatComponent } from './components/chat.component';
import { FavoritesComponent } from './components/favorites.component';
import { ShopListComponent } from './components/shop-list.component';
import { ScanComponent } from './components/scan.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SplashComponent,
    OnboardingComponent,
    AuthComponent,
    MapDiscoveryComponent,
    ProfileComponent,
    UserProfileComponent,
    CatalogComponent,
    CartComponent,
    ChatComponent,
    FavoritesComponent,
    ShopListComponent,
    ScanComponent
  ],
  template: `
    <main class="w-full h-full relative overflow-hidden bg-white text-gray-900 shadow-2xl mx-auto max-w-md md:border-x md:border-gray-100">
      @switch (view()) {
        @case ('splash') { <app-splash></app-splash> }
        @case ('onboarding') { <app-onboarding></app-onboarding> }
        @case ('auth') { <app-auth></app-auth> }
        @case ('map') { <app-map-discovery></app-map-discovery> }
        @case ('shop-list') { <app-shop-list></app-shop-list> }
        @case ('profile') { <app-profile></app-profile> }
        @case ('user-profile') { <app-user-profile></app-user-profile> }
        @case ('catalog') { <app-catalog></app-catalog> }
        @case ('cart') { <app-cart></app-cart> }
        @case ('chat') { <app-chat></app-chat> }
        @case ('favorites') { <app-favorites></app-favorites> }
        @case ('scan') { <app-scan></app-scan> }
        @default { <app-splash></app-splash> }
      }
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      background-color: #f3f4f6;
      height: 100vh;
      width: 100vw;
    }
  `]
})
export class AppComponent {
  store = inject(StoreService);
  view = this.store.currentView;
}
