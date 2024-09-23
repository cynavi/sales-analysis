import { Directive, input } from '@angular/core';
import { Column } from './data-table';

type Sale = {
  invoiceNo: string,
  stockCode: string,
  description: string,
  quantity: number,
  invoiceDate: Date,
  unitPrice: number,
  country: string
};

interface TableRowTemplateContext {
  $implicit: Sale[];
  columns: Column[];
}

@Directive({
  standalone: true,
  selector: 'ng-template[inferBody]'
})
export class InferBodyDirective {

  sales = input.required<Sale[]>({ alias: 'inferBody' });
  columns = input.required<Column[]>();

  static ngTemplateContextGuard(dir: InferBodyDirective, ctx: unknown): ctx is TableRowTemplateContext {
    return true;
  }

}
