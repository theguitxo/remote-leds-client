import { Component, OnInit, OnDestroy, Inject, Renderer2, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { POPUP } from '../../app.constants';

@Component({
  selector: 'leds-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit, OnDestroy {

  @Input() title: string;
  @Input() message: string;
  @Input() type: string;

  /**
   * OUTPUTS
   *   - close: behaviour to execute when the player closes the popup
   *   - confirm: what to do when the player says yes to a confirm popup
   */
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();

  // VIEWS: used for add and remove classes for fades when the player closes the popup
  @ViewChild('contentPopUp') contentPopUp: ElementRef;
  @ViewChild('shadowPopUp') shadowPopUp: ElementRef;

  constructor(@Inject(DOCUMENT) document,
              private renderer: Renderer2) { }

  /**
   * @description initialization of component, changes the style of the body to hide the content overflow
   */
  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  /**
   * @description when the component is destoyed, changes the style of the body to show the content overflow
   */
  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'overflow', 'visible');
  }

  /**
   * closePopUp
   * @description Closes the pop-up
   * @param cancelButton if the user has been pushed the cancel button
   */
  closePopUp(cancelButton: boolean = false): void {

    let timeOutFadeOut: any = null;
    let timeOutFadeOutBackground: any = null;

    this.renderer.addClass(this.contentPopUp.nativeElement, 'fade-out');
    timeOutFadeOut = setTimeout(() => {

      this.renderer.addClass(this.shadowPopUp.nativeElement, 'fade-out-background');
      timeOutFadeOutBackground = setTimeout(() => {

        if (this.type === POPUP.TYPE.ALERT || cancelButton) {
          this.close.emit();
        } else if (this.type === POPUP.TYPE.CONFIRM) {
          this.confirm.emit();
        }

        clearTimeout(timeOutFadeOut);
        clearTimeout(timeOutFadeOutBackground);
        timeOutFadeOut = null;
        timeOutFadeOutBackground = null;

      }, 500);

    }, 1000);

  }

  /**
   * @description returns if the dialog is for confirm a question or not
   * @returns a boolean, true if it's for confirm, or false if not
   */
  isConfirm(): boolean {
    return this.type === POPUP.TYPE.CONFIRM;
  }

  /**
   * @description returns if the dialog is for alert a message
   * @returns a boolean, true if it's for confirm, or false if not
   */
  isAlert(): boolean {
    return this.type === POPUP.TYPE.ALERT;
  }

}
