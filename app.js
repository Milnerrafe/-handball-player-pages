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
      const score = player.king * 2 + player.queen * 1;
      playerItem.innerHTML = `
                <div class="player-info">
                    <span class="player-name">${player.name}</span>
                    <div class="player-score">Score: ${score}</div>
                </div>
                <div class="player-controls">
                    <button class="point-button" onclick="updatePlayer('${player.index}', 'king')">
                        <div class="point-value">2</div>
                        <div class="point-text">points</div>
                    </button>
                    <button class="point-button" onclick="updatePlayer('${player.index}', 'queen')">
                        <div class="point-value">1</div>
                        <div class="point-text">points</div>
                    </button>
                </div>
            `;
      playerList.appendChild(playerItem);
    });
  } else if (currentView === "leaderboard") {
    players.forEach((player) => {
      const score = player.king * 2 + player.queen * 1;
      const playerItem = document.createElement("div");
      playerItem.className = "player-item";
      playerItem.innerHTML = `
                <div class="player-info">
                    <span class="player-name">${player.name}</span>
                    <div class="player-score">Score: ${score}</div>
                </div>
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
