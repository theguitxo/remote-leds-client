import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Led, Step, OperationError, StateItem } from '../interfaces/led';
import { SERVER, MAX_LEDS, SEQUENCE_SERVICE_ACTIONS, STORAGE } from '../app.constants';
import { Subject } from 'rxjs/Subject';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs/Observable';

const { NEW, EDIT, EDITED, CANCEL_EDIT, STEP_UPDATED, LOAD, SAVE, SEND } = SEQUENCE_SERVICE_ACTIONS;
const { LOCAL, SEQUENCES } = STORAGE;

@Injectable({
  providedIn: 'root'
})
export class SequenceService {

  private name: string;
  private steps: Array<Array<Step>>;
  private current: Array<Led>;
  private delay: number;
  private sequenceServiceSubject: Subject<{}> = new Subject<{}>();
  public sequenceAction$: any = this.sequenceServiceSubject.asObservable();
  private idxStepEdit: number = null;
  private storedSequences: any;
  private operationError: OperationError;
  private sendSequenceClient: Observable<{}>;

  /**
   * @description constructor of class, initialize some values of the class
   *  and gets, if it's available, the sequences information stored in local storage
   */
  constructor(
    private _storageService: StorageService,
    private _httpClient: HttpClient
  ) {
    this.resetSequence();

    if (this._storageService.keyExists(LOCAL, SEQUENCES)) {
      this.storedSequences = this._storageService.getJSONValue(LOCAL, SEQUENCES);
    } else {
      this.storedSequences = {};
    }

    this.resetOperationError();
  }

  // --------- //
  //  SETTERS  //
  // --------- //

  /**
   * @description sets the message for an error and their flag on true
   * @param {string} message the message to show as error
   */
  setOperationError(message: string): void {
    this.operationError.error = true;
    this.operationError.message = message;
  }

  /**
   * description set the name for a sequence
   * @param {string} value the name for the sequence
   */
  setName(value: string): void {
    this.name = value;
  }

  // --------- //
  //  GETTERS  //
  // --------- //

  /**
   * @description returns the information of an error produced executing an operation
   * @returns an OperationError object (see interfaces)
   */
  getOperationError(): OperationError {
    return this.operationError;
  }

  /**
   * @description returns the name of the current sequence, if it has it
   * @returns a string as the name
   */
  getName(): string {
    return this.name;
  }

  /**
   * @description returns the information of the current step
   *  (it's the which the user is editing currently)
   * @returns an array of LED objects (see intefarces)
   */
  getCurrent(): Array<Led> {
    return this.current;
  }

  /**
   * @description returns the delay defined for the current step
   * @returns a number
   */
  getDelay(): Number {
    return this.delay;
  }

  /**
   * @description returns the steps of the current sequence
   * @returns an array that contains array of Step objects (see interfaces)
   */
  getSteps(): Array<Array<Step>> {
    return this.steps;
  }

  /**
   * @description  returns the number of steps of the current sequence
   * @returns a number
   */
  getTotalSteps(): number {
    return this.steps.length;
  }

  /**
   * @description returns the number of step in the sequence which is editing
   * @returns a number
   */
  getIdxStepEdit(): number {
    return this.idxStepEdit;
  }

  /**
   * @description returns a list with all the keys contained in the object of stored sequences
   * @returns an array of strings
   */
  getListSequencesSaved(): Array<string> {
    return Object.keys(this.storedSequences);
  }

  /**
   * @description returns the name of a stored sequence
   * @param {string} key  key of the object that contains the sequence who which we want get their name
   * @returns a tring with the sequence serialized
   */
  getStoredSequenceName(key: string): string {
    return this.storedSequences[key].name;
  }

  /**
   * @description returns the object created when a request to play a sequence is sent to the server
   * @returns an object as an observable
   */
  getSendSequenceClient(): Observable<{}> {
    return this.sendSequenceClient;
  }

  // ----------------------- //
  //  RESETS & INITIALIZERS  //
  // ----------------------- //

  /**
   * @description emits event to show pop-up that it questions for init a new sequence
   */
  newSequence(): void {
    this.sequenceServiceSubject.next({
      action: NEW,
      confirmAction: () => {
        this.resetSequence();
      }
    });
  }

  /**
   * @descriptions inits values for a new sequence
   */
  resetSequence(): void {
    this.name = '';
    this.steps = [];
    this.current = [];

    for (let i = 0; i < MAX_LEDS; i++) {
      this.current.push({
        index: i,
        color: '',
        state: 0
      });
    }
  }

  /**
   * @description initializes the values for inform an error
   */
  resetOperationError(): void {
    this.operationError = {
      error: false,
      message: ''
    };
  }

  // ------------------- //
  //  SERVER OPERATIONS  //
  // ------------------- //

