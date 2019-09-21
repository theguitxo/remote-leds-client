/**
 * leds-messages-box
 * @description A message box to show information about processes as loading sequences, saving, ...
 * @param {string} type type of message: ERROR or SUCCESS
 * @param {number} message text that must show it in the box
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'leds-messages-box',
  templateUrl: './messages-box.component.html',
  styleUrls: ['./messages-box.component.scss']
})
export class MessagesBoxComponent {

  @Input() type: string;
  @Input() message: string;

  constructor() { }

  /**
   * @description returns the type of message received as a parameter to the template
   * @returns a string with the type of message
   */
  getBoxClass(): string {
    return this.type;
  }

}
