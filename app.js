const useAPI = false;

function App() {
    try {
        // Game state
        const [showInstructions, setShowInstructions] = React.useState(true);
        const [showLoadingScreen, setShowLoadingScreen] = React.useState(true);
        const [wordGroups, setWordGroups] = React.useState([]);
        const [words, setWords] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [selectedWords, setSelectedWords] = React.useState([]);
        const [solvedGroups, setSolvedGroups] = React.useState([]);
        const [lives, setLives] = React.useState(4);
        const [message, setMessage] = React.useState({ text: '', type: '' });
        const [isGameOver, setIsGameOver] = React.useState(false);
        const [isPopupOpen, setIsPopupOpen] = React.useState(false);
        const [extraLifeUsed, setExtraLifeUsed] = React.useState(false);
        
        // Register callback functions for video rewards
        React.useEffect(() => {
            // Callback for when extra life is granted
            window.extraLifeGranted = () => {
                console.log('Extra life granted');
                setExtraLifeUsed(true);
                setMessage({ text: 'Вы получили дополнительную жизнь!', type: 'success' });
            };
            
            // Callback for when new game is started
            window.startNewGame = () => {
                console.log('Starting new game');
                resetGame();
            };
            
            // Expose setLives and endGame to window for external access
            window.setLives = (value) => {
                console.log('Setting lives to:', value);
                setLives(value);
                if (value <= 0) {
                    endGame();
                }
            };
            
            window.endGame = endGame;
            
            return () => {
                // Clean up global callbacks
                window.extraLifeGranted = null;
                window.startNewGame = null;
                window.setLives = null;
                window.endGame = null;
            };
        }, []);
        
        // Reset game state and load new words
        const resetGame = () => {
            setSelectedWords([]);
            setSolvedGroups([]);
            setLives(4);
            setMessage({ text: '', type: '' });
            setIsGameOver(false);
            setExtraLifeUsed(false);
            
            // Load new word groups
            loadGameData();
        };
        
        // Load data when component mounts
        React.useEffect(() => {
            loadGameData();
        }, []);
        
        // Function to load word groups
        const loadGameData = async () => {
            setLoading(true);
            
            try {
                const groups = await getWordGroups(useAPI);
                setWordGroups(groups);
                
                const allWords = groups.flatMap(group => group.words);
                setWords(shuffleArray(allWords));
                
                setTimeout(() => {
                    setShowLoadingScreen(false);
                }, 500);
                
            } catch (error) {
                console.error('Load error:', error);

                const groups = await getWordGroups(false);
                setWordGroups(groups);
                
                const allWords = groups.flatMap(group => group.words);
                setWords(shuffleArray(allWords));
                
                setTimeout(() => {
                    setShowLoadingScreen(false);
                }, 500);

            } finally {
                setLoading(false);
            }
        };
        
        // Word tile click handler
        const handleWordClick = (word) => {
            if (lives === 0 || isGameOver) return;
            
            setSelectedWords(prev => {
                if (prev.includes(word)) {
                    return prev.filter(w => w !== word);
                }
                if (prev.length < 4) {
                    return [...prev, word];
                }
                return prev;
            });
        };
        
        // Shuffle the words in the grid
        const handleShuffle = () => {
            setWords(prev => shuffleArray([...prev]));
            setSelectedWords([]);
        };
        
        // Deselect all selected words
        const handleDeselectAll = () => {
            setSelectedWords([]);
        };
        
        // Check if selected words form a valid group
        const checkSelectionMatch = () => {
            for (const group of wordGroups) {
                if (solvedGroups.includes(group)) continue;
                
                if (selectedWords.length === 4 && 
                    selectedWords.every(word => group.words.includes(word))) {
                    return group;
                }
            }
            return null;
        };
        
        // Handle submit button click
        const handleSubmit = () => {
            if (selectedWords.length !== 4) return;
            
            const correctGroup = checkSelectionMatch();
            if (correctGroup) {
                // Correct group found
                setSolvedGroups(prev => [...prev, correctGroup]);
                setWords(prev => prev.filter(word => !selectedWords.includes(word)));
                
                // Check if all groups are found
                if (solvedGroups.length === wordGroups.length - 1) {
                    createConfetti();
                    setMessage({ text: 'Восхитительно!', type: 'success' });
                    // Game completed - show victory screen instead of popup
                    setIsGameOver(true);
                }
            } else {
                // Incorrect selection
                if (lives === 1) {
                    // Last life, show extra life popup if not already used
                    if (!extraLifeUsed) {
                        showExtraLifePopup();
                    } else {
                        setLives(prev => prev - 1);
                        endGame();
                    }
                } else {
                    setLives(prev => prev - 1);
                    if (lives === 1) {
                        endGame();
                    }
                }
            }
            
            setSelectedWords([]);
        };
        
        // Show popup for extra life
        const showExtraLifePopup = () => {
            setIsPopupOpen(true);
            createPopup(
                "У тебя закончились жизни... 💖",
                "Видео откроет для тебя ещё одну жизнь",
                "▶ Получить жизнь",
                () => {
                    console.log('Clicked to get extra life');
                    showRewardedVideo("extraLife");
                    setIsPopupOpen(false);
                },
                () => {
                    console.log('Popup closed, ending game');
                    endGame();
                    setIsPopupOpen(false);
                }
            );
        };
        
        // End the game
        const endGame = () => {
            setMessage({ text: 'Игра окончена!', type: 'error' });
            setIsGameOver(true);
            setLives(0);
        };
        
        // Start a new game
        const startNewGame = () => {
            console.log('Thinking about starting new game');
            
            // Show the "Play Again" popup using the existing popup system
            setIsPopupOpen(true);
            createPopup(
                "Сыграть еще раз? 🎮",
                "Посмотрите короткое видео, чтобы начать новую игру!",
                "▶ Смотреть видео и играть снова",
                () => {
                    console.log('Clicked to watch video for new game');
                    showRewardedVideo("newGame");
                    setIsPopupOpen(false);
                },
                () => {
                    console.log('User declined to watch video for new game');
                    // Don't reset the game when canceled
                    setIsPopupOpen(false);
                }
            );
        };
        
        return (
            <div className="game-container">
                {/* Loading Screen */}
                {showLoadingScreen && (
                    <div className="loading-screen">
                        <h1 className="game-title">Connections</h1>
                        <p className="loading-text">Loading word groups...</p>
                    </div>
                )}
                
                {/* Main Game */}
                {!showLoadingScreen && (
                    <>
                        <header className="header">
                            <h1 className="game-title">СВЯЗИ</h1>
                            <p className="game-subtitle">
                                Составьте группы из четырёх слов, объединённых общей идеей
                            </p>
                            <LivesCounter lives={lives} />
                            <HelpButton onClick={() => setShowInstructions(true)} />
                            <DarkModeToggle />
                        </header>
                        
                        {/* Game Message */}
                        {message.text && (
                            <div className={`message ${message.type}`}>
                                {message.text}
                            </div>
                        )}
                        
                        {loading ? (
                            <div className="loading-container">
                                <p>Loading word groups...</p>
                            </div>
                        ) : (
                            <>
                                {/* Solved Groups */}
                                <div className="solved-groups">
                                    {solvedGroups.map((group, index) => (
                                        <SolvedGroup key={index} {...group} />
                                    ))}
                                </div>
                                
                                {/* Word Grid (active game) */}
                                {!isGameOver && lives > 0 && words.length > 0 && (
                                    <div style={{ pointerEvents: (isPopupOpen || showInstructions) ? 'none' : 'auto' }}>
                                        <div className="word-grid">
                                            {words.map((word, index) => (
                                                <WordTile
                                                    key={index}
                                                    word={word}
                                                    isSelected={selectedWords.includes(word)}
                                                    onClick={() => handleWordClick(word)}
                                                />
                                            ))}
                                        </div>
                                        <div className="button-group">
                                            <button
                                                className="game-button shuffle-button"
                                                onClick={handleShuffle}
                                                disabled={isPopupOpen || showInstructions}
                                            >
                                                Перемешать
                                            </button>
                                            <button
                                                className="game-button submit-button"
                                                onClick={handleSubmit}
                                                disabled={selectedWords.length !== 4 || isPopupOpen || showInstructions}
                                            >
                                                Отправить
                                            </button>
                                            <button
                                                className="game-button deselect-button"
                                                onClick={handleDeselectAll}
                                                disabled={selectedWords.length === 0 || isPopupOpen || showInstructions}
                                            >
                                                Отменить Выбор
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Game Over Screen */}
                                {isGameOver && (
                                    <>
                                        {lives === 0 ? (
                                            // Game lost - show remaining groups
                                            <div className="remaining-groups">
                                                <h3>Не найденные группы:</h3>
                                                {wordGroups
                                                    .filter(group => !solvedGroups.includes(group))
                                                    .map((group, index) => (
                                                        <SolvedGroup key={index} {...group} />
                                                    ))
                                                }
                                            </div>
                                        ) : (
                                            // Game won - show victory message
                                            <div className="victory-message">
                                                <h3>Поздравляем! Вы выиграли!</h3>
                                                <p>Вы успешно нашли все группы связанных слов.</p>
                                            </div>
                                        )}
                                        
                                        <button
                                            className="game-button play-again-button"
                                            onClick={startNewGame}
                                            style={{
                                                marginTop: '20px',
                                                padding: '10px 20px',
                                                fontSize: '16px',
                                                backgroundColor: '#4caf50',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'block',
                                                margin: '20px auto'
                                            }}
                                        >
                                            Еще раз?
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                        
                        {/* Instructions Overlay */}
                        {showInstructions && (
                            <Instructions onStart={() => setShowInstructions(false)} />
                        )}
                    </>
                )}
            </div>
        );
    } catch (error) {
        console.error('App component error:', error);
        if (window.reportError) {
            window.reportError(error);
        }
        return <div>An error occurred. Please try reloading the page.</div>;
    }
}

// Initialize React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
