
import { Component, inject, computed, AfterViewInit, OnDestroy, ElementRef, ViewChild, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService, Producer } from '../services/store.service';
import { NavbarComponent } from './navbar.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-discovery',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="h-full w-full relative overflow-hidden bg-gray-200">
      
      <!-- Leaflet Map Container -->
      <div #mapContainer class="absolute inset-0 z-0"></div>

      <!-- Top Search Bar -->
      <div class="absolute top-0 left-0 right-0 pt-12 px-4 pb-4 z-[1000] bg-gradient-to-b from-white/90 via-white/60 to-transparent pointer-events-none">
        <div class="flex items-center gap-3 mb-3 pointer-events-auto">
          <div class="flex-1 bg-white shadow-lg rounded-2xl flex items-center p-3 border border-gray-100">
            <span class="material-icons-round text-gray-400 mr-2">search</span>
            <input
              type="text"
              placeholder="Rechercher producteur..."
              class="w-full text-sm font-semibold outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              [value]="searchQuery()"
              (input)="onSearchChange($event)"
            />
            <span
              class="material-icons-round cursor-pointer p-1 hover:bg-gray-50 rounded-full"
              [ngClass]="showFilters() ? 'text-primary' : 'text-gray-400'"
              (click)="toggleFilters()"
            >tune</span>
          </div>
        </div>

        <!-- Filter Chips -->
        @if (showFilters()) {
          <div class="flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-1">
          <button
            class="px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-1 whitespace-nowrap"
            [ngClass]="activeFilter() === 'Tous'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-100'"
            (click)="setFilter('Tous')"
          >
            <span class="material-icons-round text-sm">filter_vintage</span> Tous
          </button>
          <button
            class="px-4 py-2 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 whitespace-nowrap border"
            [ngClass]="activeFilter() === 'Légumes'
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-100'"
            (click)="setFilter('Légumes')"
          >
            <span class="material-icons-round text-sm text-green-500">grass</span> Légumes
          </button>
          <button
            class="px-4 py-2 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 whitespace-nowrap border"
            [ngClass]="activeFilter() === 'Crèmerie'
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-100'"
            (click)="setFilter('Crèmerie')"
          >
            <span class="material-icons-round text-sm text-orange-400">egg</span> Crèmerie
          </button>
          <button
            class="px-4 py-2 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 whitespace-nowrap border"
            [ngClass]="activeFilter() === 'Fruits'
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-100'"
            (click)="setFilter('Fruits')"
          >
            <span class="material-icons-round text-sm text-red-400">local_florist</span> Fruits
          </button>
          <button
            class="px-4 py-2 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 whitespace-nowrap border"
            [ngClass]="activeFilter() === 'Fromage'
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-100'"
            (click)="setFilter('Fromage')"
          >
            <span class="material-icons-round text-sm text-yellow-600">restaurant</span> Fromage
          </button>
          </div>
        }
      </div>

      <!-- Location Button -->
      <div class="absolute bottom-32 right-4 z-[1000] pointer-events-auto">
        <button 
          class="bg-white p-3 rounded-full shadow-lg text-blue-500 border border-gray-100 active:bg-gray-50"
          (click)="centerOnUser()"
        >
          <span class="material-icons-round">my_location</span>
        </button>
      </div>

      <!-- Bottom Sheet Card -->
      @if (selectedProducer(); as producer) {
        <div class="absolute bottom-[80px] left-4 right-4 z-[1000] animate-fade-in-up">
          <div class="bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform" (click)="goToProfile()">
            <div class="flex gap-4">
              <!-- Image -->
              <div class="relative w-20 h-20 flex-shrink-0">
                <img [src]="producer.image" class="w-full h-full object-cover rounded-xl shadow-sm" alt="Producer">
                @if (producer.isOpen) {
                  <div class="absolute -top-2 -left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Ouvert</div>
                }
              </div>
              
              <!-- Info -->
              <div class="flex-1 flex flex-col justify-center min-w-0">
                <div class="flex justify-between items-start">
                  <h3 class="font-bold text-lg text-gray-900 truncate pr-2">{{producer.name}}</h3>
                  <button class="text-gray-400 hover:text-red-500 transition-colors" (click)="$event.stopPropagation()">
                    <span class="material-icons-round text-xl">favorite_border</span>
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1 truncate">{{producer.tagline}}</p>
                
                <div class="flex items-center gap-3 mt-2">
                  <div class="flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded">
                    <span class="material-icons-round text-[14px] text-yellow-500">star</span> {{producer.rating}}
                  </div>
                  <div class="flex items-center gap-1 text-xs text-gray-500">
                    <span class="material-icons-round text-[14px]">place</span> {{producer.distance}} km
                  </div>
                  <div class="flex items-center gap-1 text-xs text-primary font-semibold ml-auto">
                    Voir détails <span class="material-icons-round text-[14px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Nav -->
      <app-navbar activeTab="discover"></app-navbar>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class MapDiscoveryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  store = inject(StoreService);
  producers = this.store.producers;
  selectedId = this.store.selectedProducerId;
  selectedProducer = this.store.selectedProducer;

  // Filter and search state
  searchQuery = signal('');
  activeFilter = signal<string>('Tous');
  showFilters = signal(false);

  // Filtered producers based on search and filter
  filteredProducers = computed(() => {
    const producers = this.producers();
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter();

    return producers.filter(producer => {
      // Text search
      const matchesSearch = query === '' ||
        producer.name.toLowerCase().includes(query) ||
        producer.tagline.toLowerCase().includes(query) ||
        producer.address.toLowerCase().includes(query);

      // Category filter
      const matchesFilter = filter === 'Tous' ||
        producer.categories.some(cat => cat === filter);

      return matchesSearch && matchesFilter;
    });
  });

  private map!: L.Map;
  private markers: Map<string, L.Marker> = new Map();
  private userMarker?: L.Marker;
  private mapInitialized = false;

  // Default center: Montpellier
  private defaultCenter: L.LatLngExpression = [43.6109, 3.8764];
  private defaultZoom = 12;

  constructor() {
    // Effect to update marker styles when selection changes
    effect(() => {
      const selectedId = this.selectedId();
      if (this.mapInitialized) {
        this.updateMarkerStyles(selectedId);
      }
    });

    // Effect to update markers when filters change
    effect(() => {
      const filteredProducers = this.filteredProducers();
      if (this.mapInitialized) {
        this.updateFilteredMarkers(filteredProducers);
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
    this.addProducerMarkers();
    this.getUserLocation();
    this.mapInitialized = true;
    // Ensure markers are properly filtered on initialization
    this.updateFilteredMarkers(this.filteredProducers());
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    // Initialize the map
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.defaultCenter,
      zoom: this.defaultZoom,
      zoomControl: false,
      attributionControl: false
    });

    // Add a beautiful tile layer (Carto Positron - light, clean style)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    // Add attribution in bottom left (subtle)
    L.control.attribution({
      position: 'bottomleft',
      prefix: false
    }).addTo(this.map).addAttribution('© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/attributions">CARTO</a>');

    // Deselect producer when clicking on the map (not on a marker)
    this.map.on('click', () => {
      this.store.selectProducer(null as any);
    });
  }

  private addProducerMarkers() {
    const producers = this.filteredProducers();

    producers.forEach(producer => {
      const marker = this.createProducerMarker(producer);
      marker.addTo(this.map);
      this.markers.set(producer.id, marker);
    });

    // Fit bounds to show all markers
    if (producers.length > 0) {
      const bounds = L.latLngBounds(producers.map(p => [p.coordinates.lat, p.coordinates.lng]));
      this.map.fitBounds(bounds, { padding: [80, 80], maxZoom: 13 });
    }
  }

  private updateFilteredMarkers(filteredProducers: Producer[]) {
    if (!this.map) return;

    // Remove markers that are no longer in filtered results
    this.markers.forEach((marker, producerId) => {
      const shouldShow = filteredProducers.some(p => p.id === producerId);
      if (!shouldShow) {
        this.map.removeLayer(marker);
        this.markers.delete(producerId);
      }
    });

    // Add new markers for producers that should be shown
    filteredProducers.forEach(producer => {
      if (!this.markers.has(producer.id)) {
        const marker = this.createProducerMarker(producer);
        marker.addTo(this.map);
        this.markers.set(producer.id, marker);
      }
    });

    // Fit bounds to show all visible markers
    if (filteredProducers.length > 0) {
      const bounds = L.latLngBounds(filteredProducers.map(p => [p.coordinates.lat, p.coordinates.lng]));
      this.map.fitBounds(bounds, { padding: [80, 80], maxZoom: 13 });
    }
  }

  private createProducerMarker(producer: Producer): L.Marker {
    const isSelected = this.selectedId() === producer.id;
    const icon = this.createCustomIcon(producer, isSelected);
    
    const marker = L.marker([producer.coordinates.lat, producer.coordinates.lng], { icon });
    
    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      this.selectProducer(producer.id);
    });

    return marker;
  }

  private createCustomIcon(producer: Producer, isSelected: boolean): L.DivIcon {
    const bgColor = isSelected ? '#16a34a' : '#ffffff';
    const textColor = isSelected ? '#ffffff' : '#6b7280';
    const scale = isSelected ? 'scale-110' : '';
    const shadow = isSelected ? 'shadow-xl' : 'shadow-lg';
    
    let iconName = 'store';
    if (producer.categories.includes('Légumes')) {
      iconName = 'agriculture';
    } else if (producer.categories.includes('Crèmerie')) {
      iconName = 'egg';
    } else if (producer.categories.includes('Fruits')) {
      iconName = 'local_florist';
    }

    const html = `
      <div class="flex flex-col items-center transform ${scale} transition-transform duration-200">
        <div class="p-2.5 rounded-full ${shadow} border-2 border-white" style="background-color: ${bgColor};">
          <span class="material-icons-round text-xl" style="color: ${textColor};">${iconName}</span>
        </div>
        <div class="w-3 h-3 bg-black/20 rounded-full blur-[3px] mt-1 ${isSelected ? 'opacity-0' : ''}"></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-marker',
      iconSize: [48, 56],
      iconAnchor: [24, 56]
    });
  }

  private updateMarkerStyles(selectedId: string | null) {
    if (!this.map) return;

    this.markers.forEach((marker, producerId) => {
      const producer = this.producers().find(p => p.id === producerId);
      if (producer) {
        const newIcon = this.createCustomIcon(producer, producerId === selectedId);
        marker.setIcon(newIcon);
      }
    });

    // Center map on selected producer
    if (selectedId) {
      const producer = this.producers().find(p => p.id === selectedId);
      if (producer) {
        this.map.panTo([producer.coordinates.lat, producer.coordinates.lng], { animate: true });
      }
    }
  }

  private getUserLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.addUserMarker(latitude, longitude);
        },
        () => {
          // Geolocation denied or unavailable, use default location
          this.addUserMarker(this.defaultCenter[0] as number, this.defaultCenter[1] as number);
        },
        { enableHighAccuracy: true }
      );
    }
  }

  private addUserMarker(lat: number, lng: number) {
    if (this.userMarker) {
      this.userMarker.setLatLng([lat, lng]);
      return;
    }

    const userIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
          <div class="w-4 h-4 bg-blue-500 rounded-full border-3 border-white shadow-lg"></div>
        </div>
      `,
      className: 'user-location-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    this.userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 });
    this.userMarker.addTo(this.map);
  }

  selectProducer(id: string) {
    this.store.selectProducer(id);
  }

  goToProfile() {
    this.store.setView('profile');
  }

  // Filter and search methods
  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  setFilter(filter: string) {
    this.activeFilter.set(filter);
  }

  toggleFilters() {
    this.showFilters.set(!this.showFilters());
  }

  centerOnUser() {
    if (this.userMarker) {
      const pos = this.userMarker.getLatLng();
      this.map.flyTo(pos, 14, { animate: true, duration: 0.5 });
    } else {
      this.map.flyTo(this.defaultCenter, this.defaultZoom, { animate: true, duration: 0.5 });
    }
  }
}
