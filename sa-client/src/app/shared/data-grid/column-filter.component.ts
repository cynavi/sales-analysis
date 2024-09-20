import { Component, computed, input } from '@angular/core';
import { Column } from './data-grid';
import { FilterMatchMode, SelectItem } from 'primeng/api';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-column-filter',
  standalone: true,
  imports: [
    TableModule
  ],
  template: `
    @if (column().type == 'text') {
      <p-columnFilter
        type="text"
        [field]="column().name"
        [matchModeOptions]="textFilterSelect"
        [ariaLabel]="ariaLabel()"
        display="menu"
      />
    } @else if (column().type == 'number') {
      <p-columnFilter
        type="numeric"
        [field]="column().name"
        [ariaLabel]="ariaLabel()"
        [minFractionDigits]="2"
        [maxFractionDigits]="2"
        display="menu"
      />
    }  @else if (column().type == 'date') {
      <p-columnFilter
        type="date"
        [field]="column().name"
        [ariaLabel]="ariaLabel()"
        [minFractionDigits]="2"
        [maxFractionDigits]="2"
        display="menu"
      />
    }
  `,
})
export class ColumnFilterComponent {

  textFilterSelect: SelectItem[] = [
    { value: FilterMatchMode.CONTAINS, label: 'Contains' },
    { value: FilterMatchMode.NOT_CONTAINS, label: 'Not Contains' }
  ] as const;

  column = input.required<Column>();
  ariaLabel = computed(() => `Filter by ${this.column().label}`);
}
