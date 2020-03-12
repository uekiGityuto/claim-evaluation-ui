import { Pipe, PipeTransform } from '@angular/core';

/**
 * フィルターパイプ
 * @author SKK231099 李
 */
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
        case 'date':
          let rtnDate = "";
          if (item && item.toString() != "Invalid Date") {
            try{
              const date = new Date(item);
              const format = 'yyyy/M/d';
              rtnDate = format.replace(/yyyy/g, date.getFullYear().toString());
              rtnDate = rtnDate.replace(/M/g, (date.getMonth() + 1).toString());
              rtnDate = rtnDate.replace(/d/g, date.getDate().toString());
            } catch(e) {
              rtnDate = "";
            }
          }
          return rtnDate;
        case 'sort':
          if (item && item.length > 1 && params.length > 0) {
            const name = params[0];
            const asc = params[1];
            let isFirst = true;
            let isDate = false;
            item.sort((a, b) : any => {
              if (isFirst) {
                isFirst = false;
                if (Number.isNaN(Number(a[name]))) {
                  if (String(new Date(a[name])) != "Invalid Date") {
                    isDate = true;
                  }
                }
              }
              if (asc === 'asc') {
                if (isDate) {
                  return new Date(a[name]) < new Date(b[name]) ? -1 : 1;
                } else {
                  return a[name] < b[name] ? -1 : 1;
                }
              } else {
                if (isDate) {
                  return new Date(a[name]) > new Date(b[name]) ? -1 : 1;
                } else {
                  return a[name] > b[name] ? -1 : 1;
                }
              }
            })
          }
      }
    }
  }
}