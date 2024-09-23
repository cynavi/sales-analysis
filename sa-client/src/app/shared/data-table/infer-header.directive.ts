import { Directive, input } from '@angular/core';
import { Column } from './data-table';

@Directive({
  standalone: true,
  selector: 'ng-template[inferHeader]'
})
export class InferHeaderDirective {

  columns = input.required<Column[]>({ alias: 'inferHeader' });

  static ngTemplateContextGuard<T extends any[]>(dir: InferHeaderDirective,
                                                 ctx: unknown): ctx is { $implicit: Column[]; } {
    // As before the guard body is not used at runtime, and included only to avoid
    // TypeScript errors.
    return true;
  }
}
