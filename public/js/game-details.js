document.addEventListener('DOMContentLoaded', function () {
    // Get the game ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) {
        document.getElementById('gameContent').innerHTML = '<p class="error">Game not found.</p>';
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
                document.getElementById('gameContent').innerHTML = '<p class="error">Game not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading game details:', error);
            document.getElementById('gameContent').innerHTML = '<p class="error">Error loading game details. Please try again later.</p>';
        });
});

// Function to display game details on the page
function displayGameDetails(game) {
    const gameContent = document.getElementById('gameContent');

    // Update page title
    document.getElementById('gameTitle').innerText = `${game.title} - Shusmo Games`;
    updateMetaTags(game);

    // Helper to safely add sections
    const safeSection = (label, value) => value ? `<div class="info-row"><strong>${label}:</strong> ${value}</div>` : '';
    const safeList = (label, items) => items && items.length ? `<div class="info-row"><strong>${label}:</strong> ${items.join(', ')}</div>` : '';

    // Build platforms/download buttons HTML
    let platformsHTML = '';
    if (game.platforms && game.platforms.length > 0) {
        platformsHTML = '<div class="download-buttons">';
        game.platforms.forEach(platform => {
            platformsHTML += `
                <a href="${platform.url}" class="download-btn ${platform.color}" target="_blank" rel="noopener">
                    <i class="fab fa-${platform.icon}"></i> ${platform.name}
                </a>
            `;
        });
        platformsHTML += '</div>';
    }

    // Build tags HTML
    const tagsHTML = game.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || '';

    // Media Section (Thumbnails with video and screenshots)
    let mediaHTML = '';
    const hasScreenshots = game.screenshots && game.screenshots.length > 0;
    const hasTrailer = game.trailerUrl;

    if (hasTrailer || hasScreenshots) {
        const mediaItems = [];

        // Add trailer as first item
        if (hasTrailer) {
            mediaItems.push({
                type: 'video',
                src: game.trailerUrl,
                thumb: `https://img.youtube.com/vi/${getYouTubeID(game.trailerUrl)}/mqdefault.jpg`,
                active: 'active'
            });
        }

        // Add screenshots
        if (hasScreenshots) {
            game.screenshots.forEach((src, index) => {
                mediaItems.push({
                    type: 'image',
                    src: src,
                    thumb: src,
                    active: hasTrailer ? '' : (index === 0 ? 'active' : '')
                });
            });
        }

        mediaHTML = `
        <section class="media-section">
            <div class="media-container">
                <div class="media-display">
                    <div class="media-frame" id="mediaFrame">
                        ${hasTrailer ? generateMediaIframe(game.trailerUrl) : `<img src="${game.screenshots[0]}" alt="Screenshot">`}
                    </div>
                </div>
                <div class="media-thumbnails">
                    ${mediaItems.map(item => `
                        <div class="thumbnail ${item.active}" onclick="changeMedia('${item.type}', '${item.src}', this)">
                            <img src="${item.thumb}" alt="${item.type === 'video' ? 'Trailer' : 'Screenshot'}">
                            ${item.type === 'video' ? '<div class="play-overlay"><i class="fas fa-play"></i></div>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        `;
    }

    // Combined description and tags section
    const descriptionTagsHTML = `
        <section class="description-tags-section">
            <div class="description-tags-card">
                <div class="game-description">
                    <h3>About ${game.title}</h3>
                    <p>${game.description}</p>
                </div>
                ${tagsHTML ? `<div class="tag-section">${tagsHTML}</div>` : ''}

                <br>
                <button class="share-btn" onclick="shareGame('${game.title}', window.location.href)">
                <i class="fas fa-share-alt"></i> Share
            </button>
            </div>
        </section>
    `;

    // Info section
    const infoHTML = game.releaseDate || game.version || game.size || game.developer || game.genre || game.languages || game.requires ? `
        <section class="game-info">
            ${safeSection('Genre', game.genre)}
            ${safeSection('Developer', game.developer)}
            ${safeSection('Release Date', game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : '')}
            ${safeList('Languages', game.languages)}
        </section>
    ` : '';

    // Set the inner HTML of the game content
    gameContent.innerHTML = `
        <!-- Game Header with Background -->
        <header class="game-header">
            <div class="header-content">
                <div class="header-top">
                    <img src="${game.icon || game.image}" alt="${game.title}" class="game-icon">
                    <h1>${game.title}</h1>
                </div>
                <div class="header-bottom">
                    ${platformsHTML}
                </div>
            </div>
        </header>

        <!-- Media Section -->
        ${mediaHTML}

        <!-- Description and Tags -->
        ${descriptionTagsHTML}

        <!-- Game Info -->
        ${infoHTML}
    `;
}

// Helper to extract YouTube ID from URL
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

// Helper to generate iframe for video
function generateMediaIframe(url) {
    return `<iframe src="${url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

// Function to change media
function changeMedia(type, src, element) {
    const mediaFrame = document.getElementById('mediaFrame');

    // Remove active class from all thumbnails
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    // Add active class to current
    element.classList.add('active');

    // Update media frame
    if (type === 'video') {
        mediaFrame.innerHTML = generateMediaIframe(src);
    } else {
        mediaFrame.innerHTML = `<img src="${src}" alt="Screenshot">`;
    }
}

// Update meta tags for SEO
function updateMetaTags(game) {
    const description = game.description.substring(0, 160);

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Open Graph / Social
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.content = game.title;
    if (!document.querySelector('meta[property="og:title"]')) document.head.appendChild(ogTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.content = description;
    if (!document.querySelector('meta[property="og:description"]')) document.head.appendChild(ogDesc);

    const ogImage = document.querySelector('meta[property="og:image"]') || document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.content = game.image;
    if (!document.querySelector('meta[property="og:image"]')) document.head.appendChild(ogImage);

    const ogUrl = document.querySelector('meta[property="og:url"]') || document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.content = window.location.href;
    if (!document.querySelector('meta[property="og:url"]')) document.head.appendChild(ogUrl);

    // Schema.org JSON-LD
    const schema = {
        "@context": "https://schema.org",
        "@type": "MobileApplication",
        "name": game.title,
        "description": game.description,
        "applicationCategory": "Game",
        "operatingSystem": "Android, iOS",
        "offers": { "@type": "Offer", "price": "0" },
        "image": game.image,
        "datePublished": game.releaseDate,
        "version": game.version,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.7",
            "reviewCount": "1250"
        }
    };

    let schemaScript = document.getElementById('schema-jsonld');
    if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'schema-jsonld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);
}

// Share function (mobile-friendly)
function shareGame(title, url) {
    if (navigator.share) {
        navigator.share({ title, url });
    } else {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }
}