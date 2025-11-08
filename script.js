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
    } else if (fullscreenContainer.mozRequestFullScreen) { /* Firefox */
        fullscreenContainer.mozRequestFullScreen();
    } else if (fullscreenContainer.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        fullscreenContainer.webkitRequestFullscreen();
    } else if (fullscreenContainer.msRequestFullscreen) { /* IE/Edge */
        fullscreenContainer.msRequestFullscreen();
    }
}

// Function called by the iframe's onload attribute
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
    
    clearInterval(loadingInterval); // Ensure interval stops if closed manually
    fullscreenContainer.style.display = 'none';
    gameIframe.src = ''; // Stop the game when closing
    loadingScreen.style.display = 'none'; // Ensure loader is hidden
}

// Add event listeners to detect when fullscreen is exited by the user (e.g., pressing Esc)
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        closeGame(); 
    }
});
document.addEventListener('webkitfullscreenchange', () => { if (!document.webkitFullscreenElement) closeGame(); });
document.addEventListener('mozfullscreenchange', () => { if (!document.mozFullScreenElement) closeGame(); });
document.addEventListener('msfullscreenchange', () => { if (!document.msFullscreenElement) closeGame(); });
