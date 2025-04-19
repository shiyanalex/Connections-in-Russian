function HelpButton({ onClick }) {
    return (
        <button 
            className="help-button" 
            onClick={onClick}
            data-name="help-button"
        >
            <svg 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 32 32" 
                className="game-icon" 
                data-testid="icon-help"
            >
                <path 
                    fill="var(--color-tone-1)" 
                    d="M15 24H17.6667V21.3333H15V24ZM16.3333 2.66666C8.97333 2.66666 3 8.63999 3 16C3 23.36 8.97333 29.3333 16.3333 29.3333C23.6933 29.3333 29.6667 23.36 29.6667 16C29.6667 8.63999 23.6933 2.66666 16.3333 2.66666ZM16.3333 26.6667C10.4533 26.6667 5.66667 21.88 5.66667 16C5.66667 10.12 10.4533 5.33332 16.3333 5.33332C22.2133 5.33332 27 10.12 27 16C27 21.88 22.2133 26.6667 16.3333 26.6667ZM16.3333 7.99999C13.3867 7.99999 11 10.3867 11 13.3333H13.6667C13.6667 11.8667 14.8667 10.6667 16.3333 10.6667C17.8 10.6667 19 11.8667 19 13.3333C19 16 15 15.6667 15 20H17.6667C17.6667 17 21.6667 16.6667 21.6667 13.3333C21.6667 10.3867 19.28 7.99999 16.3333 7.99999Z"
                />
            </svg>
        </button>
    );
} 

function Instructions({ onStart }) {
    try {
        return (
            <div className="modal-overlay instructions-overlay" data-name="instructions-modal">
                <div className="modal-content">
                    <h2>Как играть</h2>
                    <ul className="instructions-list">
                        <li>Составьте группы из четырёх слов, объединённых общей идеей</li>
                        <li>У вас есть 4 жизни чтобы отгадать все</li>   
                        <li>Каждая ошибка — минус жизнь</li>
                    </ul>
                    <button 
                        className="start-button"
                        onClick={onStart}
                        data-name="start-button"
                    >
                        Играть
                    </button>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Instructions error:', error);
        if (window.reportError) {
            window.reportError(error);
        }
        return null;
    }
}

// Make component available globally
window.HelpButton = HelpButton; 
window.Instructions = Instructions;

// Add this CSS to style.css or append to existing stylesheet
const instructionsStyles = document.createElement('style');
instructionsStyles.textContent = `
    .instructions-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        z-index: 1001;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(instructionsStyles);
