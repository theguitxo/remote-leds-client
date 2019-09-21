/**
 * leds-loader
 * @description this component opens a pop-up and handle the load, play and stop actions for a sequence in the server
 * @param {any} loader an observable as the process which loads the sequence in the server
 * @output close the event that closes the pop-up
 */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { faTimesCircle, faHandPaper, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { timeout, finalize } from 'rxjs/operators';
import { SequenceService } from '../../services/sequence.service';

@Component({
  selector: 'leds-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() loader: any;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  loading: boolean;
  isLoadOk: boolean;

  faTimesCircle: any;
  faHandPaper: any;
  faExclamationTriangle: any;

  constructor(
    private _sequenceService: SequenceService
  ) {
    this.faTimesCircle = faTimesCircle;
    this.faHandPaper = faHandPaper;
    this.faExclamationTriangle = faExclamationTriangle;
  }

  /**
   * @description initialization of component
   *  sends an order to the server for playing the sequence
   */
  ngOnInit(): void {
    // sets the flag loading to true for show the spinner
    this.loading = true;

    this.loader
      .pipe(
        timeout(5000),
        finalize(() => {
          // on finalize, hides the spinner
          this.loading = false;
        })
      )
      .subscribe(
        (data) => {
          // data loaded ok
          // sets the property to check if loading is ok with the result
          this.isLoadOk = data.result;
        },
        () => {
          // error loading data
          this.isLoadOk = false;
        }
      );
  }

  /**
   * @description emits event to close the pop-up
   */
  closeLoader(): void {
    this.close.emit();
  }

  /**
   * @description sends an order to the server to stop the sequence playing
   */
  stopSequence(): void {
    // sets the flag loading to true for show the spinner
    this.loading = true;

    // class the method to stop the sequence
    this._sequenceService.stopSequenceInServer()
      .pipe(
        timeout(5000),
        finalize(() => {
          // on finalize, hides the spinner
          this.loading = false;
        })
      )
      .subscribe(
        (data) => {
          if (data.result) {
            this.closeLoader();
          } else {
            this.isLoadOk = false;
          }
        },
        () => {
          // error loading data
          this.isLoadOk = false;
        }
      );
  }

}
