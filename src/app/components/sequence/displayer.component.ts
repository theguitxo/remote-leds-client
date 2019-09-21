/**
 * leds-displayer
 * @description This component is a container to show the steps which the user adds to sequence
 * @output delete action to execute when the user clicks over the button to delete a step of the sequence
 */
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SequenceService } from '../../services/sequence.service';
import { Led, Step } from 'src/app/interfaces/led';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { STATES, TITLE, SEQUENCE_SERVICE_ACTIONS } from '../../app.constants';

@Component({
  selector: 'leds-displayer',
  templateUrl: './displayer.component.html',
  styleUrls: ['./displayer.component.scss'],
})
export class DisplayerComponent implements OnInit, OnDestroy {

  faEdit: any;
  faTrash: any;
  titleSize: string;
  sequenceActionSubscription: any;

  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _sequenceService: SequenceService) {
    this.faEdit = faEdit;
    this.faTrash = faTrash;
    this.titleSize = TITLE.SIZES.MEDIUM;
  }

  /**
   * @description initialization of component
   */
  ngOnInit() {
    // subscription to crontol actions of sequences service
    this.sequenceActionSubscription =
      this._sequenceService.sequenceAction$.subscribe((action: any) => {
        if (action.action === SEQUENCE_SERVICE_ACTIONS.LOAD.OK) {
          return (this.getSteps());
        }
      });
  }

  /**
   * @description when the component is destoyed
   */
  ngOnDestroy() {
    // remove the subscription to sequences service events
    this.sequenceActionSubscription.unsubscribe();
  }

  /**
   * @descripton sets the correct class to a LED icon
   * @param led a LED object, that contains all their information
   * @returns a string with the name of class to apply on LED icon
   */
  colorClass(led: Led): string {
    return `color-${led.color}-${STATES[led.state]}`;
  }

  /**
   * @description gets the list of the current sequence
   * @returns an array that contains the information of the sequence steps
   */
  getSteps(): Array<Array<Step>> {
    return this._sequenceService.getSteps();
  }

  /**
   * @description emits the event to delete a step of a sequence
   * @param step the identification of the step to delete
   */
  deleteStep(step: number): void {
    const actionToDelete = () => {
      this._sequenceService.deleteStep(step);
    };
    this.delete.emit(actionToDelete);
  }

  /**
   * @description runs the method to edit a step
   * @param step the identificator of the step to edit
   */
  editStep(step: number): void {
    this._sequenceService.editStep(step);
  }

}
