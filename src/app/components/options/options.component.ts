/**
 * leds-options
 * @description component that contains options for the sequences and their steps
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SequenceService } from '../../services/sequence.service';
import { faPlusSquare, faSave, faUndo, faEye, faFolderOpen, faShare, faFile } from '@fortawesome/free-solid-svg-icons';
import { TITLE, SEQUENCE_SERVICE_ACTIONS } from '../../app.constants';

const { NEW } = SEQUENCE_SERVICE_ACTIONS;

@Component({
  selector: 'leds-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {

  faPlusSquare: any;
  faSave: any;
  faUndo: any;
  faEye: any;
  faFolderOpen: any;
  faShare: any;
  faFile: any;
  titleSize: string;

  constructor(
    private _sequenceService: SequenceService,
    private _router: Router
  ) {
    this.titleSize = TITLE.SIZES.MEDIUM;
    this.faPlusSquare = faPlusSquare;
    this.faSave = faSave;
    this.faUndo = faUndo;
    this.faEye = faEye;
    this.faFolderOpen = faFolderOpen;
    this.faShare = faShare;
    this.faFile = faFile;
  }

  /**
   * @description creates a new sequence
   */
  newSequence(): void {
    this._sequenceService.newSequence();
  }

  /**
   * @description add a new step to a sequence
   */
  addStep(): void {
    this._sequenceService.addCurrentStep();
  }

  /**
   * @description saves the LEDs states of a step when the user is editing it
   */
  saveStep(): void {
    this._sequenceService.saveStep();
  }

  /**
   * @description returns if is been editing a step
   * @returns true if it's, otherwise, false
   */
  editingStep(): boolean {
    return this._sequenceService.getIdxStepEdit() !== null;
  }

  /**
   * @description returns if it must disable the button to show the demo of a sequence
   * @returns true if must it to disable, otherwise, false
   */
  disableDemoSendButtons(): boolean {
    return this._sequenceService.getTotalSteps() < 2;
  }

  /**
   * @description cancels edition of a step
   */
  cancelEdit(): void {
    this._sequenceService.cancelEditStep();
  }

  /**
   * @description goes to the page that plays the demos of sequences
   */
  goToDemo(): void {
    this._router.navigate(['/demo']);
  }

  /**
   * @description returns if it must disable or not the button to save a sequence
   * @returns a boolean that returns true or false, depending on the condition
   */
  disableSaveDemo(): boolean {
    return !(this._sequenceService.getTotalSteps() > 1 && this._sequenceService.getName() !== '');
  }

  /**
   * @description returns if it must disable or not the button 'Save as...'
   * @returns a boolean that returns true or false, depending on the condition
   */
  disableSaveAsDemo(): boolean {
    return this._sequenceService.getTotalSteps() < 1;
  }

  /**
   * @description returns if it must disalbe or not the button to load sequences
   * @returns a boolean that returns true or false, depending on the condition
   */
  disableLoadDemo(): boolean {
    return this._sequenceService.getListSequencesSaved().length <= 0;
  }

  /**
   * @description saves a sequence that is been previously saved
   */
  saveDemo(): void {
    this._sequenceService.saveSequence(this._sequenceService.getName());
  }

  /**
   * @description goes to page for save a sequence with a new name (or when isn't is been saved still)
   */
  saveAsDemo(): void {
    this._router.navigate(['/save']);
  }

  /**
   * @description goes to page to load sequences
   */
  loadDemo(): void {
    this._router.navigate(['/load']);
  }

  /**
   * @description sends a sequence to the server for playing it
   */
  sendSequence(): void {
    this._sequenceService.sendSequenceToServer();
  }
}
