import React, { useState } from 'react';
import './UnitConverter.css';

interface Unit {
    name: string;
    symbol: string;
    toBase: number; // conversion factor to base unit
}

interface UnitCategory {
    name: string;
    units: Unit[];
    baseUnit: string;
}

const unitCategories: UnitCategory[] = [
    {
        name: 'Length',
        baseUnit: 'meter',
        units: [
            { name: 'Kilometer', symbol: 'km', toBase: 1000 },
            { name: 'Meter', symbol: 'm', toBase: 1 },
            { name: 'Centimeter', symbol: 'cm', toBase: 0.01 },
            { name: 'Millimeter', symbol: 'mm', toBase: 0.001 },
            { name: 'Mile', symbol: 'mi', toBase: 1609.344 },
            { name: 'Yard', symbol: 'yd', toBase: 0.9144 },
            { name: 'Foot', symbol: 'ft', toBase: 0.3048 },
            { name: 'Inch', symbol: 'in', toBase: 0.0254 }
        ]
    },
    {
        name: 'Weight',
        baseUnit: 'kilogram',
        units: [
            { name: 'Ton', symbol: 't', toBase: 1000 },
            { name: 'Kilogram', symbol: 'kg', toBase: 1 },
            { name: 'Gram', symbol: 'g', toBase: 0.001 },
            { name: 'Milligram', symbol: 'mg', toBase: 0.000001 },
            { name: 'Pound', symbol: 'lb', toBase: 0.453592 },
            { name: 'Ounce', symbol: 'oz', toBase: 0.0283495 }
        ]
    },
    {
        name: 'Temperature',
        baseUnit: 'celsius',
        units: [
            { name: 'Celsius', symbol: '°C', toBase: 1 },
            { name: 'Fahrenheit', symbol: '°F', toBase: 1 },
            { name: 'Kelvin', symbol: 'K', toBase: 1 }
        ]
    }
];

export const UnitConverter: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Length');
    const [fromValue, setFromValue] = useState<string>('1');
    const [fromUnit, setFromUnit] = useState<string>('m');
    const [toUnit, setToUnit] = useState<string>('cm');

    const category = unitCategories.find(cat => cat.name === selectedCategory);
    const fromUnitObj = category?.units.find(u => u.symbol === fromUnit);
    const toUnitObj = category?.units.find(u => u.symbol === toUnit);

    const convert = (value: number, from: Unit, to: Unit): number => {
        if (selectedCategory === 'Temperature') {
            // Special handling for temperature
            if (from.symbol === '°C' && to.symbol === '°F') {
                return (value * 9/5) + 32;
            } else if (from.symbol === '°F' && to.symbol === '°C') {
                return (value - 32) * 5/9;
            } else if (from.symbol === '°C' && to.symbol === 'K') {
                return value + 273.15;
            } else if (from.symbol === 'K' && to.symbol === '°C') {
                return value - 273.15;
            } else if (from.symbol === '°F' && to.symbol === 'K') {
                return (value - 32) * 5/9 + 273.15;
            } else if (from.symbol === 'K' && to.symbol === '°F') {
                return (value - 273.15) * 9/5 + 32;
            }
            return value;
        }

        // Convert to base unit, then to target unit
        const baseValue = value * from.toBase;
        return baseValue / to.toBase;
    };

    const getConvertedValue = (): string => {
        const value = parseFloat(fromValue);
        if (isNaN(value) || !fromUnitObj || !toUnitObj) return '0';

        const result = convert(value, fromUnitObj, toUnitObj);
        return result.toFixed(6).replace(/\.?0+$/, '');
    };

    const swapUnits = () => {
        const temp = fromUnit;
        setFromUnit(toUnit);
        setToUnit(temp);
    };

    return (
        <div className="unit-converter">
            <h3>Unit Converter</h3>
            <div className="category-selector">
                {unitCategories.map(cat => (
                    <button
                        key={cat.name}
                        className={`category-button ${selectedCategory === cat.name ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedCategory(cat.name);
                            setFromUnit(cat.units[1].symbol);
                            setToUnit(cat.units[2].symbol);
                        }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="converter-inputs">
                <div className="input-group">
                    <input
                        type="number"
                        value={fromValue}
                        onChange={(e) => setFromValue(e.target.value)}
                        placeholder="Enter value"
                    />
                    <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                    >
                        {category?.units.map(unit => (
                            <option key={unit.symbol} value={unit.symbol}>
                                {unit.name} ({unit.symbol})
                            </option>
                        ))}
                    </select>
                </div>

                <button className="swap-button" onClick={swapUnits}>
                    <span className="material-symbols-outlined" aria-hidden="true">swap_vert</span>
                </button>

                <div className="input-group">
                    <input
                        type="text"
                        value={getConvertedValue()}
                        readOnly
                        placeholder="Result"
                    />
                    <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                    >
                        {category?.units.map(unit => (
                            <option key={unit.symbol} value={unit.symbol}>
                                {unit.name} ({unit.symbol})
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
