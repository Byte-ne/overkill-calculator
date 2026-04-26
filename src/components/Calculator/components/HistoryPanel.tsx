import React from 'react';
import './HistoryPanel.css';

interface HistoryPanelProps {
    history: string[];
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history }) => {
    const clearHistory = () => {
        // This would need to be passed down from parent
        // For now, just show the history
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="history-panel">
            <div className="history-header">
                <h3>History</h3>
                <button
                    className="clear-history-button"
                    onClick={clearHistory}
                    disabled={history.length === 0}
                >
                    Clear
                </button>
            </div>
            <div className="history-list">
                {history.length === 0 ? (
                    <div className="no-history">No calculations yet</div>
                ) : (
                    history.slice(-10).reverse().map((entry, index) => (
                        <div key={index} className="history-item">
                            <span className="history-entry">{entry}</span>
                            <button
                                className="copy-history-button"
                                onClick={() => copyToClipboard(entry)}
                                title="Copy calculation"
                            >
                                <span className="material-symbols-outlined" aria-hidden="true">content_copy</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
