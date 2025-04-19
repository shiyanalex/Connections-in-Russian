function WordTile({ word, isSelected, status, onClick }) {
    try {
        const classes = [
            'word-tile',
            isSelected ? 'selected' : '',
            status || ''
        ].filter(Boolean).join(' ');

        return (
            <div 
                className={classes}
                onClick={onClick}
                data-name="word-tile"
            >
                {word}
            </div>
        );
    } catch (error) {
        console.error('WordTile component error:', error);
        if (window.reportError) {
            window.reportError(error);
        }
        return null;
    }
}

function checkSelection(selectedWords, groupWords) {
    if (selectedWords.length !== 4) return false;
    return selectedWords.every(word => groupWords.includes(word));
}

// Make component available globally
window.WordTile = WordTile;
