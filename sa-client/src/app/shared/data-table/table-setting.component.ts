import { Component, inject, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PickListModule } from 'primeng/picklist';
import { Column } from './data-table';

@Component({
  selector: 'app-table-setting',
  standalone: true,
  imports: [
    DialogModule,
    PickListModule,
    Button
  ],
  providers: [],
  template: `
    <p-pickList
      [source]="sourceColumns"
      [target]="targetColumns"
      sourceHeader="Available"
      targetHeader="Selected"
      [responsive]="true"
      [dragdrop]="true"
      [sourceStyle]="{ maxHeight: '75%' }"
      [targetStyle]="{ maxHeight: '75%' }"
      filterBy="label"
      breakpoint="1400px">
      <ng-template let-column pTemplate="item">
        <div>{{ column.label }}</div>
      </ng-template>
    </p-pickList>
    <div style="display: flex; justify-content: end; margin-top: 0.5rem">
      <p-button
        label="Reset"
        icon="pi pi-filter-slash"
        [style]="{marginRight: '0.5rem'}"
        (click)="reset()"
      />
      <p-button
        label="Save"
        icon="pi pi-save"
        (click)="save()"
      />
    </div>
  `
})
export class TableSettingComponent implements OnInit {

  readonly config = inject<DynamicDialogConfig<{
    selectedColumns: Column[],
    columns: Column[]
  }>>(DynamicDialogConfig);
  readonly dialogRef = inject(DynamicDialogRef);

  sourceColumns: Column[] = [];
  targetColumns: Column[] = [];

  ngOnInit(): void {
    this.targetColumns = this.config.data.selectedColumns;
    this.sourceColumns = this.config.data.columns.filter(c => !this.targetColumns.find(tc => tc.name == c.name));
  }

  reset(): void {
    this.sourceColumns = this.config.data['columns'];
    this.targetColumns = [];
  }

  save(): void {
    this.dialogRef.close(this.targetColumns);
  }
}
