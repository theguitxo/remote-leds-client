export const SERVER: any = {
  HOST: '192.168.1.100',
  SCRIPTS: {
    LEDS_ON: 'onleds.php',
    LEDS_OFF: 'offleds.php'
  },
  PROTOCOL: 'http://'
};

export const POPUP: any = {
  TYPE: {
    ALERT: 'alert',
    CONFIRM: 'confirm'
  }
};

export const COLORS: any = {
  BLUE: 'blue',
  RED: 'red',
  YELLOW: 'yellow',
  GREEN: 'green'
};

export const STATES: Array<String> = [
  'off', 'on'
];

export const MAX_LEDS: Number = 8;

export const SEQUENCE_SERVICE_ACTIONS: any = {
  NEW: 'NEW',
  EDIT: 'EDIT',
  EDITED: 'EDITED',
  CANCEL_EDIT: 'CANCEL_EDIT',
  STEP_UPDATED: 'STEP_UPDATED',
  LOAD: {
    OK: 'LOAD_SEQUENCE_OK',
    ERROR :'LOAD_SEQUENCE_ERROR',
  },
  SAVE: {
    OK: 'SAVE_SEQUENCE_OK',
    ERROR: 'SAVE_SEQUENCE_ERROR'
  },
  SEND: {
    SENDED: 'SEQUENCE_SENDED'
  }
};

export const STORAGE: any = {
  LOCAL: 'LOCAL',
  SESSION: 'SESSION',
  SEQUENCES: 'SEQUENCES'
};

export const MESSAGES_BOX: any = {
  TYPES: {
    ERROR: 'alert-danger',
    SUCCESS: 'alert-success'
  }
};

export const TITLE: any = {
  SIZES: {
    BIG: 'BIG',
    MEDIUM: 'MEDIUM',
    SMALL: 'SMALL'
  }
};
