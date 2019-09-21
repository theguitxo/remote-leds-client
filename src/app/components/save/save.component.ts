/**
 * leds-save
 * @description this component is the page for save sequences into local storage
 */
import { Component, OnInit } from '@angular/core';
import { faSave, faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { SequenceService } from '../../services/sequence.service';
import { MESSAGES_BOX, TITLE } from '../../app.constants';

@Component({
  selector: 'leds-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent implements OnInit {

  faUndoAlt: any;
  faSave: any;

  name: string;

  typeMessageBox: string;
  messageMessageBox: string;
  showMessageBox: boolean;

  titleSize: string;

  constructor(
    private _router: Router,
    private _sequenceService: SequenceService
  ) {
    this.faUndoAlt = faUndoAlt;
    this.faSave = faSave;
    this.titleSize = TITLE.SIZES.MEDIUM;
  }

  /**
   * @description initialization of component
   */
  ngOnInit(): void {
    // init values
    this.name = '';
    this.typeMessageBox = '';
    this.messageMessageBox = '';
    this.showMessageBox = false;
    // if the current sequence hasn't steps, returns to home
    if (this._sequenceService.getTotalSteps() <= 0) {
      this.backHome();
    }
  }

  /**
   * @description returns to home page
   */
  backHome(): void {
    this._router.navigate(['/home']);
  }

  /**
   * @description initializes the values that control errors in
   *  sequence services and hides the box that shows messages
   */
  hideMessageBox(): void {
    this._sequenceService.resetOperationError();
    this.showMessageBox = false;
  }

  /**
   * @description to indicate if it must to disable the save button
   * @returns a boolean value, true if must disable, otherwise, false
   */
  disableSave(): boolean {
    return this.name.trim().length <= 0;
  }

  /**
   * @description saves a sequence into local storage
   */
  saveSequence(): void {
    // class the method to save the sequence
    this._sequenceService.saveSequence(this.name, true);

    // checks if any error has been produced
    if (this._sequenceService.getOperationError().error) {
      this.typeMessageBox = MESSAGES_BOX.TYPES.ERROR;
      this.messageMessageBox = this._sequenceService.getOperationError().message;
    } else {
      this.typeMessageBox = MESSAGES_BOX.TYPES.SUCCESS;
      this.messageMessageBox = 'The sequence has been saved';
    }

    // shows the message box with the result of the operation
    this.showMessageBox = true;
  }

}
