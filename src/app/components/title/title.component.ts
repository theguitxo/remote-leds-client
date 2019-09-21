/**
 * leds-title
 * @description shows a title for the app sections
 * @param {String} size the size of the text of the title, can be BIG, MEDIUM or SMALL
 * @param {String} text the text that must show the title
 */
import { Component, Input } from '@angular/core';
import { TITLE } from '../../app.constants';

@Component({
  selector: 'leds-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {

  @Input() size: string;
  @Input() text: string;

  bigSize: string = TITLE.SIZES.BIG;
  mediumSize: string = TITLE.SIZES.MEDIUM;
  smallSize: string = TITLE.SIZES.SMALL;

  constructor() { }

  /**
   * @description returns if a title (Hx html tag) must be show, depending the 'size' parameter received
   * @param size the size of the title must be shown
   * @returns a boolean value that is true if the size of Hx tag is equal of that received as a parameter, or false if not
   */
  showTitleBySize(size: string): boolean {
    return this.size === size;
  }

}
