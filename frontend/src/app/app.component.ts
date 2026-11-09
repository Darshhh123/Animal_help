import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({selector:'app-root',standalone:true,imports:[CommonModule,FormsModule],template:`
<div class="layout">
 <aside class="side">
  <div class="brand"><span class="paw">🐾</span><div><b>AnimalCare AI</b><small>YOUR PET'S WELLNESS PARTNER</small></div></div>
  <div class="intro"><label>CARE THAT CONNECTS</label><h1>Because every<br><em>paw matters.</em></h1><p>Friendly guidance and simple appointment booking for the pets you love.</p></div>
  <div class="pets"><span>🐕</span><span>🐈</span></div>
  <div class="sidebox">🟢 &nbsp; <b>Pet care, made easier</b><small>Ask questions. Plan visits. Feel prepared.</small></div>
  <div class="disclaimer">Educational information only. Consult a veterinarian for medical concerns.</div>
 </aside>
 <main>
  <header><div class="spark">✦</div><div><b>AnimalCare Assistant</b><small>● Online · Here to help</small></div><button class="ghost" (click)="showAppointments()">Appointments</button></header>
  <section class="welcome"><label>✦ &nbsp; YOUR FRIENDLY PET COMPANION</label><h2>Hi there! How can I help<br>your <em>best friend</em> today?</h2><p>Choose a quick action or ask me anything about your cat or dog.</p></section>
  <section class="actions">
   <button (click)="ask('I want to book a pet appointment. What details do you need?')"><strong>＋</strong><b>Book appointment</b><small>Plan your next visit</small></button>
   <button (click)="ask('Give me everyday pet care tips for cats and dogs.')"><strong>♡</strong><b>Pet care tips</b><small>Everyday wellness</small></button>
   <button (click)="ask('What are common signs that my pet needs a veterinarian?')"><strong>✚</strong><b>Health information</b><small>Know what to watch for</small></button>
  </section>
  <section class="chat"><div *ngFor="let m of messages" class="msg" [class.user]="m.role==='user'"><span class="avatar">{{m.role==='bot'?'✦':'☺'}}</span><div>{{m.text}}</div></div><div *ngIf="loading" class="msg"><span class="avatar">✦</span><div>Thinking…</div></div></section>
  <div class="composer"><input [(ngModel)]="draft" (keyup.enter)="send()" placeholder="Ask about pet care or appointments…"><button (click)="send()" [disabled]="!draft.trim()||loading">Send ↑</button></div>
  <footer>AnimalCare AI · Made with care for every paw</footer>
 </main>
</div>
<div class="veil" *ngIf="open" (click)="open=false"><section class="modal" (click)="$event.stopPropagation()"><div class="modalhead"><h3>Recent appointments</h3><button (click)="open=false">✕</button></div><p *ngIf="!appointments.length">No appointments yet.</p><article *ngFor="let a of appointments"><b>{{a.pet_name}} · {{a.service}}</b><small>{{a.pet_type}} · {{a.appointment_date}} at {{a.appointment_time}} · {{a.status}}</small><small>Booking ID: {{a.booking_id}}</small></article></section></div>
`})
export class AppComponent {
 draft='';loading=false;open=false;appointments:any[]=[];
 messages:{role:string,text:string}[]=[{role:'bot',text:'Welcome! I can help with general cat and dog care information. What would you like to do today?'}];
 constructor(private http:HttpClient){}
 ask(s:string){this.draft=s;this.send();}
 send(){const s=this.draft.trim();if(!s||this.loading)return;this.messages.push({role:'user',text:s});this.draft='';this.loading=true;
 this.http.post<any>('http://127.0.0.1:8000/api/chat',{message:s}).subscribe({next:r=>{this.messages.push({role:'bot',text:r.reply});this.loading=false;},error:()=>{this.messages.push({role:'bot',text:'Cannot reach the API. Please start the FastAPI backend.'});this.loading=false;}});}
 showAppointments(){this.http.get<any[]>('http://127.0.0.1:8000/api/appointments').subscribe({next:r=>{this.appointments=r;this.open=true;},error:()=>{this.appointments=[];this.open=true;}});}
}
