
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full w-full bg-gray-50 flex flex-col font-sans">
      <!-- Header -->
      <header class="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div class="flex items-center space-x-3">
          <button (click)="goBack()" class="text-gray-500 p-1 hover:bg-gray-100 rounded-full"><span class="material-icons-round">arrow_back</span></button>
          <div class="relative">
            <img [src]="producer()?.avatar" class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="P">
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h1 class="font-bold text-gray-900 text-sm leading-tight">{{producer()?.name}}</h1>
            <p class="text-[10px] text-gray-500 flex items-center">
              <span class="material-icons-round text-[10px] text-primary mr-0.5">verified</span> Producteur Bio
            </p>
          </div>
        </div>
        <button class="text-primary bg-green-50 p-2 rounded-full"><span class="material-icons-round">call</span></button>
      </header>

      <!-- Order Context -->
      <div class="bg-blue-50 px-4 py-2 flex items-center justify-between text-xs border-b border-blue-100">
        <div class="flex items-center space-x-2 text-gray-700">
           <span class="material-icons-round text-secondary text-base">shopping_basket</span>
           <span>Réf: Commande #2390 • Panier Légumes</span>
        </div>
        <span class="text-primary font-bold">Voir</span>
      </div>

      <!-- Messages -->
      <main class="flex-1 overflow-y-auto p-4 space-y-4">
        <div class="flex justify-center my-2"><span class="text-[10px] font-bold text-gray-400 bg-gray-200 px-3 py-1 rounded-full">Aujourd'hui</span></div>
        
        @for (msg of messages(); track msg.id) {
           <div class="flex items-end space-x-2" [class.justify-end]="msg.sender === 'user'">
              @if (msg.sender === 'producer') {
                <img [src]="producer()?.avatar" class="w-6 h-6 rounded-full mb-1 border border-white shadow-sm" alt="av">
              }
              
              <div class="flex flex-col space-y-1 max-w-[75%]" [class.items-end]="msg.sender === 'user'">
                 @if (msg.text) {
                   <div [ngClass]="msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'" class="p-3 rounded-2xl shadow-sm text-sm border border-gray-100/50">
                     {{msg.text}}
                   </div>
                 }
                 @if (msg.image) {
                   <div class="rounded-2xl overflow-hidden shadow-sm border border-gray-200 max-w-xs mt-1">
                     <img [src]="msg.image" class="w-full h-auto" alt="attachment">
                   </div>
                 }
                 <span class="text-[10px] text-gray-400 px-1">{{msg.timestamp | date:'shortTime'}}</span>
              </div>
           </div>
        }
      </main>

      <!-- Input Area -->
      <footer class="bg-white border-t border-gray-100 pb-safe">
         <!-- Quick Replies -->
         <div class="pt-3 pb-2 px-4 overflow-x-auto no-scrollbar whitespace-nowrap flex gap-2">
            <button class="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full border border-blue-100">C'est prêt ?</button>
            <button class="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full border border-blue-100">Encore du stock ?</button>
         </div>

         <!-- Text Box -->
         <div class="px-4 pb-4 pt-1">
           <div class="flex items-end gap-2 bg-gray-100 rounded-3xl p-1 pr-2">
             <button class="p-2 text-gray-400 hover:text-primary"><span class="material-icons-round text-2xl">add_circle_outline</span></button>
             <textarea [(ngModel)]="newMessage" placeholder="Message..." rows="1" class="w-full bg-transparent border-0 focus:ring-0 text-gray-800 placeholder-gray-500 py-3 max-h-32 text-sm resize-none"></textarea>
             <button (click)="send()" [disabled]="!newMessage" class="p-2 bg-primary text-white rounded-full shadow-md disabled:opacity-50 disabled:shadow-none transition-all active:scale-90 mb-0.5">
               <span class="material-icons-round text-lg flex items-center justify-center translate-x-0.5">send</span>
             </button>
           </div>
         </div>
      </footer>
    </div>
  `
})
export class ChatComponent {
  store = inject(StoreService);
  producer = this.store.selectedProducer;
  messages = this.store.messages;
  newMessage = '';

  goBack() {
    this.store.setView('profile');
  }

  send() {
    if(!this.newMessage.trim()) return;
    this.store.messages.update(msgs => [...msgs, {
      id: Date.now().toString(),
      sender: 'user',
      text: this.newMessage,
      timestamp: new Date()
    }]);
    this.newMessage = '';
    
    // Auto reply mock
    setTimeout(() => {
       this.store.messages.update(msgs => [...msgs, {
          id: Date.now().toString() + 'r',
          sender: 'producer',
          text: 'Merci pour le message ! On vous répond très vite.',
          timestamp: new Date()
       }]);
    }, 2000);
  }
}
