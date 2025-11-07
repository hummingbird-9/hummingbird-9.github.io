// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Select all game links
    const gameLinks = document.querySelectorAll('.game-card');

    gameLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent normal link navigation

            const gameUrl = this.href;
            
            // Open a new window that tries to be as fullscreen/minimal as possible
            window.open(gameUrl, '_blank', 'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes');
        });
    });
});
