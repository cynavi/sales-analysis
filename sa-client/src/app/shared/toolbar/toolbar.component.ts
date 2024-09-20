import { Component, inject } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    TabMenuModule,
    ToolbarModule,
    Button
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  router = inject(Router);

  items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      route: ''
    },
    {
      label: 'About',
      icon: 'pi pi-info-circle',
      route: '/about'
    },
  ];
}
