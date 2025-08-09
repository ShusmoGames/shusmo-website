// /scripts/games-public.js
// If you prefer to render games dynamically on the public page from Firestore:
import { firebaseConfig } from '../admin/firebase-config.js';
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function renderGames() {
  const container = document.getElementById('games-container');
  if (!container) return;
  container.innerHTML = '';
  const snap = await db.collection('games').orderBy('title').get();
  snap.forEach(doc => {
    const g = doc.data();
    const card = document.createElement('div');
    card.className = 'game-card';
    const imgSrc = /^https?:/i.test(g.image||'') ? g.image : (g.image || '');
    card.innerHTML = `
      ${imgSrc ? `<img src="${imgSrc}" alt="${g.title||''}" />` : ''}
      <div class="game-card-content">
        <h2>${g.title||'Untitled'}</h2>
        <p>${g.description||''}</p>
        ${g.download_url ? `<a href="${g.download_url}" target="_blank" rel="noopener">Download</a>` : ''}
      </div>`;
    container.appendChild(card);
  });
}
renderGames();
