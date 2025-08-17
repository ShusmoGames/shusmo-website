import { firebaseConfig } from './firebase-config.js';

// Init
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// UI elms
const loginCard = document.getElementById('login-card');
const dashCard = document.getElementById('dash-card');
const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// Settings
const cEmail = document.getElementById('contact-email');
const cPhone = document.getElementById('contact-phone');
const cAddr  = document.getElementById('contact-address');
const saveSettings = document.getElementById('save-settings');
const settingsStatus = document.getElementById('settings-status');

// Games
const gamesList = document.getElementById('games-list');
const addGameBtn = document.getElementById('add-game');

// Auth state
auth.onAuthStateChanged(async (user) => {
  if (user) {
    loginCard.classList.add('hidden');
    dashCard.classList.remove('hidden');
    await loadSettings();
    await loadGames();
  } else {
    dashCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
  }
});

loginBtn.onclick = async () => {
  loginError.textContent = '';
  try {
    await auth.signInWithEmailAndPassword(emailEl.value.trim(), passEl.value);
  } catch (e) {
    loginError.textContent = e.message;
  }
};

logoutBtn.onclick = () => auth.signOut();

async function loadSettings() {
  const doc = await db.collection('settings').doc('contact').get();
  const data = doc.exists ? doc.data() : {};
  cEmail.value = data.email || '';
  cPhone.value = data.phone || '';
  cAddr.value  = data.address || '';
}

saveSettings.onclick = async () => {
  await db.collection('settings').doc('contact').set({
    email: cEmail.value.trim(),
    phone: cPhone.value.trim(),
    address: cAddr.value.trim(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  settingsStatus.textContent = 'Saved ✓';
  setTimeout(()=> settingsStatus.textContent = '', 1500);
};

function gameRow(docId, game) {
  const row = document.createElement('div');
  row.className = 'game-row';
  row.innerHTML = `
    <input class="g-title" placeholder="Title" value="${game.title||''}"/>
    <textarea class="g-desc" rows="2" placeholder="Description">${game.description||''}</textarea>
    <input class="g-image" placeholder="Image URL (https:// or /Images/...)" value="${game.image||''}"/>
    <input class="g-link" placeholder="Download URL" value="${game.download_url||''}"/>
    <div style="display:flex;gap:6px">
      <button class="save">Save</button>
      <button class="del" style="background:#303049;color:#eee">Delete</button>
    </div>`;

  row.querySelector('.save').onclick = async () => {
    const payload = {
      title: row.querySelector('.g-title').value.trim(),
      description: row.querySelector('.g-desc').value.trim(),
      image: row.querySelector('.g-image').value.trim(),
      download_url: row.querySelector('.g-link').value.trim(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await db.collection('games').doc(docId).set(payload, { merge: true });
  };

  row.querySelector('.del').onclick = async () => {
    if (confirm('Delete this game?')) await db.collection('games').doc(docId).delete();
  };

  return row;
}

async function loadGames() {
  gamesList.innerHTML = '';
  const snap = await db.collection('games').orderBy('title').get();
  snap.forEach(doc => gamesList.appendChild(gameRow(doc.id, doc.data())));
}

addGameBtn.onclick = async () => {
  const ref = db.collection('games').doc();
  await ref.set({ title: 'Untitled', description: '', image: '', download_url: '' });
  await loadGames();
};
