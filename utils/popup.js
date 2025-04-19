// Popup utility functions

/**
 * Creates a popup dialog
 * @param {string} title - The popup title
 * @param {string} message - The popup message
 * @param {string} primaryButtonText - Text for the primary action button
 * @param {Function} onPrimaryAction - Callback for primary button click
 * @param {Function} onClose - Callback for when popup is closed
 */
function createPopup(title, message, primaryButtonText, onPrimaryAction, onClose) {
    // Ensure the popup CSS is loaded
    if (!document.getElementById('popup-styles')) {
        const link = document.createElement('link');
        link.id = 'popup-styles';
        link.rel = 'stylesheet';
        link.href = 'css/popup.css';
        document.head.appendChild(link);
    }

    // Remove any existing popups first
    const existingPopup = document.getElementById("gamePopup");
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    
    // Create popup container
    const popup = document.createElement("div");
    popup.id = "gamePopup";
    popup.className = "popup";
    
    // Add title
    const titleElement = document.createElement("h2");
    titleElement.className = "popup-title";
    titleElement.textContent = title;
    popup.appendChild(titleElement);
    
    // Add message
    const messageElement = document.createElement("p");
    messageElement.className = "popup-message";
    messageElement.textContent = message;
    popup.appendChild(messageElement);
    
    // Add primary button
    const primaryButton = document.createElement("button");
    primaryButton.className = "popup-primary-button";
    primaryButton.textContent = primaryButtonText;
    primaryButton.onclick = () => {
        onPrimaryAction();
        overlay.remove();
    };
    popup.appendChild(primaryButton);
    
    // Add close button
    const closeButton = document.createElement("button");
    closeButton.className = "popup-close-button";
    closeButton.textContent = "Отмена";
    closeButton.onclick = () => {
        onClose();
        overlay.remove();
    };
    popup.appendChild(closeButton);
    
    // Add popup to overlay
    overlay.appendChild(popup);
    
    // Add to document
    document.body.appendChild(overlay);
    
    return popup;
}

// Make function available globally
window.createPopup = createPopup; 