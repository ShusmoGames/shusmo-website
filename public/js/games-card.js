document.addEventListener('DOMContentLoaded', function() {
    loadGames();
});

// Function to load and display games from JSON file
function loadGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '<p>Loading games...</p>'; // Show loading message

    // Fetch games data from external JSON file in the "data" folder
    fetch('data/games-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayGames(data);
        })
        .catch(error => {
            console.error('Error loading games ', error);
            // Show error message
            document.getElementById('gamesGrid').innerHTML = '<p>Error loading games. Please check the connection or try again later.</p>';
        });
}

// Function to display games on the page
function displayGames(data) {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = ''; // Clear loading message
    
    data.games.forEach(game => {
        // Create game card element
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.setAttribute('data-id', game.id);

        // Build tags HTML
        const tagsHTML = game.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        // Build platforms/download buttons HTML
        let platformsHTML = '';
        if (game.platforms && game.platforms.length > 0) {
            platformsHTML = '<div class="download-buttons">';
            game.platforms.forEach(platform => {
                platformsHTML += `
                    <a href="${platform.url}" class="download-btn ${platform.color}" target="_blank">
                        <i class="fab fa-${platform.icon}"></i> ${platform.name}
                    </a>
                `;
            });
            platformsHTML += '</div>';
        }

        // Set the inner HTML of the game card
        gameCard.innerHTML = `
            <div class="game-image">
                <img src="${game.image}" alt="${game.title}">
            </div>
            <div class="game-content">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <div class="game-tags">
                    ${tagsHTML}
                </div>
                ${platformsHTML}
            </div>
        `;

        // Add click event to navigate to game details page
        gameCard.addEventListener('click', function() {
            // Navigate to game details page with game id as parameter
            window.location.href = `game-details.html?id=${game.id}`;
        });

        // Add the game card to the grid
        gamesGrid.appendChild(gameCard);
    });
}