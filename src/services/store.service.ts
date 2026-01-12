
import { Injectable, signal, computed } from '@angular/core';

// --- Interfaces ---
export interface Producer {
  id: string;
  name: string;
  tagline: string;
  description: string;
  rating: number;
  reviewCount: number;
  distance: number;
  image: string;
  avatar: string;
  coverImage: string;
  address: string;
  categories: string[];
  coordinates: { lat: number; lng: number }; // GPS coordinates
  isOpen: boolean;
}

export interface Product {
  id: string;
  producerId: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  isBestseller?: boolean;
  isSeasonal?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'producer';
  text: string;
  timestamp: Date;
  image?: string;
  actions?: string[];
}

export type AppView = 'splash' | 'onboarding' | 'auth' | 'map' | 'shop-list' | 'profile' | 'user-profile' | 'catalog' | 'cart' | 'chat' | 'favorites';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // --- State Signals ---
  
  // Navigation
  readonly currentView = signal<AppView>('splash');
  
  // Data
  readonly producers = signal<Producer[]>([
    {
      id: '1',
      name: 'Ferme des Garrigues',
      tagline: 'Légumes bio et œufs fermiers',
      description: 'Une exploitation familiale au cœur du Pic Saint-Loup. Nous cultivons des variétés anciennes sans pesticides pour un goût authentique.',
      rating: 4.8,
      reviewCount: 120,
      distance: 2.5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf2JiIsJQiYWyKAedl3J7jlWqTmqQs0gWpAZOrNt6KAKXyKgLmb8DNijqeUlhlmqvK58xd14pt2vTsZTub_2geTdAzUAI4V2TDlDf-NeWN--xrd5E8AKQOZbBe9M5SMklWU1xXR7ePQSiHTiO333HwbNzv2PoM1XVk4PjLHc5L8bW0CqmsXxggnsvxeNgMM5B3mXdimpD7tI_P5y-wqOKqCyJc3bRkk4NF2CDY-z0AQk_8CD-coMCsJVM74BhG2n7zdHxIc69JClI',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzH44Az2kQajT8AqlZqyN_EfYo51B1lyX7NmUOPmmHHwuLmfeH0Vt7KNTVOjoIK15CxlUzbQ3DPRTCwNu_HfJd-q2hF-PBvpJEl5MIJC5v7evxzwMupcg0yJCXnOnMvDrJy65G7G2jX09PjVL7Im9j3sFrjGH7R7riaWIPyfqxpX80Q7EafRX5JqWHgxxxlcgKHIkynJ0EtCqD0mKxhlAhisGiG-HQQErP85D0YJg94QS2dePCO8CP0l4WPD-7-ktvgcUGDIZK2h0',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAmDJDAFw34PZcOUQzEsWNWIIJBCIfLhYgnj5ZYHLQuM-ReoTtuWgazSDbXbAa6Lja_NtiZBaooa0ldTncuD2M6kvbsyjNeagEBc1B6xXYcKpK4MF4Ryhem29y2sbEr-srlVnhdqh557WDIahGSRYzFQ1HEKdmqdGq3dFZBzjDwInNZsV_9E21p11cxb3aqG7NuS9u6TWuuAd_jIicLkf75lK7qhanHkEQ92rQ0tulMNTSKAB0vmh4V0FcYpkDQuGDb-kRcp86NEM',
      address: 'Route de Ganges, Saint-Gély-du-Fesc',
      categories: ['Légumes', 'Œufs', 'Crèmerie'],
      coordinates: { lat: 43.6938, lng: 3.8049 },
      isOpen: true
    },
    {
      id: '2',
      name: 'Vergers de l\'Étang',
      tagline: 'Fruits de saison et confitures',
      description: 'Spécialiste des fruits à noyau et des agrumes locaux. Nos confitures sont faites maison selon les recettes de grand-mère.',
      rating: 4.6,
      reviewCount: 85,
      distance: 3.2,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf2JiIsJQiYWyKAedl3J7jlWqTmqQs0gWpAZOrNt6KAKXyKgLmb8DNijqeUlhlmqvK58xd14pt2vTsZTub_2geTdAzUAI4V2TDlDf-NeWN--xrd5E8AKQOZbBe9M5SMklWU1xXR7ePQSiHTiO333HwbNzv2PoM1XVk4PjLHc5L8bW0CqmsXxggnsvxeNgMM5B3mXdimpD7tI_P5y-wqOKqCyJc3bRkk4NF2CDY-z0AQk_8CD-coMCsJVM74BhG2n7zdHxIc69JClI',
      avatar: 'https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=200&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop',
      address: 'Chemin des Pommiers, Mauguio',
      categories: ['Fruits', 'Confitures'],
      coordinates: { lat: 43.6166, lng: 4.0106 },
      isOpen: true
    },
    {
      id: '3',
      name: 'Laiterie des Cévennes',
      tagline: 'Fromages et laits artisanaux',
      description: 'Une coopérative regroupant les meilleurs producteurs laitiers des environs. Pélardons et tomes affinées sur place.',
      rating: 4.9,
      reviewCount: 210,
      distance: 1.8,
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&auto=format&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=200&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1000&auto=format&fit=crop',
      address: 'Rue de la Loge, Montpellier',
      categories: ['Crèmerie', 'Fromage'],
      coordinates: { lat: 43.6109, lng: 3.8772 },
      isOpen: false
    }
  ]);

  readonly products = signal<Product[]>([
    { id: 'p1', producerId: '1', name: 'Tomates Anciennes', price: 4.50, unit: 'kg', category: 'Légumes', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCramOTgx5xb-A7hcGYOSeICtk_ehuNtMYEmJoT7_1OCllkwe491riKe6uTLPrrjd25y5QHyxzuAotQM7rWkMEaSalCfZldysdtqzezkc_aPWeo7bvEH74s27XKdOjnNDua1n7jXLzjoCS-aRDHdfUo0x6duQWVBW4pzwcS-bk7bNaZkDnbD-GM-exiGaob4uAnzpEhddqtqfq8cTfbfTULXrGRDHxIsgidmxv-6qO39hQglj0PtM3h0yfhlBSiPQ1GFCqY8596op8', isSeasonal: true },
    { id: 'p2', producerId: '1', name: 'Tome des Cévennes', price: 8.95, unit: '200g', category: 'Crèmerie', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8n28F72CU9O2hk-wkxant5q1glu8F-ZhVqBAPkOgw5VarqHpdR2QoGA-mo2MBcnD1kteZ2pV-tf059vrU6BtCf4Ygb2p8aaMQ93o9s3Uh7reECfj24hNLJidxTmsEKDG3V9EIh6nGnhfn_6GR8-jdjPtd6mcIGFIvGyGBSzfZMlB423PRfouFgpeDkkTk21zf6YSHeZUvLYyT6xpkcYQrweULB1SI0GIxKFID1jxUP3r0C0EC0lGZkAFgLnPvsaz13ghdegjFkto' },
    { id: 'p3', producerId: '1', name: 'Miel de Garrigue', price: 12.00, unit: '500ml', category: 'Épicerie', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKO-t9t5uRsfJVxDhASXC6TVwEsxFpw0rb-UnixAnHzwsIdgGcpYCelv85XNtZtiWh-m7I0BlMi2TNu0xxVWn_LcfJGVlUYtZlO6rmD0jiHBYT-sJ9vyoGDE1_QTP03hO_c3cirCRVt_EfCN1pfoMeVpRgDDO_PitnwCegHqVttzn8c1OfWMh3Cgr5W9HKUJLJBnRG0Nm4l4QXteuVDO3qvoNqmtU_BukQtxMol4U9eMzKP_FkzwTBz7gc6aoE7bqy0M7iouaxIBE', isBestseller: true },
    { id: 'p4', producerId: '1', name: 'Jeunes Pousses', price: 3.25, unit: '300g', category: 'Légumes', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXl8Y0jjSf3O3bgC-FrbwhNZM02h2HKc8ves6IJZ4N9RCRHiilP_h5RLB5tZrBqBZztIdU8EPU4hqdbkZqejbLGEOM9R2e_yTTaujQkZZ43EvLE7BfFyDSOkjfQ4pBKZPplb7XSzA8qrjPez6_-ekvLQPZf9B8BSQ5n_SlnlKZoVfS0dYaM-mBkqdvZSSXwDUYcYTHDRab7XwYan383RGbTUgOq1-9r0qMkJ0X7bFLOL38MmF1j0TDFtbrre5BGlcZJdaDOffULHE' },
    { id: 'p5', producerId: '1', name: 'Œufs Plein Air', price: 6.50, unit: 'boîte de 12', category: 'Œufs', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf2AtM0UFgXcNjuugyfyq0fCyUbPovx4-MKXArjBO5wUjS7rer9azxI7W6OZP32hm6w1l-2Lm0KZiy7N7fQg-8bOh5wRpdJ0HRCVDdPeMVXlntvl7OHKZkSx6WclgfF07cMYZiO44sywLONgO4Tyjo8sUSXuIWzsh1ASJ7lRB-eC5P-vxgUFe8ERtpkKgX8cbhFRPdWJ1TFNNIT58_OAON-yAedt2VDgkWXc2BijfqdLKUzLJOEZQxIa_ECj8AyvPuQed1VCwEpc0' },
  ]);

  readonly messages = signal<ChatMessage[]>([
    { id: 'm1', sender: 'producer', text: 'Bonjour ! Merci pour votre commande de panier légumes. 🥬', timestamp: new Date() },
    { id: 'm2', sender: 'user', text: 'Bonjour ! Hâte de recevoir ça. Petite question sur le contenu ?', timestamp: new Date() },
    { id: 'm3', sender: 'producer', text: 'Bien sûr ! Voici ce que nous avons récolté ce matin.', timestamp: new Date(), image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH2taljJ7xTMGdl81NQ6Pfxc51HZi--jmP8gIHoqu5GiphOyyQA9OTn89LuaUWLgA6GrCA-2NV_y--v37Rsd63Csfx9TiIEVnZfUjhUyBWFpYSg6l1Y74gfxbkIp5B39RjVB1KhSNVQrR4jgUKEAhL3ThppBVj-RaKe1A4eOKDsNDHFhhD4FTwYrEM0xMCZ5CMUMIRMEkn8ociNSS98mhUDXOdcaRQsY1S34HUWCOaZZJDye-5Nq4eW1Xw1bUK4Lh9Is2GlTLf3dA' },
  ]);

  readonly cart = signal<CartItem[]>([]);
  readonly selectedProducerId = signal<string | null>(null);

  // --- Computed ---
  readonly selectedProducer = computed(() => 
    this.producers().find(p => p.id === this.selectedProducerId()) || null
  );

  readonly producerProducts = computed(() => 
    this.products().filter(p => p.producerId === this.selectedProducerId())
  );

  readonly cartTotal = computed(() => 
    this.cart().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );

  readonly cartCount = computed(() => 
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  // --- Actions ---
  setView(view: AppView) {
    this.currentView.set(view);
  }

  selectProducer(id: string) {
    this.selectedProducerId.set(id);
  }

  addToCart(product: Product) {
    this.cart.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(productId: string) {
    this.cart.update(items => {
      const existing = items.find(i => i.product.id === productId);
      if (existing && existing.quantity > 1) {
        return items.map(i => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return items.filter(i => i.product.id !== productId);
    });
  }
}
