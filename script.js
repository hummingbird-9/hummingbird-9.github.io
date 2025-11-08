// Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const homeScreen = document.getElementById('homeScreen');
    const galleryScreen = document.getElementById('galleryScreen');
    const startButton = document.getElementById('startButton');
    const searchBar = document.getElementById('searchBar');
    const gameGrid = document.getElementById('gameGrid');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Hide loading screen after completion
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                homeScreen.style.display = 'flex';
            }, 500);
        }
        document.querySelector('.loading-bar').style.width = progress + '%';
    }, 200);

    // Start button click handler
    startButton.addEventListener('click', function() {
        homeScreen.classList.add('hidden');
        galleryScreen.classList.remove('hidden');
        loadGames();
    });

    // Search functionality
    searchBar.addEventListener('input', filterGames);

    // Game data - in a real app this would come from a JSON file
    const games = [
        { name: "Space Shooter", file: "games/game1/index.html", image: "images/thumbnail1.png" },
        { name: "Puzzle Quest", file: "games/game2/index.html", image: "images/thumbnail2.png" },
        { name: "Racing Challenge", file: "games/game3/index.html", image: "images/thumbnail3.png" },
        { name: "Math Master", file: "games/game4/index.html", image: "images/thumbnail4.png" },
        { name: "Word Search", file: "games/game5/index.html", image: "images/thumbnail5.png" },
        { name: "Memory Match", file: "games/game6/index.html", image: "images/thumbnail6.png" }
    ];

    function loadGames() {
        gameGrid.innerHTML = '';
        games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.innerHTML = `
                <img src="${game.image}" alt="${game.name}">
                <div class="game-name">${game.name}</div>
            `;
            gameCard.addEventListener('click', () => openGame(game.file));
            gameGrid.appendChild(gameCard);
        });
    }

    function filterGames() {
        const searchTerm = searchBar.value.toLowerCase();
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            const gameName = card.querySelector('.game-name').textContent.toLowerCase();
            if (gameName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function openGame(gameFile) {
        // Create a new window for the game
        const gameWindow = window.open('', '_blank');
        gameWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${gameFile.split('/').pop().split('.')[0]}</title>
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                    }
                    iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                    }
                </style>
            </head>
            <body>
                <iframe src="${gameFile}" frameborder="0"></iframe>
            </body>
            </html>
        `);
        gameWindow.document.close();
    }
});
