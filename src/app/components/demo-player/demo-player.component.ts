/**
 * leds-demo-player
 * @description This component permits the user to view a demo of the sequence before sending it to server
*/
import { Component, OnInit } from '@angular/core';
import { faPlay, faStop, faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { SequenceService } from 'src/app/services/sequence.service';
import { Step } from '../../interfaces/led';

@Component({
  selector: 'leds-demo-player',
  templateUrl: './demo-player.component.html',
  styleUrls: ['./demo-player.component.scss']
})
export class DemoPlayerComponent implements OnInit {

  faPlay: any = faPlay;
  faStop: any = faStop;
  faUndoAlt: any = faUndoAlt;

  steps: Array<Array<Step>>;
  playTimeOut: any;

  constructor(
    private _router: Router,
    private _sequenceService: SequenceService
  ) {
    this.playTimeOut = null;
  }

  /**
   * @description initialization of component
   */
  ngOnInit(): void {
    this.getSteps();
    if (this.steps.length <= 0) {
      this.backHome();
    }
  }

  /**
   * @description sets steps information on the class
   */
  getSteps(): void {
    this.steps = this._sequenceService.getSteps();
  }

  /**
   * @description returns to the home page
   */
  backHome(): void {
    this.stopDemo();
    this._router.navigate(['/home']);
  }

  /**
   * @descritpion returns if it must disable or not the play button
   */
  disablePlayStop(): boolean {
    return this.playTimeOut === null;
  }

  /**
   * @description shows LEDs in the state which indicates step information
   * @param index step number to show
   */
  playDemo(index: number) {
    // updates the current step information
    this._sequenceService.updateCurrentStep(
      this.steps[index]['steps'], this.steps[index]['delay']
    );
    this._sequenceService.sendCurrentStepUpdated();
    // updates the index number and, if after checking that the index is less than total steps,
    // calls the play function one more time, dependent on the verification result
    this.playTimeOut = setTimeout(() => {
      index++;
      if (index >= this.steps.length) {
        index = 0;
      }
      this.playDemo(index);
    }, this.steps[index]['delay'] * 1000);
  }

  /**
   * @description stops playing demo
   */
  stopDemo(): void {
    clearTimeout(this.playTimeOut);
    this.playTimeOut = null;
  }

}
