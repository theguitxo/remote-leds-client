/**
 * leds-home
 * @description This component is the home page and contains all component to define sequences
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SequenceService } from 'src/app/services/sequence.service';
import { POPUP, SEQUENCE_SERVICE_ACTIONS } from '../../app.constants';
import { Observable } from 'rxjs/Observable';

const { NEW, EDITED, SAVE, SEND } = SEQUENCE_SERVICE_ACTIONS;

@Component({
  selector: 'leds-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  showPopUp: boolean;
  typePopUp: string;
  titlePopUp: string;
  messagePopUp: string;
  confirmAction: any;
  sequenceActionSubscription: any;
  showSequenceLoader: boolean;
  sequenceLoaderSubscription: Observable<{}>;

  constructor(private _sequenceService: SequenceService) {

    this.showPopUp = false;
    this.typePopUp = '';
    this.titlePopUp = '';
    this.messagePopUp = '';
    this.confirmAction = null;
    this.sequenceActionSubscription = null;
    this.showSequenceLoader = false;
    this.sequenceLoaderSubscription = null;
  }

  /**
   * @description initialization of component
   */
  ngOnInit(): void {
    // gets a subscription to sequence services to listen to some events.
    this.sequenceActionSubscription =
      this._sequenceService.sequenceAction$.subscribe((action: any) => {
        switch (action.action) {
          // when the user updates the information of a sequence step
          case EDITED:
            this.typePopUp = POPUP.TYPE.ALERT;
            this.titlePopUp = 'Step saved';
            this.messagePopUp = 'The step has been saved';
            this.showPopUp = true;
            break;
          // when the user saves a sequence to local storage
          case SAVE.OK:
            this.typePopUp = POPUP.TYPE.ALERT;
            this.titlePopUp = 'Save sequence';
            this.messagePopUp = 'The sequence has been saved';
            this.showPopUp = true;
            break;
          // when an error is produced when the user saves sequence information to local storage
          case SAVE.ERROR:
            this.typePopUp = POPUP.TYPE.ERROR;
            this.titlePopUp = 'Save sequence';
            this.messagePopUp = 'An error has been produced saving the sequence';
            this.showPopUp = true;
            break;
          // when the user sends a sequence to the server
          case SEND.SENDED:
            this.sequenceLoaderSubscription = this._sequenceService.getSendSequenceClient();
            this.showSequenceLoader = true;
            break;
          // when the user creates a new sequence
          case NEW:
            this.typePopUp = POPUP.TYPE.CONFIRM;
            this.titlePopUp = 'New sequence';
            this.messagePopUp = 'Discard all changes and create a new sequence?';
            this.confirmAction = action.confirmAction;
            this.showPopUp = true;
            break;
        }
      });
  }

  /**
   * @description when the component is destoyed
   */
  ngOnDestroy(): void {
    // removes the subscription to service
    this.sequenceActionSubscription.unsubscribe();
  }

  /**
   * @description deletes a step from the generated sequence
   */
  deleteStep(executeOnConfirm: any): void {
    this.typePopUp = POPUP.TYPE.CONFIRM;
    this.titlePopUp = 'Delete step';
    this.messagePopUp = 'Are you sure to delete the step?';
    this.confirmAction = executeOnConfirm;
    this.showPopUp = true;
  }

  /**
   * @description closes the popup (used for show information, confirmations, ...)
   */
  closePopUp(): void {
    this.showPopUp = false;
  }

  /**
   * @description it executes the assigned action when a popup is for confirmation and user press OK
   */
  executeConfirmAction(): void {
    this.confirmAction();
    this.showPopUp = false;
  }

  /**
   * @description closes the popup that is shown while is playing sequence
   */
  closeSequenceLoader(): void {
    this.showSequenceLoader = false;
  }

}
