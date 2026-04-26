import React from 'react';
import './ConstantsPanel.css';

interface Constant {
    name: string;
    symbol: string;
    value: number;
    description: string;
    category: string;
}

const constants: Constant[] = [
    { name: 'Pi', symbol: 'π', value: Math.PI, description: 'Ratio of circumference to diameter', category: 'Mathematical' },
    { name: 'Euler\'s Number', symbol: 'e', value: Math.E, description: 'Base of natural logarithm', category: 'Mathematical' },
    { name: 'Golden Ratio', symbol: 'φ', value: (1 + Math.sqrt(5)) / 2, description: 'Golden ratio in mathematics', category: 'Mathematical' },
    { name: 'Speed of Light', symbol: 'c', value: 299792458, description: 'Speed of light in vacuum (m/s)', category: 'Physical' },
    { name: 'Gravitational Constant', symbol: 'G', value: 6.67430e-11, description: 'Gravitational constant (m³/kg·s²)', category: 'Physical' },
    { name: 'Planck Constant', symbol: 'h', value: 6.62607015e-34, description: 'Planck constant (J·s)', category: 'Physical' },
    { name: 'Avogadro Number', symbol: 'N_A', value: 6.02214076e23, description: 'Avogadro constant (mol⁻¹)', category: 'Chemical' },
    { name: 'Gas Constant', symbol: 'R', value: 8.314462618, description: 'Gas constant (J/mol·K)', category: 'Chemical' },
    { name: 'Electron Mass', symbol: 'm_e', value: 9.1093837015e-31, description: 'Electron rest mass (kg)', category: 'Atomic' },
    { name: 'Proton Mass', symbol: 'm_p', value: 1.67262192369e-27, description: 'Proton rest mass (kg)', category: 'Atomic' },
    { name: 'Elementary Charge', symbol: 'e', value: 1.602176634e-19, description: 'Elementary charge (C)', category: 'Atomic' },
];

export const ConstantsPanel: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

    const categories = ['All', ...Array.from(new Set(constants.map(c => c.category)))];

    const filteredConstants = selectedCategory === 'All'
        ? constants
        : constants.filter(c => c.category === selectedCategory);

    const copyToClipboard = (value: number) => {
        navigator.clipboard.writeText(value.toString());
    };

    return (
        <div className="constants-panel">
            <h3>Constants</h3>
            <div className="category-filter">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="constants-list">
                {filteredConstants.map((constant, index) => (
                    <div key={index} className="constant-item">
                        <div className="constant-header">
                            <span className="constant-symbol">{constant.symbol}</span>
                            <span className="constant-name">{constant.name}</span>
                            <button
                                className="copy-button"
                                onClick={() => copyToClipboard(constant.value)}
                                title="Copy value"
                            >
                                <span className="material-symbols-outlined" aria-hidden="true">content_copy</span>
                            </button>
                        </div>
                        <div className="constant-value">{constant.value.toExponential(6)}</div>
                        <div className="constant-description">{constant.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
