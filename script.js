document.addEventListener('DOMContentLoaded', () => {
    // --- Search Functionality ---
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('keyup', searchGames);
    }

    function searchGames(e) {
        const searchTerm = e.target.value.toLowerCase();
        const gameCards = document.querySelectorAll('.game-card');

        gameCards.forEach(card => {
            const gameName = card.querySelector('h3').textContent.toLowerCase();
            if (gameName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // --- Fullscreen Modal Functionality ---
    const gameOverlay = document.querySelector('.game-overlay');
    const gameFrame = document.querySelector('.game-frame');
    const closeBtn = document.querySelector('.close-btn');
    const gameGrid = document.querySelector('.game-grid');

    if (gameGrid) {
        gameGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.game-card');
            if (card) {
                const gameUrl = card.getAttribute('data-game-url');
                openFullscreenGame(gameUrl);
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeFullscreenGame);
    }

    function openFullscreenGame(url) {
        gameFrame.src = url;
        gameOverlay.style.display = 'flex';
        // Optional: request actual browser fullscreen mode on the overlay container
        if (gameOverlay.requestFullscreen) {
            gameOverlay.requestFullscreen();
        } else if (gameOverlay.webkitRequestFullscreen) { /* Safari */
            gameOverlay.webkitRequestFullscreen();
        } else if (gameOverlay.msRequestFullscreen) { /* IE11 */
            gameOverlay.msRequestFullscreen();
        }
        
        // Add a class to the body to prevent scrolling if needed
        document.body.style.overflow = 'hidden';
    }

    function closeFullscreenGame() {
        gameOverlay.style.display = 'none';
        gameFrame.src = ''; // Stop the game/iframe content

        // Exit actual browser fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }

        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // Listen for the escape key to exit modal/fullscreen naturally
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameOverlay.style.display === 'flex') {
            closeFullscreenGame();
        }
    });
});
