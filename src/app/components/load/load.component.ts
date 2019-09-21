/**
 * leds-load
 * @description This component is the page to load sequences information of the local storage
 */
import { Component, OnInit } from '@angular/core';
import { faFolderOpen, faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import { TITLE } from '../../app.constants';
import { SequenceService } from '../../services/sequence.service';
import { Router } from '@angular/router';

@Component({
  selector: 'leds-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss']
})
export class LoadComponent implements OnInit {

  titleSize: string;
  sequencesKeys: Array<string>;

  faUndoAlt: any;
  faFolderOpen: any;

  selectedKey: string;

  constructor(
    private _sequenceService: SequenceService,
    private _router: Router
  ) {
    this.faUndoAlt = faUndoAlt;
    this.faFolderOpen = faFolderOpen;
    this.titleSize = TITLE.SIZES.MEDIUM;
    this.selectedKey = '';
  }

  /**
  * @description initialization of component
  */
  ngOnInit(): void {
    // gets, using the sequences service, the list of sequences stored
    this.sequencesKeys = this._sequenceService.getListSequencesSaved();
  }

  /**
   * @description returns if it must show a message to inform that there's not any sequence to load
   * @returns a boolean value, true if there are not sequences, otherwise, false
   */
  showMessageNoSequences(): boolean {
    return this.sequencesKeys.length <= 0;
  }

  /**
   * @description returns if it must disable or not the button for load a sequence
   * @returns a boolean value, true if it must disable, otherwise, false
   */
  disableLoad(): boolean {
    return this.selectedKey === '';
  }

  /**
   * @description calls a method of sequences service to load a sequence and backs to home
   */
  loadSequence(): void {
    this._sequenceService.loadStoredSequence(this.selectedKey);
    this.backHome();
  }

  /**
   * @description returns to home page
   */
  backHome(): void {
    this._router.navigate(['/home']);
  }

  /**
   * @description returns the name of a sequence stored in local storage
   * @param key key to identify the sequence in the list
   * @returns a string with the name of sequence
   */
  getStoredSequenceName(key: string): string {
    return this._sequenceService.getStoredSequenceName(key);
  }

  /**
   * @description returns if an item of the sequences list is the selected item
   * @param key the key that identifies the item of the list
   * @returns a boolean value, true if it's, otherwise, false
   */
  sequencesListActiveItem(key: string): boolean {
    return this.selectedKey === key;
  }

  /**
   * @description set an item of the sequences list as the selected
   * @param key the key to set as selected
   */
  selectSequence(key: string): void {
    this.selectedKey = key;
  }

}
