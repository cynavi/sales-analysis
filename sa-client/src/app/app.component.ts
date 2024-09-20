import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketConnectService } from './socket-connect.service';
import { ToastModule } from 'primeng/toast';
import { DataGridStore } from './shared/data-grid/data-grid.store';
import { DataGridService } from './shared/data-grid/data-grid.service';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule,
    ToolbarComponent,
  ],
  providers: [
    DataGridStore,
    { provide: DataGridService, useClass: DataGridService }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  socket = inject(SocketConnectService);
}
