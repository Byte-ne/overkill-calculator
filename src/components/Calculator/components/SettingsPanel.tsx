import React, { useState } from 'react';
import './SettingsPanel.css';

export const SettingsPanel: React.FC = () => {
    const [precision, setPrecision] = useState<number>(6);
    const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [autoSave, setAutoSave] = useState<boolean>(true);

    const resetSettings = () => {
        setPrecision(6);
        setAngleUnit('deg');
        setTheme('light');
        setAutoSave(true);
    };

    return (
        <div className="settings-panel">
            <h3>Settings</h3>

            <div className="setting-group">
                <label>Precision (decimal places):</label>
                <input
                    type="range"
                    min="1"
                    max="12"
                    value={precision}
                    onChange={(e) => setPrecision(Number(e.target.value))}
                />
                <span className="setting-value">{precision}</span>
            </div>

            <div className="setting-group">
                <label>Angle Unit:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="deg"
                            checked={angleUnit === 'deg'}
                            onChange={(e) => setAngleUnit(e.target.value as 'deg' | 'rad')}
                        />
                        Degrees
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="rad"
                            checked={angleUnit === 'rad'}
                            onChange={(e) => setAngleUnit(e.target.value as 'deg' | 'rad')}
                        />
                        Radians
                    </label>
                </div>
            </div>

            <div className="setting-group">
                <label>Theme:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="light"
                            checked={theme === 'light'}
                            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                        />
                        Light
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="dark"
                            checked={theme === 'dark'}
                            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                        />
                        Dark
                    </label>
                </div>
            </div>

            <div className="setting-group">
                <label>
                    <input
                        type="checkbox"
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                    />
                    Auto-save calculations
                </label>
            </div>

            <div className="setting-actions">
                <button className="reset-button" onClick={resetSettings}>
                    Reset to Defaults
                </button>
            </div>
        </div>
    );
};
