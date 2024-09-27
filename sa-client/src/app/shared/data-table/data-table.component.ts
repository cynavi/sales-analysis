import { Component, DestroyRef, inject } from '@angular/core';
import { TableFilterEvent, TableModule, TablePageEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Column, ColumnFilter, Sort } from './data-table';
import { ColumnFilterComponent } from './column-filter.component';
import { InferBodyDirective } from './infer-body.directive';
import { InferHeaderDirective } from './infer-header.directive';
import { Button, ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableSettingComponent } from './table-setting.component';
import { FilterMetadata, MessageService, SortMeta } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { DatePipe } from '@angular/common';
import { DataTableService } from './data-table.service';
import { DataTableStore } from './data-table.store';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    DropdownModule,
    FormsModule,
    ColumnFilterComponent,
    InferBodyDirective,
    InferHeaderDirective,
    Button,
    TooltipModule,
    MessagesModule,
    ButtonModule,
    DatePipe,
    ProgressBarModule
  ],
  providers: [
    DialogService,
    DataTableStore,
    DataTableService
  ],
  templateUrl: './data-table.component.html'
})
export class DataTableComponent {

  #dialogService = inject(DialogService);
  #messageService = inject(MessageService);
  #dataTableService = inject(DataTableService);
  dataTableStore = inject(DataTableStore);

  dialogRef!: DynamicDialogRef<TableSettingComponent>;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.dialogRef) {
        this.dialogRef.close();
      }
    });
  }

  onPaginate(event: TablePageEvent) {
    this.dataTableStore.paginate$.next({ pageSize: event.rows, offset: event.first });
  }

  onFilterChange(event: TableFilterEvent): void {
    const columnFilters: ColumnFilter[] = [];
    for (let key in event.filters) {
      const filters = event.filters[key] as unknown as FilterMetadata[];
      let operator = '';
      let columnFilter: ColumnFilter = {
        column: key,
        columnFilters: [],
        operator
      };
      for (const filter of filters) {
        if (filter.value) {
          columnFilter.columnFilters.push({
            value: filter.value,
            matchMode: filter.matchMode,
          });
          operator = filter.operator;
        }
      }
      if (columnFilter.columnFilters.length) {
        columnFilters.push({ ...columnFilter, operator });
      }
    }
    this.dataTableStore.columnFilters$.next(columnFilters);
  }

  openTableSettings(): void {
    this.dialogRef = this.#dialogService.open(TableSettingComponent, {
      header: 'Table Settings',
      data: {
        selectedColumns: [...this.dataTableStore.dataTableFilter.columns()],
        columns: [...this.dataTableStore.columns()]
      },
      width: '50vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      maximizable: true,
      closeAriaLabel: 'Close'
    });

    this.dialogRef.onClose.subscribe((columns: Column[]) => {
      if (!!columns?.length) {
        this.dataTableStore.columns$.next(columns);
        this.#messageService.add({ detail: 'Table settings applied.' });
      }
    });
  }

  onSortChange($event: { multisortmeta: SortMeta[] }): void {
    const sorts: Sort[] = [];
    $event.multisortmeta.forEach(sortMeta => {
      sorts.push({ column: sortMeta.field, sortOrder: sortMeta.order == 1 ? 'desc' : 'asc' });
    });
    this.dataTableStore.sorts$.next(sorts);
  }

  generateCsv(): void {
    this.#dataTableService.generateCsv(this.dataTableStore.dataTableFilter()).subscribe();
  }
}
