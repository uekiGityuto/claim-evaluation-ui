import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(item: any, method: string, option: any = {}): any {
    if(item && method) {
      switch(method) {
        case 'abs':
          return Math.abs(item);
        case 'date':
          return new Date(item);
      }
    }
  }
}