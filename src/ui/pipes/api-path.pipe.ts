import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'apiPath',
  standalone: true
})
export class ApiPathPipe implements PipeTransform {

  transform(value: string): string {
    const match = value.match(/^\/([^\/]*)/);
    return match ? match[1] : '';
  }

}
