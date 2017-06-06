import { Poll } from './../poll.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {

  transform(polls: Poll[], searchTerm: string): Poll[] {

    if(searchTerm !== '') {
      
      let filteredPolls: Poll[] = [];
      let length = polls.length;

      for(let i = 0; i < length; i++) {
        
        let poll    : Poll     = polls[i];
        let title   : string   = poll['title'].toLowerCase();
        let username: string   = poll['postedBy']['username'].toLowerCase();
        let options : string[] = poll.options.map(option => option.label.toLowerCase());

        if(title.indexOf(searchTerm.toLowerCase()) !== -1) {
          filteredPolls.push(poll);
          continue;
        }

        if(username.indexOf(searchTerm.toLowerCase()) !== -1) {
          filteredPolls.push(poll);
          continue;
        }

        if(options.indexOf(searchTerm.toLowerCase()) !== -1) {
          filteredPolls.push(poll);
          continue;
        }

      }

      return filteredPolls;
    }
    return polls;
  }

}
