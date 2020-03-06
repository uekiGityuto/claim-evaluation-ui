import { Pipe, PipeTransform } from '@angular/core';
import { strict } from 'assert';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(item: any, method: string, params: any = []): any {
    if(item && method) {
      switch(method) {
        case 'abs':
          return Math.abs(item);
        case 'replace':
          for (let i=0; i<params.length; i++) {
            const param = params[i];
            if (param.length > 1) {
              const before = new RegExp(param[0], 'g');
              const after = param[1];
              item = item.replace(before, after);
            }
          }
          return item;
      }
    }
  }
}