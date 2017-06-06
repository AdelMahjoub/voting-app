import { Component } from '@angular/core';
import { slideInAnimation } from "../../utils/animations";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    slideInAnimation(200)
  ]
})
export class HomeComponent { }
