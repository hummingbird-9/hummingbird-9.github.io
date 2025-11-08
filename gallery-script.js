document.addEventListener('DOMContentLoaded', function() {
    const games = [
        { id: 1, name: "Undertale", description: "Made as HTML by BreadB, original by Toby Fox" },
        { id: 2, name: "Deltarune", description: "Brought to the web by bog/aukak, original by Toby Fox" },
        { id: 3, name: "Hollow Knight", description: "HTML made by bok/aukak and lag fixes and fixed other issues by hummingbird_9, original by Team Cherry" },
        { id: 4, name: "Hollow Knight Debug", description: "Debug version of previous hollow knight, but this time with a console and FPS viewer" },
        { id: 5, name: "Eagletcraft 1.8.8", description: "Made by lax1dude and optomized by PlanetDoge, original by Mojang Studios" },
        { id: 6, name: "Eagletcraft 1.12.2", description: "Made by PeytonPlayz595 and optomized by PlanetDoge, original by Mojang Studios" }
    ];

    const gameGrid = document.getElementById('gameGrid');
    const searchInput = document.getElementById('searchInput');

    // Create game cards
    function renderGames(gamesArray) {
        gameGrid.innerHTML = '';
        gamesArray.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.innerHTML = `
                <img src="images/thumbnail${game.id}.png" alt="${game.name}">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
            `;
            
            gameCard.addEventListener('click', () => {
                loadGame(game.id);
            });
            
            gameGrid.appendChild(gameCard);
        });
    }

    // Filter games based on search
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredGames = games.filter(game => 
            game.name.toLowerCase().includes(searchTerm) || 
            game.description.toLowerCase().includes(searchTerm)
        );
        renderGames(filteredGames);
    });

    // Load game with loading screen
    function loadGame(gameId) {
        // Create loading screen
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <img src="images/loading-screen.png" alt="Loading...">
                <div class="loading-bar-container">
                    <div class="loading-bar"></div>
                </div>
                <p>Loading Game...</p>
            </div>
        `;
        
        document.body.appendChild(loadingScreen);
        
        // Simulate loading progress
        let progress = 0;
        const loadingBar = document.querySelector('.loading-bar');
        
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 10) + 1;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Remove loading screen and open game
                setTimeout(() => {
                    document.body.removeChild(loadingScreen);
                    alert(`Opening ${games.find(g => g.id === gameId).name}!`);
                    // In a real implementation, this would redirect to the game
                }, 500);
            }
            loadingBar.style.width = `${progress}%`;
        }, 200);
    }

    // Initial render
    renderGames(games);
});
