import { 
  Component, 
  Input,
  ViewChild,
  ElementRef} from '@angular/core';

import { Poll } from './../poll.model';

@Component({
  selector: 'app-polls-list',
  templateUrl: './polls-list.component.html',
  styleUrls: ['./polls-list.component.css']
})
export class PollsListComponent {

  @Input() polls: Poll[];
  @ViewChild('collapse') pollList: ElementRef;

  searchTerm = '';
  sortFilters = ['alphabetic', 'newest', 'oldest'];
  sortBy = this.sortFilters[0];

  listDeployed = false;

  constructor() { }

  onSortFilterChange(e: Event) {
    this.sortBy = (<HTMLSelectElement>e.target).value;
  }

  onOpen() {
    let menu = (<HTMLDivElement>this.pollList.nativeElement);
    let hidden = menu.classList.contains('hidden-xs') && menu.classList.contains('hidden-sm');
    if(hidden) {
      menu.classList.remove('hidden-xs');
      menu.classList.remove('hidden-sm');
      this.listDeployed = true;
    } else {
      this.listDeployed = false;
      menu.classList.add('hidden-xs');
      menu.classList.add('hidden-sm');
    }
  }

}
