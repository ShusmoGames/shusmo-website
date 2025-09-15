document.addEventListener('DOMContentLoaded', function () {
    // Get the game ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) {
        document.getElementById('gameContent').innerHTML = '<p>Game not found.</p>';
        return;
    }

    // Fetch games data and display the specific game
    fetch('data/games-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const game = data.games.find(g => g.id == gameId);
            if (game) {
                displayGameDetails(game);
            } else {
                document.getElementById('gameContent').innerHTML = '<p>Game not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading game details:', error);
            document.getElementById('gameContent').innerHTML = '<p>Error loading game details. Please try again later.</p>';
        });
});

// Function to display game details on the page
function displayGameDetails(game) {
    const gameContent = document.getElementById('gameContent');

    // Update page title
    document.getElementById('gameTitle').innerText = `${game.title} - Shusmo Games`;

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

    // Build tags HTML
    const tagsHTML = game.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    // Set the inner HTML of the game content
    gameContent.innerHTML = `
        <div class="game-detail-card">
            <div class="game-detail-header">
                <h1>${game.title}</h1>
                <br>
                <img src="${game.image}" alt="${game.title}" class="game-detail-image">
                
                <div class="game-detail-info">
                    ${platformsHTML}
                </div>
            </div>
            
            <div class="game-detail-body">
                <div class="game-description">
                    <h3>About ${game.title}</h3>
                    <p>${game.description}</p>
                </div>
                
                <div class="game-tags-section">
                    <div class="game-tags">
                        ${tagsHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function myFunction() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less";
      moreText.style.display = "inline";
    }
  }