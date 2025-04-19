function SolvedGroup({ pattern, words, color }) {
    try {
        return (
            <div className={`group-item ${color}`} data-name="solved-group">
                <div className="group-pattern" data-name="group-pattern">{pattern}</div>
                <div className="group-words" data-name="group-words">
                    {words.map((word, index) => (
                        <span key={index} className="group-word" data-name="group-word">
                            {word}{index < words.length - 1 ? ',' : ''}
                        </span>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error('SolvedGroup component error:', error);
        if (window.reportError) {
            window.reportError(error);
        }
        return null;
    }
}

// Make component available globally
window.SolvedGroup = SolvedGroup;
