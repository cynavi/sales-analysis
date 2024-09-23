import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketConnectService } from './socket-connect.service';
import { ToastModule } from 'primeng/toast';
import { DataTableStore } from './shared/data-table/data-table.store';
import { DataTableService } from './shared/data-table/data-table.service';
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
    DataTableStore,
    { provide: DataTableService, useClass: DataTableService }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  socket = inject(SocketConnectService);
}
