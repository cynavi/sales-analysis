import { Component, computed, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { TableFilterEvent, TableModule, TablePageEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Column, ColumnFilter, DataGridCriteria, Sort } from './data-grid';
import { ColumnFilterComponent } from './column-filter.component';
import { InferBodyDirective } from './infer-body.directive';
import { InferHeaderDirective } from './infer-header.directive';
import { Button, ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableSettingComponent } from './table-setting.component';
import { FilterMetadata, MessageService, SortMeta } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { DataGridStore } from './data-grid.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, skip, Subject, switchMap, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { mapColumnsToColumnNames } from './data-grid.util';

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
    DatePipe
  ],
  providers: [
    { provide: DialogService, useClass: DialogService },
  ],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss'
})
export class DataGridComponent implements OnInit {

  dgStore = inject(DataGridStore);
  dialogRef!: DynamicDialogRef<TableSettingComponent>;
  // unsubscribe$ = new Subject<void>();
  // data$ = toObservable(computed(() => ({
  //   filter: {
  //     columnFilters: this.dgStore.filter.columnFilters(),
  //     sorts: this.dgStore.filter.sorts(),
  //     columns: mapColumnsToColumnNames(this.dgStore.filter.columns())
  //   },
  //   paginate: this.dgStore.paginate()
  // }))).pipe(
  //   filter(criteria => !!criteria.filter.columns.length),
  //   skip(1),
  //   switchMap(async (criteria) => this.dgStore.getDataGridData(criteria))
  // );
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);

  constructor() {
    // TODO find a better way
    effect(() => {
      const criteria: DataGridCriteria = {
        filter: {
          columnFilters: this.dgStore.filter.columnFilters(),
          sorts: this.dgStore.filter.sorts(),
          columns: mapColumnsToColumnNames(this.dgStore.filter.columns()),
        },
        paginate: this.dgStore.paginate()
      };
      if (criteria.filter.columns.length) {
        this.dgStore.getDataGridData(criteria);
      }
    }, {allowSignalWrites: true});

    inject(DestroyRef).onDestroy(() => {
      // this.unsubscribe$.next();
      // this.unsubscribe$.complete();
      if (this.dialogRef) {
        this.dialogRef.close();
      }
    });
  }

  ngOnInit(): void {
    // this.data$.pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  onPaginate(event: TablePageEvent) {
    this.dgStore.setPaginate({
      pageSize: event.rows,
      offset: event.first
    });
  }

  onFilterChange(event: TableFilterEvent): void {
    const columnFilters: ColumnFilter[] = [];
    for (let key in event.filters) {
      const filters = event.filters[key] as unknown as FilterMetadata[];
      let columnFilter: ColumnFilter = {
        column: key,
        filters: []
      };
      for (const filter of filters) {
        if (filter.value) {
          columnFilter.filters.push({
            value: filter.value,
            matchMode: filter.matchMode,
            operator: filter.operator
          })
        }
      }
      if (columnFilter.filters.length) {
        columnFilters.push(columnFilter);
      }
    }
    this.dgStore.setColumnFilter(columnFilters);
  }

  openTableSettings(): void {
    this.dialogRef = this.dialogService.open(TableSettingComponent, {
      header: 'Table Settings',
      data: {
        selectedColumns: [...this.dgStore.filter.columns()],
        columns: [...this.dgStore.columns()]
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
        this.dgStore.setSelectedColumns(columns);
        this.messageService.add({ detail: 'Table settings applied.' });
      }
    });
  }

  onSortChange($event: { multisortmeta: SortMeta[] }): void {
    const sorts: Sort[] = [];
    $event.multisortmeta.forEach(sortMeta => {
      sorts.push({ column: sortMeta.field, order: sortMeta.order == 1 ? 'desc' : 'asc' });
    });
    this.dgStore.setSorts(sorts);
  }

  generateCsv() {

  }
}
