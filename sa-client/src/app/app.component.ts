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
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  socket = inject(SocketConnectService);
}
