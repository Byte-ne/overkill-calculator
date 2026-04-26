import React, { useCallback, useMemo, useState } from 'react';
import { evaluate, parse } from 'mathjs';
import { GraphingPanel } from './components/GraphingPanel';
import { ProgrammingPanel } from './components/ProgrammingPanel';
import { ConstantsPanel } from './components/ConstantsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { UnitConverter } from './components/UnitConverter';
import { SettingsPanel } from './components/SettingsPanel';
import './Calculator.css';

type CalculatorMode = 'basic' | 'scientific' | 'programming' | 'graphing';

export const Calculator: React.FC = () => {
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [display, setDisplay] = useState('0'); // scientific expression / result
  const [basicExpr, setBasicExpr] = useState('');
  const [basicEntry, setBasicEntry] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<number>(0);

  const renderMath = useCallback((expr: string) => {
    const trimmed = expr.trim();
    if (!trimmed || trimmed === '\u00A0') return '';

    try {
      const tex = parse(trimmed).toTex({ parenthesis: 'keep' });
      return window.katex?.renderToString(tex, { throwOnError: false, displayMode: false }) ?? '';
    } catch {
      return '';
    }
  }, []);

  const appendToExpression = useCallback((token: string) => {
    setDisplay((current) => (current === '0' ? token : current + token));
  }, []);

  const backspace = () => {
    if (mode === 'basic') {
      setBasicEntry((current) => {
        if (current.length <= 1) return '0';
        return current.slice(0, -1);
      });
      return;
    }

    setDisplay((current) => (current.length <= 1 ? '0' : current.slice(0, -1)));
  };

  const appendBasicDigit = (digit: string) => {
    setBasicEntry((current) => (current === '0' ? digit : current + digit));
  };

  const appendBasicDot = () => {
    setBasicEntry((current) => (current.includes('.') ? current : `${current}.`));
  };

  const pushBasicOperator = (op: '+' | '-' | '*' | '/') => {
    setBasicExpr((expr) => {
      const trimmed = expr.trim();
      const next = `${trimmed} ${basicEntry} ${op}`.trim();
      return next;
    });
    setBasicEntry('0');
  };

  const clear = () => {
    if (mode === 'basic') {
      setBasicExpr('');
      setBasicEntry('0');
      return;
    }

    setDisplay('0');
  };

  const evaluateBasic = () => {
    const expr = `${basicExpr} ${basicEntry}`.trim();
    if (!expr) return;

    try {
      const result = evaluate(expr);
      if (typeof result === 'number' && Number.isFinite(result)) {
        setHistory((h) => [...h, `${expr} = ${result}`]);
        setBasicExpr('');
        setBasicEntry(String(result));
        return;
      }
    } catch {
      // fallthrough
    }

    setBasicExpr('');
    setBasicEntry('Error');
  };

  const evaluateScientific = () => {
    const expr = display.trim();
    if (!expr) return;

    try {
      const result = evaluate(expr, { Ans: lastAnswer, MEM: memory });
      if (typeof result === 'number' && Number.isFinite(result)) {
        setDisplay(String(result));
        setLastAnswer(result);
        setHistory((h) => [...h, `${expr} = ${result}`]);
      } else {
        setDisplay('Error');
      }
    } catch {
      setDisplay('Error');
    }
  };

  const keypadButtons = useMemo(() => {
    if (mode !== 'scientific') return null;

    return (
      <div className="keypad">
        <button className="button clear" onClick={clear}>C</button>
        <button className="button operator" onClick={backspace} title="Backspace">
          <span className="material-symbols-outlined" aria-hidden="true">backspace</span>
        </button>
        <button className="button operator" onClick={() => appendToExpression('(')}>(</button>
        <button className="button operator" onClick={() => appendToExpression(')')}>)</button>

        <button className="button operator" onClick={() => appendToExpression('sin(')}>sin</button>
        <button className="button operator" onClick={() => appendToExpression('cos(')}>cos</button>
        <button className="button operator" onClick={() => appendToExpression('tan(')}>tan</button>
        <button className="button operator" onClick={() => appendToExpression('^')}>^</button>

        <button className="button operator" onClick={() => appendToExpression('sqrt(')}>√</button>
        <button className="button operator" onClick={() => appendToExpression('log10(')}>log</button>
        <button className="button operator" onClick={() => appendToExpression('ln(')}>ln</button>
        <button className="button operator" onClick={() => appendToExpression('pi')}>π</button>

        <button className="button number" onClick={() => appendToExpression('7')}>7</button>
        <button className="button number" onClick={() => appendToExpression('8')}>8</button>
        <button className="button number" onClick={() => appendToExpression('9')}>9</button>
        <button className="button operator" onClick={() => appendToExpression('/')}>/</button>

        <button className="button number" onClick={() => appendToExpression('4')}>4</button>
        <button className="button number" onClick={() => appendToExpression('5')}>5</button>
        <button className="button number" onClick={() => appendToExpression('6')}>6</button>
        <button className="button operator" onClick={() => appendToExpression('*')}>*</button>

        <button className="button number" onClick={() => appendToExpression('1')}>1</button>
        <button className="button number" onClick={() => appendToExpression('2')}>2</button>
        <button className="button number" onClick={() => appendToExpression('3')}>3</button>
        <button className="button operator" onClick={() => appendToExpression('-')}>-</button>

        <button className="button number zero" onClick={() => appendToExpression('0')}>0</button>
        <button className="button number" onClick={() => appendToExpression('.')}>.</button>
        <button className="button operator equals" onClick={evaluateScientific}>=</button>
        <button className="button operator" onClick={() => appendToExpression('+')}>+</button>

        <button className="button operator" onClick={() => { setMemory(0); }}>MC</button>
        <button className="button operator" onClick={() => { appendToExpression(String(memory)); }}>MR</button>
        <button className="button operator" onClick={() => { const v = Number(display) || 0; setMemory(v); }}>MS</button>
        <button className="button operator" onClick={() => appendToExpression('Ans')}>Ans</button>
      </div>
    );
  }, [appendToExpression, backspace, clear, display, evaluateScientific, memory, mode]);

  const renderCurrentPanel = () => {
    switch (mode) {
      case 'graphing':
        return <GraphingPanel />;
      case 'programming':
        return <ProgrammingPanel />;
      default:
        if (mode === 'scientific') {
          const mathHtml = renderMath(display);
          return (
            <div className="basic-calculator">
              <div className="display">
                <div className="expr">
                  {mathHtml ? (
                    <span className="math" dangerouslySetInnerHTML={{ __html: mathHtml }} />
                  ) : (
                    display || '\u00A0'
                  )}
                </div>
                <div className="value">{display}</div>
              </div>
              {keypadButtons}
            </div>
          );
        }
        const basicMathHtml = renderMath(`${basicExpr} ${basicEntry}`.trim());
        return (
          <div className="basic-calculator">
            <div className="display">
              <div className="expr">
                {basicMathHtml ? (
                  <span className="math" dangerouslySetInnerHTML={{ __html: basicMathHtml }} />
                ) : (
                  basicExpr || '\u00A0'
                )}
              </div>
              <div className="value">{basicEntry}</div>
            </div>
            <div className="keypad">
              <button className="button clear" onClick={clear}>C</button>
              <button className="button operator" onClick={backspace} title="Backspace">
                <span className="material-symbols-outlined" aria-hidden="true">backspace</span>
              </button>
              <button className="button operator" onClick={() => pushBasicOperator('/')}>/</button>
              <button className="button operator" onClick={() => pushBasicOperator('*')}>*</button>

              <button className="button number" onClick={() => appendBasicDigit('7')}>7</button>
              <button className="button number" onClick={() => appendBasicDigit('8')}>8</button>
              <button className="button number" onClick={() => appendBasicDigit('9')}>9</button>
              <button className="button operator" onClick={() => pushBasicOperator('-')}>-</button>

              <button className="button number" onClick={() => appendBasicDigit('4')}>4</button>
              <button className="button number" onClick={() => appendBasicDigit('5')}>5</button>
              <button className="button number" onClick={() => appendBasicDigit('6')}>6</button>
              <button className="button operator" onClick={() => pushBasicOperator('+')}>+</button>

              <button className="button number" onClick={() => appendBasicDigit('1')}>1</button>
              <button className="button number" onClick={() => appendBasicDigit('2')}>2</button>
              <button className="button number" onClick={() => appendBasicDigit('3')}>3</button>
              <button className="button operator equals" onClick={evaluateBasic}>=</button>

              <button className="button number zero" onClick={() => appendBasicDigit('0')}>0</button>
              <button className="button number" onClick={appendBasicDot}>.</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="calculator">
      <div className="calculator-header">
        <h1>Scientific Calculator</h1>
        <div className="mode-selector">
          <button
            className={`mode-button ${mode === 'basic' ? 'active' : ''}`}
            onClick={() => setMode('basic')}
          >
            Basic
          </button>
          <button
            className={`mode-button ${mode === 'scientific' ? 'active' : ''}`}
            onClick={() => setMode('scientific')}
          >
            Scientific
          </button>
          <button
            className={`mode-button ${mode === 'programming' ? 'active' : ''}`}
            onClick={() => setMode('programming')}
          >
            Programming
          </button>
          <button
            className={`mode-button ${mode === 'graphing' ? 'active' : ''}`}
            onClick={() => setMode('graphing')}
          >
            Graphing
          </button>
        </div>
      </div>

      <div className="calculator-content">
        <div className="calculator-main">
          {renderCurrentPanel()}
        </div>

        <div className="calculator-sidebar">
          <ConstantsPanel />
          <HistoryPanel history={history} />
          <UnitConverter />
          <SettingsPanel />
        </div>
      </div>
    </div>
  );
};
