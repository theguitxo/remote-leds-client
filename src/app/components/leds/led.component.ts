/**
 * leds-led
 * @description This component is a LED in the current step and permits define their state
 * @param {string} color a color name for the LED
 * @param {number} index the index of LED into the sequence step
 * @param {number} state the state (0 -> off, 1 -> on) of LED
 * @output changeState action to execute when the user clicks over a LED to change their state
 */
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { STATES } from '../../app.constants';
import { LedState } from '../../interfaces/led';

@Component({
  selector: 'leds-led',
  templateUrl: './led.component.html',
  styleUrls: ['./led.component.scss']
})
export class LedComponent {

  @Input() public color: string;
  @Input() public state: number;
  @Input() public index: number;

  @Output() changeState = new EventEmitter<LedState>();

  constructor() {
  }

  /**
   * @description defines the color of a LED
   * @returns a string that is a CSS class that defines the color
   */
  ledClass(): string {
    return `led-${this.color}-${STATES[this.state]}`;
  }

  /**
   * @changeLed emits an event to the parent component to inform that the state of a LED is been changed
   */
  changeLed(): void {
    this.changeState.emit({
      index: this.index,
      state: this.state
    });
  }

}
