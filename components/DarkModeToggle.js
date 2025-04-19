function DarkModeToggle() {
    const [isDarkMode, setIsDarkMode] = React.useState(() => 
        localStorage.getItem('darkMode') === 'true'
    );

    React.useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    return (
        <button 
            className="dark-mode-toggle" 
            onClick={toggleDarkMode}
            data-name="dark-mode-toggle"
        >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
    );
}

// Make component available globally
window.DarkModeToggle = DarkModeToggle;
