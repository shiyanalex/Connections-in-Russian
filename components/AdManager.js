// AdManager.js - Manages ad displays and interactions in the game

// Initialize Yandex SDK when the script loads
(function initYandexSDK() {
    if (window.YaGames) {
        YaGames
            .init()
            .then(ysdk => {
                console.log('Yandex SDK initialized');
                window.ysdk = ysdk;
            })
            .catch(err => {
                console.error('Error initializing Yandex SDK:', err);
            });
    }
})();

// Create a global function to show rewarded video
window.showRewardedVideo = function(type) {
    console.log('Showing rewarded video for: ' + type);
    
    // Flag to track if reward was granted
    let rewardGranted = false;

    if (window.ysdk) {
        window.ysdk.adv.showRewardedVideo({
            callbacks: {
                onRewarded: () => {
                    console.log('Video watched completely, granting reward');
                    rewardGranted = true;
                    if (type === "extraLife") {
                        window.extraLifeGranted && window.extraLifeGranted();
                    } else if (type === "newGame") {
                        window.startNewGame && window.startNewGame();
                    }
                },
                onClose: () => {
                    console.log('Video ad closed, rewardGranted:', rewardGranted);
                    
                    // Only show error popup if the video was closed without being rewarded
                    if (!rewardGranted && window.createPopup) {
                        window.createPopup(
                            "Видео не было просмотрено",
                            "Вы должны посмотреть видео полностью, чтобы получить награду.",
                            "Попробовать снова",
                            () => {
                                // Try again
                                window.showRewardedVideo(type);
                            },
                            () => {
                                console.log('User declined to retry video');
                                // If extra life was requested and user declined retry, end the game
                                if (type === "extraLife") {
                                    if (window.setLives) {
                                        window.setLives(0);
                                    }
                                    if (window.endGame) {
                                        window.endGame();
                                    }
                                }
                            }
                        );
                    }
                },
                onError: (e) => {
                    console.error('Error showing video ad:', e);
                    // If there was an error and extra life was requested, end the game
                    if (type === "extraLife") {
                        if (window.setLives) {
                            window.setLives(0);
                        }
                        if (window.endGame) {
                            window.endGame();
                        }
                    }
                }
            }
        });
    } else {
        console.warn("Yandex SDK not initialized, granting reward anyway");
        rewardGranted = true;
        if (type === "extraLife") {
            window.extraLifeGranted && window.extraLifeGranted();
        } else if (type === "newGame") {
            window.startNewGame && window.startNewGame();
        }
    }
};

// Utility function to create an ad modal if needed later
window.createAdModal = function(type, onConfirm, onCancel) {
    // Ensure the CSS is loaded
    if (!document.getElementById('ad-manager-styles')) {
        const link = document.createElement('link');
        link.id = 'ad-manager-styles';
        link.rel = 'stylesheet';
        link.href = 'css/AdManager.css';
        document.head.appendChild(link);
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'ad-modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'ad-modal';
    
    let title, message, confirmText;
    
    if (type === 'extraLife') {
        title = 'Игра окончена!';
        message = 'Хотите получить дополнительную жизнь, чтобы продолжить?';
        confirmText = 'Получить дополнительную жизнь';
    } else if (type === 'newGame') {
        title = 'Сыграть еще раз?';
        message = 'Посмотрите короткое видео, чтобы начать новую игру!';
        confirmText = 'Смотреть видео и играть снова';
    } else if (type === 'error') {
        title = 'Видео не было просмотрено';
        message = 'Произошла ошибка при воспроизведении видео или оно не было просмотрено до конца.';
        confirmText = 'Попробовать еще раз';
    }
    
    modal.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        <button class="ad-modal-primary-btn">${confirmText}</button>
        <button class="ad-modal-secondary-btn">Отмена</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    const confirmBtn = modal.querySelector('.ad-modal-primary-btn');
    const cancelBtn = modal.querySelector('.ad-modal-secondary-btn');
    
    confirmBtn.addEventListener('click', () => {
        if (onConfirm) onConfirm();
        overlay.remove();
    });
    
    cancelBtn.addEventListener('click', () => {
        if (onCancel) onCancel();
        overlay.remove();
    });
    
    return overlay;
};