  /**
   * @description sends a sequence to the server for playing it
   */
  sendSequenceToServer(): void {
    // formats the data to send to the server
    const toSend: Array<StateItem> = [];
    this.steps.forEach((step) => {
      const dataSteps: Array<number> = [];
      step['steps'].forEach(element => dataSteps.push(element.state));
      const stateDataItem: StateItem = {
        states: dataSteps,
        sleep: step['delay']
      };
      toSend.push(stateDataItem);
    });

    // headers and params for the request
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const params = 'data=' + JSON.stringify(toSend);

    // makes the request and stores it in a property of the class
    this.sendSequenceClient = this._httpClient.post(
      `${SERVER.PROTOCOL}${SERVER.HOST}/${SERVER.SCRIPTS.LEDS_ON}`, params, { headers: headers });
    // emits a message to inform that the request has been made
    this.sequenceServiceSubject.next({
      action: SEND.SENDED
    });
  }

  /**
   * @description makes a request to the server to stop the sequence is playing
   */
  stopSequenceInServer(): any {
    return this._httpClient.get(`${SERVER.PROTOCOL}${SERVER.HOST}/${SERVER.SCRIPTS.LEDS_OFF}`);
  }

  // -------------------------- //
  //  LOCAL STORAGE OPERATIONS  //
  // -------------------------- //

  /**
   * @description save the current sequence in the browser local storage
   * @param {string} name name to save and identify the sequence
   * @param {boolean} saveAs if must save the sequence with a name (new or rename) or only save data
   */
  saveSequence(name: string, saveAs: boolean = false) {
    // get a valid key to store and the list of current keys
    const key = this.formatNameToKey(name);
    const keys = this.getListSequencesSaved();

    if (saveAs && keys.indexOf(key) > -1) {
      // a sequence exists with the selected name
      this.setOperationError('A sequence exists with this name');
    } else {
      // data to save
      this.storedSequences[key] = {
        name: name,
        data: this.steps
      };
      // try to save in local storage...
      if (this._storageService.setJSONValue(LOCAL, SEQUENCES, this.storedSequences)) {
        // ...save OK, set the name as current name
        this.name = name;
        // If is only save, emits a message to inform.
        // Save as not need to emit message, all managed by the same component
        if (!saveAs) {
          this.sequenceServiceSubject.next({
            action: SAVE.OK
          });
        }
      } else {
        // ...save KO
        if (saveAs) {
          // The page for save sequence, the same component can inform about error using the message box
          this.setOperationError('An error has been produced saving the sequence');
        } else {
          // Only save, because is the home page, and are different components that manage all the behaviour,
          // must emit a message to inform of the error
          this.sequenceServiceSubject.next({
            action: SAVE.ERROR
          });
        }
      }
    }
  }

  /**
   * @description get a sequence from that are stored and become it as the main
   * @param {string} key key of the sequence to translate from stored to the main
   */
  loadStoredSequence(key: string): void {
    const tempData: string = JSON.stringify(this.storedSequences[key].data);
    this.steps = JSON.parse(tempData);
    this.name = this.storedSequences[key].name;
    this.sequenceServiceSubject.next({
      action: LOAD.OK
    });
  }

  // ------------------------------------ //
  //  CURRENT STEP / SEQUENCE OPERATIONS  //
  // ------------------------------------ //

  /**
   * @description updates the information of the current step with data received as parameters
   * @param {Array<Led>} steps array with LED objects (see interfaces)
   * @param {number} delay delay for the step
   */
  updateCurrentStep(steps: Array<Led>, delay: number): void {
    this.current = steps;
    this.delay = delay;
  }

  /**
   * @descripton emits an event to inform that the current step has been updated
   */
  sendCurrentStepUpdated(): void {
    this.sequenceServiceSubject.next({
      action: STEP_UPDATED
    });
  }

  /**
   * @description add the current step to the current sequence
   */
  addCurrentStep(): void {
    this.steps.push(JSON.parse(this.stepForCopy()));
  }

  /**
   * @description saves a step (previously modified) of the sequence
   */
  saveStep(): void {
    this.steps[this.idxStepEdit] = JSON.parse(this.stepForCopy());
    this.idxStepEdit = null;
    this.sequenceServiceSubject.next({
      action: EDITED
    });
  }

  /**
   * @description deletes a specific step of the current sequence
   * @param {number} step the number of step to delete
   */
  deleteStep(step: number): void {
    this.steps.splice(step, 1);
  }

  /**
   * @description sets the necessary values to edit a step and emits the message to inform
   * @param {number} step number of step in the sequence to edit
   */
  editStep(step: number): void {
    this.idxStepEdit = step;

    this.current = this.steps[step]['steps'];
    this.delay = this.steps[step]['delay'];

    this.sequenceServiceSubject.next({
      action: EDIT
    });
  }

  /**
   * @description sets to null the index to edit and emits a message to inform that editing task has been cancelled
   */
  cancelEditStep(): void {
    this.idxStepEdit = null;
    this.sequenceServiceSubject.next({
      action: CANCEL_EDIT
    });
  }

  // --------------- //
  //  PRIVATE UTILS  //
  // --------------- //

  /**
   * @description formats a string, used as name for a sequence, to use as a key of stored sequences
   * @param {string} name name of the sequence to format
   * @returns a string with the name formated
   */
  formatNameToKey(name: string): string {
    return name.trim().replace(/\s/g, '').toLocaleLowerCase();
  }

  /**
   * @description serialize the information of a step
   * @returns a string with the step serialized
   */
  private stepForCopy(): string {
    return JSON.stringify({
      steps: this.current,
      delay: this.delay
    });
  }
}
