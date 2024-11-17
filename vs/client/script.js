let ws;
let roomId;
let playerId;
let currentTurn = 1;
let gameActive = false;
const boardSize = 100;
let playerPositions = {1: 1, 2: 1};

// Ular dan Tangga
const snakesAndLadders = {
    16: 6,   // Ular
    47: 26,  // Ular
    49: 11,  // Ular
    56: 53,  // Ular
    62: 19,  // Ular
    87: 24,  // Ular
    93: 73,  // Ular
    95: 75,  // Ular
    98: 78,  // Ular
    4: 14,   // Tangga
    9: 31,   // Tangga
    20: 38,  // Tangga
    28: 84,  // Tangga
    40: 59,  // Tangga
    51: 67,  // Tangga
    63: 81,  // Tangga
    71: 91   // Tangga
};

function initWebSocket() {
    ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
        console.log('Terhubung ke server');
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
        console.log('Terputus dari server');
    };
}

function handleWebSocketMessage(data) {
    switch (data.type) {
        case 'room_created':
            roomId = data.roomId;
            playerId = data.playerId;
            document.getElementById('room-info').textContent = `Room ID: ${roomId}`;
            document.getElementById('player-info').textContent = 'Menunggu pemain lain...';
            break;
            
        case 'game_start':
            gameActive = true;
            document.getElementById('game-container').style.display = 'block';
            document.getElementById('player-info').textContent = `Anda adalah Pemain ${playerId}`;
            initializeBoard();
            updateTurnIndicator();
            break;
            
        case 'opponent_move':
            handleOpponentMove(data.position, data.diceValue);
            break;
    }
}

function createRoom() {
    ws.send(JSON.stringify({
        type: 'create_room'
    }));
}

function joinRoom() {
    const roomIdInput = document.getElementById('room-id').value;
    if (roomIdInput) {
        ws.send(JSON.stringify({
            type: 'join_room',
            roomId: roomIdInput
        }));
    }
}

function initializeBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    for (let i = boardSize; i >= 1; i--) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = i;
        
        if (snakesAndLadders[i]) {
            cell.style.backgroundColor = i > snakesAndLadders[i] ? '#ffcdd2' : '#c8e6c9';
        }
        
        board.appendChild(cell);
    }
    
    updatePlayerPositions();
}

function updatePlayerPositions() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML = cell.textContent;
    });
    
    Object.entries(playerPositions).forEach(([player, position]) => {
        const cell = cells[boardSize - position];
        const token = document.createElement('div');
        token.className = `player-token player${player}`;
        token.textContent = `P${player}`;
        cell.appendChild(token);
    });
}

function rollDice() {
    if (!gameActive || currentTurn !== playerId) return;
    
    const diceValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-value').textContent = diceValue;
    
    movePlayer(playerId, diceValue);
    
    ws.send(JSON.stringify({
        type: 'move',
        position: playerPositions[playerId],
        diceValue: diceValue
    }));
    
    currentTurn = currentTurn === 1 ? 2 : 1;
    updateTurnIndicator();
}

function movePlayer(player, diceValue) {
    let newPosition = playerPositions[player] + diceValue;
    
    if (newPosition > boardSize) {
        newPosition = playerPositions[player];
    } else {
        if (snakesAndLadders[newPosition]) {
            newPosition = snakesAndLadders[newPosition];
        }
    }
    
    playerPositions[player] = newPosition;
    updatePlayerPositions();
    
    if (newPosition === boardSize) {
        alert(`Pemain ${player} menang!`);
        gameActive = false;
    }
}

function handleOpponentMove(position, diceValue) {
    document.getElementById('dice-value').textContent = diceValue;
    const opponent = playerId === 1 ? 2 : 1;
    movePlayer(opponent, diceValue);
    currentTurn = playerId;
    updateTurnIndicator();
}

function updateTurnIndicator() {
    document.getElementById('roll-dice').disabled = currentTurn !== playerId;
    document.querySelectorAll('.player').forEach(p => p.classList.remove('active-player'));
    document.querySelector(`.player${currentTurn}`).classList.add('active-player');
}

// Event Listeners
document.getElementById('create-room').addEventListener('click', createRoom);
document.getElementById('join-room').addEventListener('click', joinRoom);
document.getElementById('roll-dice').addEventListener('click', rollDice);

// Inisialisasi
initWebSocket(); 
      case 'room_created':
        roomId = data.roomId;
        playerId = data.playerId;
        document.getElementById('room-info').textContent = `Room ID: ${roomId}`;
        break;
        
      case 'game_start':
        alert('Pemain kedua bergabung! Game dimulai!');
        startGame();
        break;
        
      case 'opponent_move':
        updateOpponentPosition(data.position, data.diceValue);
        break;
    }
  };
}

document.getElementById('create-room').addEventListener('click', () => {
  ws.send(JSON.stringify({
    type: 'create_room'
  }));
});

document.getElementById('join-room').addEventListener('click', () => {
  const roomIdInput = document.getElementById('room-id').value;
  ws.send(JSON.stringify({
    type: 'join_room',
    roomId: roomIdInput
  }));
});

// Modifikasi fungsi rollDice yang ada
function rollDice() {
  // ... kode dadu yang sudah ada ...
  
  ws.send(JSON.stringify({
    type: 'move',
    position: playerPositions[currentPlayer],
    diceValue: diceValue
  }));
}

// Panggil ini saat halaman dimuat
initWebSocket(); 