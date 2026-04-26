import React, { useMemo, useState } from 'react';
import { evaluate, parse } from 'mathjs';
import './GraphingPanel.css';

export const GraphingPanel: React.FC = () => {
    const [expression, setExpression] = useState<string>('x^2');
    const [xMin, setXMin] = useState<number>(-10);
    const [xMax, setXMax] = useState<number>(10);
    const [yMin, setYMin] = useState<number>(-10);
    const [yMax, setYMax] = useState<number>(10);

    const evaluateExpression = (expr: string, x: number): number | null => {
        try {
            const result = evaluate(expr, { x });
            return typeof result === 'number' && Number.isFinite(result) ? result : null;
        } catch {
            return null;
        }
    };

    const generatePoints = (): Array<{x: number, y: number}> => {
        const points: Array<{x: number, y: number}> = [];
        const steps = 200;

        for (let i = 0; i <= steps; i++) {
            const x = xMin + (xMax - xMin) * (i / steps);
            const y = evaluateExpression(expression, x);

            if (y !== null) {
                points.push({ x, y });
            }
        }

        return points;
    };

    const points = useMemo(() => generatePoints(), [expression, xMin, xMax, yMin, yMax]);
    const expressionPreview = useMemo(() => {
        try {
            const tex = parse(expression).toTex({ parenthesis: 'keep' });
            return window.katex?.renderToString(tex, { throwOnError: false, displayMode: false }) ?? '';
        } catch {
            return '';
        }
    }, [expression]);

    // Convert points to SVG path
    const createPath = (): string => {
        if (points.length === 0) return '';

        const width = 400;
        const height = 300;
        const padding = 40;

        const xScale = (width - 2 * padding) / (xMax - xMin);
        const yScale = (height - 2 * padding) / (yMax - yMin);

        let path = '';

        points.forEach((point, index) => {
            const svgX = padding + (point.x - xMin) * xScale;
            const svgY = height - padding - (point.y - yMin) * yScale;

            if (index === 0) {
                path += `M ${svgX} ${svgY}`;
            } else {
                path += ` L ${svgX} ${svgY}`;
            }
        });

        return path;
    };

    const resetView = () => {
        setXMin(-10);
        setXMax(10);
        setYMin(-10);
        setYMax(10);
    };

    return (
        <div className="graphing-panel">
            <h3>Function Grapher</h3>

            <div className="graph-controls">
                <div className="expression-input">
                    <label>f(x) = </label>
                    <input
                        type="text"
                        value={expression}
                        onChange={(e) => setExpression(e.target.value)}
                        placeholder="Enter function (e.g., x^2, sin(x), x+1)"
                    />
                </div>
                {expressionPreview ? (
                    <div className="expression-preview" dangerouslySetInnerHTML={{ __html: expressionPreview }} />
                ) : null}

                <div className="range-controls">
                    <div className="range-input">
                        <label>X min:</label>
                        <input
                            type="number"
                            value={xMin}
                            onChange={(e) => setXMin(Number(e.target.value))}
                        />
                    </div>
                    <div className="range-input">
                        <label>X max:</label>
                        <input
                            type="number"
                            value={xMax}
                            onChange={(e) => setXMax(Number(e.target.value))}
                        />
                    </div>
                    <div className="range-input">
                        <label>Y min:</label>
                        <input
                            type="number"
                            value={yMin}
                            onChange={(e) => setYMin(Number(e.target.value))}
                        />
                    </div>
                    <div className="range-input">
                        <label>Y max:</label>
                        <input
                            type="number"
                            value={yMax}
                            onChange={(e) => setYMax(Number(e.target.value))}
                        />
                    </div>
                    <button onClick={resetView}>Reset View</button>
                </div>
            </div>

            <div className="graph-container">
                <svg width="400" height="300" className="graph-svg">
                    {/* Grid lines */}
                    <defs>
                        <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Axes */}
                    <line
                        x1="40"
                        y1="150"
                        x2="360"
                        y2="150"
                        stroke="#666"
                        strokeWidth="2"
                    />
                    <line
                        x1="200"
                        y1="20"
                        x2="200"
                        y2="280"
                        stroke="#666"
                        strokeWidth="2"
                    />

                    {/* Function curve */}
                    <path
                        d={createPath()}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2"
                    />
                </svg>
            </div>

            <div className="graph-examples">
                <h4>Examples:</h4>
                <div className="examples-list">
                    <button onClick={() => setExpression('x^2')}>x²</button>
                    <button onClick={() => setExpression('sin(x)')}>sin(x)</button>
                    <button onClick={() => setExpression('cos(x)')}>cos(x)</button>
                    <button onClick={() => setExpression('x^3')}>x³</button>
                    <button onClick={() => setExpression('sqrt(x)')}>√x</button>
                    <button onClick={() => setExpression('1/x')}>1/x</button>
                </div>
            </div>
        </div>
    );
};
