const fullscreenContainer = document.getElementById('fullscreen-container');
const gameIframe = document.getElementById('game-iframe');

function launchGame(gameUrl) {
    gameIframe.src = gameUrl;
    fullscreenContainer.style.display = 'block';

    // Request fullscreen mode for the container
    if (fullscreenContainer.requestFullscreen) {
        fullscreenContainer.requestFullscreen();
    } else if (fullscreenContainer.mozRequestFullScreen) { /* Firefox */
        fullscreenContainer.mozRequestFullScreen();
    } else if (fullscreenContainer.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        fullscreenContainer.webkitRequestFullscreen();
    } else if (fullscreenContainer.msRequestFullscreen) { /* IE/Edge */
        fullscreenContainer.msRequestFullscreen();
    }
}

function closeGame() {
    // Exit fullscreen mode
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
    
    fullscreenContainer.style.display = 'none';
    gameIframe.src = ''; // Stop the game when closing
}

// Add an event listener to detect when fullscreen is exited by the user (e.g., pressing Esc)
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenContainer.style.display = 'none';
        gameIframe.src = '';
    }
});
document.addEventListener('webkitfullscreenchange', () => {
    if (!document.webkitFullscreenElement) {
        fullscreenContainer.style.display = 'none';
        gameIframe.src = '';
    }
});
document.addEventListener('mozfullscreenchange', () => {
    if (!document.mozFullScreenElement) {
        fullscreenContainer.style.display = 'none';
        gameIframe.src = '';
    }
});
document.addEventListener('msfullscreenchange', () => {
    if (!document.msFullscreenElement) {
        fullscreenContainer.style.display = 'none';
        gameIframe.src = '';
    }
});
