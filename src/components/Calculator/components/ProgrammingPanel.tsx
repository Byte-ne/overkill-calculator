import React, { useState } from 'react';
import './ProgrammingPanel.css';

export const ProgrammingPanel: React.FC = () => {
    const [decimal, setDecimal] = useState<string>('0');
    const [binary, setBinary] = useState<string>('0');
    const [hexadecimal, setHexadecimal] = useState<string>('0');
    const [octal, setOctal] = useState<string>('0');

    const updateFromDecimal = (value: string) => {
        const num = parseInt(value) || 0;
        setDecimal(num.toString());
        setBinary(num.toString(2));
        setHexadecimal(num.toString(16).toUpperCase());
        setOctal(num.toString(8));
    };

    const updateFromBinary = (value: string) => {
        // Remove non-binary characters
        const cleanBinary = value.replace(/[^01]/g, '');
        const num = parseInt(cleanBinary, 2) || 0;
        setBinary(cleanBinary || '0');
        setDecimal(num.toString());
        setHexadecimal(num.toString(16).toUpperCase());
        setOctal(num.toString(8));
    };

    const updateFromHexadecimal = (value: string) => {
        // Remove non-hex characters
        const cleanHex = value.replace(/[^0-9A-Fa-f]/g, '');
        const num = parseInt(cleanHex, 16) || 0;
        setHexadecimal(cleanHex.toUpperCase() || '0');
        setDecimal(num.toString());
        setBinary(num.toString(2));
        setOctal(num.toString(8));
    };

    const updateFromOctal = (value: string) => {
        // Remove non-octal characters
        const cleanOctal = value.replace(/[^0-7]/g, '');
        const num = parseInt(cleanOctal, 8) || 0;
        setOctal(cleanOctal || '0');
        setDecimal(num.toString());
        setBinary(num.toString(2));
        setHexadecimal(num.toString(16).toUpperCase());
    };

    const bitwiseOperation = (operation: string) => {
        const num = parseInt(decimal) || 0;
        let result = 0;

        switch (operation) {
            case 'NOT':
                result = ~num;
                break;
            case 'AND':
                result = num & (parseInt(prompt('Enter second number:') || '0'));
                break;
            case 'OR':
                result = num | (parseInt(prompt('Enter second number:') || '0'));
                break;
            case 'XOR':
                result = num ^ (parseInt(prompt('Enter second number:') || '0'));
                break;
            case 'LSHIFT':
                result = num << 1;
                break;
            case 'RSHIFT':
                result = num >> 1;
                break;
        }

        updateFromDecimal(result.toString());
    };

    return (
        <div className="programming-panel">
            <h3>Programming Calculator</h3>

            <div className="number-systems">
                <div className="number-system">
                    <label>Decimal:</label>
                    <input
                        type="text"
                        value={decimal}
                        onChange={(e) => updateFromDecimal(e.target.value)}
                        placeholder="Enter decimal number"
                    />
                </div>

                <div className="number-system">
                    <label>Binary:</label>
                    <input
                        type="text"
                        value={binary}
                        onChange={(e) => updateFromBinary(e.target.value)}
                        placeholder="Enter binary number"
                    />
                </div>

                <div className="number-system">
                    <label>Hexadecimal:</label>
                    <input
                        type="text"
                        value={hexadecimal}
                        onChange={(e) => updateFromHexadecimal(e.target.value)}
                        placeholder="Enter hexadecimal number"
                    />
                </div>

                <div className="number-system">
                    <label>Octal:</label>
                    <input
                        type="text"
                        value={octal}
                        onChange={(e) => updateFromOctal(e.target.value)}
                        placeholder="Enter octal number"
                    />
                </div>
            </div>

            <div className="bitwise-operations">
                <h4>Bitwise Operations</h4>
                <div className="operation-buttons">
                    <button onClick={() => bitwiseOperation('NOT')}>NOT (~)</button>
                    <button onClick={() => bitwiseOperation('AND')}>AND (&)</button>
                    <button onClick={() => bitwiseOperation('OR')}>OR (|)</button>
                    <button onClick={() => bitwiseOperation('XOR')}>XOR (^)</button>
                    <button onClick={() => bitwiseOperation('LSHIFT')}>{'<<'}</button>
                    <button onClick={() => bitwiseOperation('RSHIFT')}>{'>>'}</button>
                </div>
            </div>

            <div className="programming-info">
                <h4>Quick Reference</h4>
                <div className="info-grid">
                    <div className="info-item">
                        <strong>Binary:</strong> Base 2 (0-1)
                    </div>
                    <div className="info-item">
                        <strong>Octal:</strong> Base 8 (0-7)
                    </div>
                    <div className="info-item">
                        <strong>Decimal:</strong> Base 10 (0-9)
                    </div>
                    <div className="info-item">
                        <strong>Hexadecimal:</strong> Base 16 (0-9, A-F)
                    </div>
                </div>
            </div>
        </div>
    );
};
