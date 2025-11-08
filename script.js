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
const fullscreenContainer = document.getElementById('fullscreen-container');
const gameIframe = document.getElementById('game-iframe');
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.getElementById('progress-bar');
const byteCounter = document.getElementById('byte-counter');

let loadingInterval;

function launchGame(gameUrl) {
    loadingScreen.style.display = 'flex'; 
    progressBar.style.width = '0%';
    byteCounter.textContent = '0/1000 bytes';

    gameIframe.src = gameUrl;
    fullscreenContainer.style.display = 'block';

    // Start a simulated loading animation
    let progress = 0;
    const totalBytes = 1000;
    loadingInterval = setInterval(() => {
        if (progress < 95) { // Stop just short of 100% to wait for real onload
            progress += Math.floor(Math.random() * 5) + 1; // Simulate loading
            if (progress > 95) progress = 95;
            
            const loadedBytes = Math.round(totalBytes * (progress / 100));
            progressBar.style.width = `${progress}%`;
            byteCounter.textContent = `${loadedBytes}/${totalBytes} bytes`;
        }
    }, 100);

    // Request fullscreen mode
    if (fullscreenContainer.requestFullscreen) {
        fullscreenContainer.requestFullscreen();
    } else if (fullscreenContainer.mozRequestFullScreen) {
        fullscreenContainer.mozRequestFullScreen();
    } else if (fullscreenContainer.webkitRequestFullscreen) {
        fullscreenContainer.webkitRequestFullscreen();
    } else if (fullscreenContainer.msRequestFullscreen) {
        fullscreenContainer.msRequestFullscreen();
    }
}

function hideLoader() {
    clearInterval(loadingInterval); // Stop the simulation
    progressBar.style.width = '100%';
    byteCounter.textContent = '1000/1000 bytes';
    
    // Give a small delay to show the "full" bar before hiding
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500); 
}

function closeGame() {
    // ... existing closeGame logic ...
    clearInterval(loadingInterval);
    loadingScreen.style.display = 'none';
    gameIframe.src = ''; 
}

// ... existing fullscreenchange event listeners ...
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        closeGame();
    }
});
