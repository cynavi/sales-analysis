import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketConnectService } from './socket-connect.service';
import { ToastModule } from 'primeng/toast';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule,
    ToolbarComponent,
  ],
  providers: [],
  template: `
    <div class="min-h-screen">
      <p-toast [life]="2000"/>
      <app-toolbar></app-toolbar>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  socket = inject(SocketConnectService);
}
