import { Poll } from './../poll.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(polls: Poll[], sortBy: string): Poll[] {
    switch(sortBy) {
      case 'newest':
        return this.dateSort(polls, true);
      case 'oldest':
        return this.dateSort(polls, false);
      case 'alphabetic':
        return this.alphabeticSort(polls);
      default:
        return polls;
    }
  }

alphabeticSort(polls: Poll[]) {
  return polls.sort((a, b) => (<string>a['title']).localeCompare(b['title']));
}

dateSort(polls: Poll[], recent: boolean) {
  return polls.sort((a, b) => {
    let c = new Date(a['createdAt']).getTime();
    let d = new Date(b['createdAt']).getTime();
    if(recent) return d - c;
    return c - d;
  });
}

}
