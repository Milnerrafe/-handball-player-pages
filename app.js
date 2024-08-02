document.addEventListener("DOMContentLoaded", loadPlayers);

let currentView = "normal";

async function loadPlayers() {
  try {
    let url = "https://handball-player-worker.milnerrafe.workers.dev/api";
    if (currentView === "leaderboard") {
      url += "/leaderboard";
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch players");
    const players = await response.json();
    renderPlayers(players);
  } catch (error) {
    showError(error.message);
  }
}

function renderPlayers(players) {
  const playerList = document.getElementById("player-list");
  playerList.innerHTML = "";
  if (currentView === "normal") {
    players.sort((a, b) => a.index - b.index); // Sort players by index
    players.forEach((player) => {
      const playerItem = document.createElement("div");
      playerItem.className = "player-item";
      playerItem.innerHTML = `
        <img src="${player.img}" alt="${player.name}" class="profile-pic" />
        <span>${player.name}</span>
        <span>King: ${player.king}</span>
        <span>Pawn: ${player.pawn}</span>
        <span>Knight: ${player.knight}</span>
        <span>Queen: ${player.queen}</span>
        <button onclick="updatePlayer('${player.index}', 'pawn')">Add Pawn</button>
        <button onclick="updatePlayer('${player.index}', 'knight')">Add Knight</button>
        <button onclick="updatePlayer('${player.index}', 'queen')">Add Queen</button>
        <button onclick="updatePlayer('${player.index}', 'king')">Add King</button>
      `;
      playerList.appendChild(playerItem);
    });
  } else if (currentView === "leaderboard") {
    players.forEach((player) => {
      const playerItem = document.createElement("div");
      playerItem.className = "player-item";
      playerItem.innerHTML = `
        <img src="${player.img}" alt="${player.name}" class="profile-pic" />
        <span>${player.name}</span>
        <span>King: ${player.king}</span>
      `;
      playerList.appendChild(playerItem);
    });
  }
}

async function submitAddPlayer() {
  const name = document.getElementById("name").value;
  const img = document.getElementById("img").value;

  try {
    const response = await fetch(
      "https://handball-player-worker.milnerrafe.workers.dev/api",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index: Date.now().toString(), // Use timestamp as unique index
          name,
          img,
          king: 0,
          pawn: 0,
          knight: 0,
          queen: 0,
        }),
      },
    );
    if (!response.ok) throw new Error("Failed to add player");
    closeAddPlayerModal();
    loadPlayers(); // Reload players to include the newly added player
  } catch (error) {
    showError(error.message);
  }
}

function openAddPlayerModal() {
  document.getElementById("add-player-modal").style.display = "block";
}

function closeAddPlayerModal() {
  document.getElementById("add-player-modal").style.display = "none";
}

function showError(message) {
  const errorElement = document.getElementById("modal-error");
  errorElement.textContent = message;
  setTimeout(() => (errorElement.textContent = ""), 5000); // Clear error after 5 seconds
}

async function updatePlayer(index, role) {
  try {
    const response = await fetch(
      "https://handball-player-worker.milnerrafe.workers.dev/api",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index, role }),
      },
    );
    if (!response.ok) throw new Error("Failed to update player");
    loadPlayers(); // Reload players to reflect the updated stats
  } catch (error) {
    showError(error.message);
  }
}

function showMode(mode) {
  currentView = mode;
  loadPlayers();
}
