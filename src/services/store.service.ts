
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
  // User location
  readonly userLocation = signal<{ lat: number; lng: number } | null>(null);

  // Utility function to calculate distance between two coordinates using Haversine formula
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round((R * c) * 10) / 10; // Round to 1 decimal place
  }
  // --- State Signals ---
  
  // Navigation
  readonly currentView = signal<AppView>('splash');
  
  // Data
  readonly producers = signal<Producer[]>([
    {
      id: '1',
      name: 'Ferme des Garrigues',
      tagline: 'Légumes bio et œufs fermiers',
      description: 'Une exploitation familiale au cœur du Pic Saint-Loup. Nous cultivons des variétés anciennes sans pesticides.',
      rating: 4.8,
      reviewCount: 120,
      distance: 2.5,
      image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1595039838779-f313927626ed?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000',
      address: 'Route de Ganges, Saint-Gély-du-Fesc',
      categories: ['Légumes', 'Œufs'],
      coordinates: { lat: 43.6938, lng: 3.8049 },
      isOpen: true
    },
    {
      id: '2',
      name: 'Mas des Coquillages',
      tagline: 'Huîtres et moules de Bouzigues',
      description: 'Dégustez le meilleur de l\'étang de Thau. Producteurs d\'huîtres de père en fils depuis 1950.',
      rating: 4.9,
      reviewCount: 340,
      distance: 28.5,
      image: 'https://images.unsplash.com/photo-1599458252573-56ae36120de1?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?q=80&w=1000',
      address: 'Port de pêche, Bouzigues',
      categories: ['Poissons & Crustacés'],
      coordinates: { lat: 43.4475, lng: 3.6583 },
      isOpen: true
    },
    {
      id: '3',
      name: 'Domaine de l\'Oliveraie',
      tagline: 'Huile d\'olive et Lucques du Languedoc',
      description: 'Pressage à froid et récolte manuelle. Découvrez notre huile d\'olive vierge extra médaillée.',
      rating: 4.7,
      reviewCount: 95,
      distance: 12.1,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1464333901053-4952084c718b?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1445296115253-ad62c721b315?q=80&w=1000',
      address: 'Chemin des Oliviers, Saint-Jean-de-Védas',
      categories: ['Épicerie', 'Huile'],
      coordinates: { lat: 43.5771, lng: 3.8258 },
      isOpen: true
    },
    {
      id: '4',
      name: 'Château de l\'Engarran',
      tagline: 'Vins AOC Languedoc & Grés de Montpellier',
      description: 'Domaine viticole historique. Vins bios élégants et balades dans les jardins à la française.',
      rating: 4.9,
      reviewCount: 156,
      distance: 8.4,
      image: 'https://images.unsplash.com/photo-1560148218-1a83060f7b32?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?q=80&w=1000',
      address: 'Route de Lavérune, Lavérune',
      categories: ['Vins', 'Spiritueux'],
      coordinates: { lat: 43.5962, lng: 3.8021 },
      isOpen: true
    },
    {
      id: '5',
      name: 'Le Rucher du Pic',
      tagline: 'Miels de garrigue et gelée royale',
      description: 'Apiculture transhumante respectueuse des abeilles. Miel de thym, romarin et châtaignier.',
      rating: 4.8,
      reviewCount: 67,
      distance: 22.0,
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?q=80&w=1000',
      address: 'Hameau de l\'Hortus, Valflaunès',
      categories: ['Miel', 'Épicerie'],
      coordinates: { lat: 43.8014, lng: 3.8719 },
      isOpen: false
    },
    {
      id: '6',
      name: 'La Chèvrerie du Mas Rolland',
      tagline: 'Pélardons AOP et fromages frais',
      description: 'Au pied du Larzac, nos chèvres pâturent en pleine liberté. Fabrication traditionnelle de Pélardons au lait cru.',
      rating: 4.9,
      reviewCount: 88,
      distance: 35.2,
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=1000',
      address: 'Chemin du Mas, Montesquieu',
      categories: ['Fromage', 'Crèmerie'],
      coordinates: { lat: 43.5611, lng: 3.2755 },
      isOpen: true
    },
    {
      id: '7',
      name: 'Les Vergers du Jaur',
      tagline: 'Cerises, châtaignes et jus de fruits',
      description: 'Spécialiste des fruits de montagne et de la châtaigne d\'Olargues. Tout est transformé à la ferme.',
      rating: 4.6,
      reviewCount: 42,
      distance: 85.0,
      image: 'https://images.unsplash.com/photo-1521235042493-c5bef89dc2c8?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?q=80&w=1000',
      address: 'Le Village, Olargues',
      categories: ['Fruits', 'Boissons'],
      coordinates: { lat: 43.5575, lng: 2.9125 },
      isOpen: true
    },
    {
      id: '8',
      name: 'Rizière de la Marette',
      tagline: 'Riz de Camargue et taureau',
      description: 'Situé aux portes de la Grande-Motte, nous produisons un riz d\'exception en zone Natura 2000.',
      rating: 4.7,
      reviewCount: 112,
      distance: 22.5,
      image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000',
      address: 'Route de l\'Espiguette, Le Grau-du-Roi',
      categories: ['Épicerie', 'Viande'],
      coordinates: { lat: 43.5358, lng: 4.1352 },
      isOpen: true
    },
    {
      id: '9',
      name: 'Brasserie Alaryk',
      tagline: 'Bières artisanales bio de Béziers',
      description: 'Bières de haute qualité, brassées sans additifs ni conservateurs. Un savoir-faire biterrois reconnu.',
      rating: 4.8,
      reviewCount: 195,
      distance: 72.0,
      image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1571767454098-246b9198573e?q=80&w=1000',
      address: 'Rue de l\'Industrie, Béziers',
      categories: ['Boissons'],
      coordinates: { lat: 43.3442, lng: 3.2158 },
      isOpen: true
    },
    {
      id: '10',
      name: 'Maraîcher du Lac',
      tagline: 'Melons et fraises du Salagou',
      description: 'Sur les terres rouges (ruffes) du lac du Salagou, nos fruits regorgent de sucre et de soleil.',
      rating: 4.9,
      reviewCount: 76,
      distance: 45.0,
      image: 'https://images.unsplash.com/photo-1587411768638-ec71f8e33b78?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1000',
      address: 'Les Terrasses, Clermont-l\'Hérault',
      categories: ['Fruits', 'Légumes'],
      coordinates: { lat: 43.6278, lng: 3.3964 },
      isOpen: true
    },
    {
      id: '11',
      name: 'Le Mas de l\'Ecluze',
      tagline: 'Asperges des sables et petits pois',
      description: 'Culture traditionnelle en pleine terre dans les sables de Lansargues. Une saveur unique grâce à notre terroir littoral.',
      rating: 4.8,
      reviewCount: 54,
      distance: 18.2,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1000',
      address: 'Chemin de l\'Ecluze, Lansargues',
      categories: ['Légumes'],
      coordinates: { lat: 43.6525, lng: 4.0728 },
      isOpen: true
    },
    {
      id: '12',
      name: 'Pêcherie de la Méditerranée',
      tagline: 'Poisson bleu et friture du Golfe',
      description: 'Pêche artisanale au départ de Palavas-les-Flots. Daurades, loups et rougets selon arrivage du matin.',
      rating: 4.9,
      reviewCount: 215,
      distance: 10.5,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?q=80&w=1000',
      address: 'Quai Paul Cunq, Palavas-les-Flots',
      categories: ['Poissons & Crustacés'],
      coordinates: { lat: 43.5275, lng: 3.9314 },
      isOpen: true
    },
    {
      id: '13',
      name: 'L\'Escargot du Pic',
      tagline: 'Héliciculture artisanale',
      description: 'Élevage de Gros Gris en plein air au pied de l\'Hortus. Produits transformés sans conservateurs.',
      rating: 4.7,
      reviewCount: 38,
      distance: 24.1,
      image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000',
      address: 'Route de Ganges, Saint-Mathieu-de-Tréviers',
      categories: ['Épicerie', 'Viande'],
      coordinates: { lat: 43.7694, lng: 3.8681 },
      isOpen: true
    },
    {
      id: '14',
      name: 'Spiruline de l\'Hérault',
      tagline: 'Super-aliment produit localement',
      description: 'Culture écologique de spiruline artisanale sous serre. Riche en fer et vitamines, 100% naturelle.',
      rating: 4.9,
      reviewCount: 29,
      distance: 42.0,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1000',
      address: 'Lieu-dit La Plaine, Gignac',
      categories: ['Épicerie'],
      coordinates: { lat: 43.6521, lng: 3.5512 },
      isOpen: true
    },
    {
      id: '15',
      name: 'Boucherie des Terroirs',
      tagline: 'Agneau de l\'Hérault et veau d\'Aveyron',
      description: 'Sélection rigoureuse de viandes locales. Nous travaillons avec des éleveurs respectueux du bien-être animal.',
      rating: 4.8,
      reviewCount: 142,
      distance: 5.2,
      image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000',
      address: 'Avenue de Toulouse, Montpellier',
      categories: ['Viande'],
      coordinates: { lat: 43.5982, lng: 3.8642 },
      isOpen: true
    },
    {
      id: '16',
      name: 'Safran du Languedoc',
      tagline: 'L\'or rouge de nos garrigues',
      description: 'Safran pur en stigmates. Culture artisanale sur les hauteurs de Murviel-lès-Montpellier.',
      rating: 5.0,
      reviewCount: 24,
      distance: 14.8,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000',
      address: 'Chemin de la Coste, Murviel-lès-Montpellier',
      categories: ['Épicerie'],
      coordinates: { lat: 43.6041, lng: 3.7383 },
      isOpen: false
    },
    {
      id: '17',
      name: 'La Ferme de l\'Orque',
      tagline: 'Lait de vache et yaourts fermiers',
      description: 'Une des dernières laiteries de plaine. Fromages blancs, yaourts onctueux et lait frais chaque jour.',
      rating: 4.7,
      reviewCount: 91,
      distance: 21.3,
      image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1488459739732-26d36275dbe7?q=80&w=1000',
      address: 'Route de Pérols, Lattes',
      categories: ['Crèmerie'],
      coordinates: { lat: 43.5678, lng: 3.9025 },
      isOpen: true
    },
    {
      id: '18',
      name: 'Pépinière des Arômes',
      tagline: 'Herbes aromatiques et plantes à tisanes',
      description: 'Plus de 50 variétés de plantes aromatiques bios. Fraîches ou séchées pour vos cuisines.',
      rating: 4.6,
      reviewCount: 45,
      distance: 33.7,
      image: 'https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1499952125210-b424b7f9f77b?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1523348830342-d0187cf0c28d?q=80&w=1000',
      address: 'Route de Sète, Vic-la-Gardiole',
      categories: ['Épicerie', 'Légumes'],
      coordinates: { lat: 43.4902, lng: 3.7961 },
      isOpen: true
    },
    {
      id: '19',
      name: 'Domaine du Météore',
      tagline: 'Vins nés d\'un cratère d\'impact',
      description: 'Vignoble insolite situé dans un cratère de météorite à Faugères. Vins en biodynamie.',
      rating: 4.9,
      reviewCount: 178,
      distance: 65.4,
      image: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1506377247377-2a5b3b0ca7df?q=80&w=1000',
      address: 'Le Village, Cabrerolles',
      categories: ['Vins'],
      coordinates: { lat: 43.5414, lng: 3.1258 },
      isOpen: true
    },
    {
      id: '20',
      name: 'Confiserie du Languedoc',
      tagline: 'Grisettes de Montpellier et Berlingots',
      description: 'Artisan confiseur perpétuant la tradition des Grisettes au miel et à la réglisse depuis 1837.',
      rating: 4.8,
      reviewCount: 312,
      distance: 1.2,
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=1000',
      address: 'Rue de l\'Aiguillerie, Montpellier',
      categories: ['Épicerie'],
      coordinates: { lat: 43.6125, lng: 3.8785 },
      isOpen: true
    }
  ]);

  readonly products = signal<Product[]>([
    // Producteur 1 : Ferme des Garrigues
    { id: 'p1', producerId: '1', name: 'Tomates Anciennes', price: 4.50, unit: 'kg', category: 'Légumes', image: 'https://images.unsplash.com/photo-1592394933325-10eb0440533b?q=80&w=600', isSeasonal: true },
    { id: 'p2', producerId: '1', name: 'Jeunes Pousses', price: 3.25, unit: '300g', category: 'Légumes', image: 'https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=600' },
    { id: 'p3', producerId: '1', name: 'Œufs Plein Air', price: 6.50, unit: 'boîte de 12', category: 'Œufs', image: 'https://images.unsplash.com/photo-1582722134903-b12ee9479b7b?q=80&w=600' },

    // Producteur 2 : Mas des Coquillages (Bouzigues)
    { id: 'p4', producerId: '2', name: 'Huîtres N°3 (Spéciales)', price: 14.00, unit: 'douzaine', category: 'Poissons & Crustacés', image: 'https://images.unsplash.com/photo-1599458352231-039779354366?q=80&w=600', isBestseller: true },
    { id: 'p5', producerId: '2', name: 'Moules de l\'Étang', price: 6.50, unit: 'kg', category: 'Poissons & Crustacés', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600' },

    // Producteur 3 : Domaine de l'Oliveraie
    { id: 'p6', producerId: '3', name: 'Huile d\'Olive Vierge Extra', price: 18.50, unit: '75cl', category: 'Épicerie', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600' },
    { id: 'p7', producerId: '3', name: 'Olives Lucques du Languedoc', price: 5.80, unit: '250g', category: 'Épicerie', image: 'https://images.unsplash.com/photo-1563823251941-b9989d1e8d97?q=80&w=600' },

    // Producteur 4 : Château de l'Engarran
    { id: 'p8', producerId: '4', name: 'AOP Grés de Montpellier (Rouge)', price: 15.00, unit: 'bouteille', category: 'Vins', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600' },
    { id: 'p9', producerId: '4', name: 'Languedoc Rosé Bio', price: 11.50, unit: 'bouteille', category: 'Vins', image: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?q=80&w=600', isSeasonal: true },

    // Producteur 5 : Le Rucher du Pic
    { id: 'p10', producerId: '5', name: 'Miel de Garrigue', price: 12.00, unit: '500g', category: 'Épicerie', image: 'https://images.unsplash.com/photo-1587049633562-ad3002f38b2c?q=80&w=600', isBestseller: true },
    { id: 'p11', producerId: '5', name: 'Gelée Royale Fraîche', price: 22.00, unit: '20g', category: 'Épicerie', image: 'https://images.unsplash.com/photo-1471943311424-646960669fba?q=80&w=600' },
    
    // Producteur 6 : La Chèvrerie du Mas Rolland
    { id: 'p12', producerId: '6', name: 'Pélardon AOP', price: 2.80, unit: 'pièce', category: 'Fromage', image: 'https://images.unsplash.com/photo-1485962391945-424236402025?q=80&w=600', isBestseller: true },
    { id: 'p13', producerId: '6', name: 'Faisselle de chèvre', price: 4.20, unit: '4 pots', category: 'Crèmerie', image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=600' },

    // Producteur 7 : Les Vergers du Jaur
    { id: 'p14', producerId: '7', name: 'Jus de Pomme Trouble', price: 4.50, unit: '1L', category: 'Boissons', image: 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?q=80&w=600' },
    { id: 'p15', producerId: '7', name: 'Crème de Châtaigne', price: 6.90, unit: '370g', category: 'Épicerie', image: 'https://images.unsplash.com/photo-1590401443227-aa7df56d787a?q=80&w=600' },

    // Producteur 8 : Rizière de la Marette
    { id: 'p16', producerId: '8', name: 'Riz Rouge de Camargue', price: 5.20, unit: '500g', category: 'Épicerie', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600' },
    { id: 'p17', producerId: '8', name: 'Saucisson de Taureau', price: 8.50, unit: 'pièce', category: 'Viande', image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=600' },

    // Producteur 9 : Brasserie Alaryk
    { id: 'p18', producerId: '9', name: 'Alaryk Blonde Bio', price: 3.50, unit: '33cl', category: 'Boissons', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=600' },
    { id: 'p19', producerId: '9', name: 'Coffret Dégustation (6 bières)', price: 19.90, unit: 'pack', category: 'Boissons', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?q=80&w=600' },

    // Producteur 10 : Maraîcher du Lac
    { id: 'p20', producerId: '10', name: 'Melon de Clermont', price: 3.50, unit: 'pièce', category: 'Fruits', image: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?q=80&w=600', isSeasonal: true },
    { id: 'p21', producerId: '10', name: 'Fraises Gariguette', price: 5.90, unit: '250g', category: 'Fruits', image: 'https://images.unsplash.com/photo-1464960350473-ab74ed46589a?q=80&w=600', isSeasonal: true },

    { id: 'p22', producerId: '11', name: 'Asperges Vertes', price: 7.50, unit: 'botte', category: 'Légumes', image: 'https://images.unsplash.com/photo-1515471204579-f30b050d0354?q=80&w=600', isSeasonal: true },
    { id: 'p23', producerId: '12', name: 'Daurade Royale', price: 24.00, unit: 'kg', category: 'Poissons & Crustacés', image: 'https://images.unsplash.com/photo-1534948664780-609f7a474708?q=80&w=600' },
    { id: 'p24', producerId: '13', name: 'Escargots à la Biterroise', price: 12.50, unit: 'douzaine', category: 'Épicerie', image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?q=80&w=600' },
    { id: 'p25', producerId: '14', name: 'Spiruline en Paillettes', price: 15.00, unit: '100g', category: 'Épicerie', image: 'https://images.unsplash.com/photo-1614859132130-142c11438992?q=80&w=600' },
    { id: 'p26', producerId: '15', name: 'Côte de Veau', price: 28.90, unit: 'kg', category: 'Viande', image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=600' },
    { id: 'p27', producerId: '16', name: 'Stigmates de Safran', price: 32.00, unit: '1g', category: 'Épicerie', image: 'https://images.unsplash.com/photo-1615485247078-47aa404899da?q=80&w=600' },
    { id: 'p28', producerId: '17', name: 'Yaourt Nature x4', price: 3.80, unit: 'pack', category: 'Crèmerie', image: 'https://images.unsplash.com/photo-1488470039733-573b5270227c?q=80&w=600' },
    { id: 'p29', producerId: '18', name: 'Basilic Grand Vert', price: 2.50, unit: 'pot', category: 'Légumes', image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?q=80&w=600' },
    { id: 'p30', producerId: '19', name: 'Faugères "Les Léonides"', price: 18.00, unit: 'bouteille', category: 'Vins', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600' },
    { id: 'p31', producerId: '20', name: 'Grisettes de Montpellier', price: 6.50, unit: '150g', category: 'Épicerie', image: 'https://images.unsplash.com/photo-1582043242136-213028d7088f?q=80&w=600', isBestseller: true }
    
  
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

  // Update user location
  setUserLocation(lat: number, lng: number) {
    this.userLocation.set({ lat, lng });

    // Immediately update distances for all producers
    this.updateProducerDistances(lat, lng);
  }

  private updateProducerDistances(userLat: number, userLng: number) {
    this.producers.update(currentProducers => {
      return currentProducers.map(producer => {
        const distance = this.calculateDistance(
          userLat,
          userLng,
          producer.coordinates.lat,
          producer.coordinates.lng
        );
        return {
          ...producer,
          distance
        };
      });
    });
  }
}
