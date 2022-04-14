import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
})
export class TrimPipe implements PipeTransform {
  transform(value: string): string {
    return value.length > 160 ? value.substring(0, 160) + '...' : value;
  }
}
