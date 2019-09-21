import { Component } from '@angular/core';
import { TITLE } from './app.constants';

const BIG = TITLE.SIZES.BIG;

@Component({
  selector: 'leds-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title: string;
  titleSize: string;

  constructor() {
    this.title = 'Leds';
    this.titleSize = BIG;
  }

}
