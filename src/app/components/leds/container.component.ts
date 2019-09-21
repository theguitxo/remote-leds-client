/**
 * leds-container
 * @description This component contains all sequence LEDs and permits configure their state in each step of the sequence
 * Parameters
 * @param {string} title  string to show in the title of component
 * @param {boolean} showDelayBar if must show or not the slider for defining the delay to change to next sequence step
 */
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { COLORS, SEQUENCE_SERVICE_ACTIONS, TITLE } from '../../app.constants';
import { Led, LedState } from '../../interfaces/led';
import { SequenceService } from '../../services/sequence.service';

const { BLUE, RED, YELLOW, GREEN } = COLORS;
const { EDIT, CANCEL_EDIT, EDITED, STEP_UPDATED } = SEQUENCE_SERVICE_ACTIONS;

@Component({
  selector: 'leds-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit, OnDestroy {

  @Input() title: string;
  @Input() showDelayBar: Boolean = false;

  leds: Array<Led>;
  delay: any;
  titleSize: string;
  sequenceActionSubscription: any;

  constructor(private _sequenceService: SequenceService) {
    this.initDelayValues();
    this.initLedsValues();

    this.titleSize = TITLE.SIZES.MEDIUM;
  }

  /**
   * @description initialization of component
   */
  ngOnInit(): void {
    // gets a subscription to sequence services to listen to some events.
    this.sequenceActionSubscription =
      this._sequenceService.sequenceAction$.subscribe((action: any) => {
        switch (action.action) {
          // when the information of the LEDs state is modified
          case EDIT:
            // gets the information of delay and LEDs state (this as a string to create a new object)
            this.delay.value = this._sequenceService.getDelay();
            const strLeds: string = JSON.stringify(this._sequenceService.getCurrent());
            // it parses the string with the new states to have a new object
            this.leds = JSON.parse(strLeds);
            break;
          // when the user updates the information of a sequence step or cancels that action
          case EDITED:
          case CANCEL_EDIT:
            this.initLedsValues();
            this.initDelayValues();
            break;
          // when the action for updates the information of a step is finished
          case STEP_UPDATED:
            this.leds = this._sequenceService.getCurrent();
            break;
        }
      });

    this.updateCurrentState();
  }

  /**
  * @description when the component is destoyed
  */
  ngOnDestroy(): void {
    // removes the subscription to service
    this.sequenceActionSubscription.unsubscribe();
  }

  /**
   * @description sets values for LEDs state values
   */
  initLedsValues(): void {
    this.leds = [];
    [BLUE, RED, YELLOW, GREEN, BLUE, RED, YELLOW, GREEN].forEach((color, index) => {
      this.leds.push({
        index: index,
        color: color,
        state: 0
      });
    });
  }

  /**
   * @description sets values for initializing the slider that defines the delay for each step
   */
  initDelayValues(): void {
    this.delay = {
      min: 0.1,
      max: 1.5,
      value: 0.5,
      step: 0.1
    };
  }

  /**
   * @description toggles the state of a LED and updates this information in the service
   * @param {number} data the number of index to modify
   */
  changeState(data: LedState): void {
    this.leds[data.index].state = data.state === 0 ? 1 : 0;
    this.updateCurrentState();
  }

  /**
   * @description updates the LEDs information of the current step in the service
   */
  updateCurrentState(): void {
    this._sequenceService.updateCurrentStep(this.leds, this.delay.value);
  }

}
