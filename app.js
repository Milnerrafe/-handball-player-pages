document.addEventListener('DOMContentLoaded', loadPlayers);

async function loadPlayers() {
  try {
    const response = await fetch('https://milnerrafe.workers.dev/api');
    if (!response.ok) throw new Error('Failed to fetch players');
    const players = await response.json();
    renderPlayers(players);
  } catch (error) {
    console.error('Error loading players:', error);
  }
}

function renderPlayers(players) {
  const playerList = document.getElementById('player-list');
  playerList.innerHTML = '';
  players.forEach(player => {
    const playerItem = document.createElement('div');
    playerItem.className = 'player-item';
    playerItem.innerHTML = `
      <img src="${player.img}" alt="${player.name}" />
      <span>${player.name}</span>
      <span>King: ${player.king}</span>
      <button onclick="updatePlayer('${player.name}', 'pawn')">Pawn</button>
      <button onclick="updatePlayer('${player.name}', 'knight')">Knight</button>
      <button onclick="updatePlayer('${player.name}', 'queen')">Queen</button>
      <button onclick="updatePlayer('${player.name}', 'king')">King</button>
    `;
    playerList.appendChild(playerItem);
  });
}

async function updatePlayer(name, role) {
  try {
    const response = await fetch('https://milnerrafe.workers.dev/api', {
      method: 'POST',
      body: JSON.stringify({ name, role }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to update player');
    loadPlayers();
  } catch (error) {
    console.error(`Error updating player ${name}:`, error);
  }
}

function showMode(mode) {
  document.getElementById('normal-mode').style.display = mode === 'normal' ? 'block' : 'none';
  document.getElementById('leaderboard-mode').
