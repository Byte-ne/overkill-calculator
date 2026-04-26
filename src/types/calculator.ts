export type CalculatorMode = 'basic' | 'scientific' | 'programming' | 'graphing';

export type Operation =
    | 'add' | 'subtract' | 'multiply' | 'divide'
    | 'sin' | 'cos' | 'tan' | 'log' | 'ln'
    | 'sqrt' | 'power' | 'factorial'
    | 'and' | 'or' | 'xor' | 'not'
    | 'hex' | 'dec' | 'oct' | 'bin';

export interface CalculationHistory {
    id: string;
    expression: string;
    result: string;
    timestamp: Date;
    mode: CalculatorMode;
}

export interface CalculatorState {
    display: string;
    previousValue: number | null;
    operation: Operation | null;
    waitingForOperand: boolean;
    mode: CalculatorMode;
    history: CalculationHistory[];
    memory: number;
}
