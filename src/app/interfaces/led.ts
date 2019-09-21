export interface Led {
  index: number;
  color: string;
  state: number;
}

export interface LedState {
  index: number;
  state: number;
}

export interface Step {
  steps: Array<Led>;
  delay: number;
}

export interface OperationError {
  error: boolean;
  message: string;
}

export interface StateItem {
  states: Array<number>;
  sleep: number;
}
