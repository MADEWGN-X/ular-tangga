const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const rooms = new Map();

server.on('connection', (ws) => {
    let roomId;
    let playerId;

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'create_room':
                roomId = Math.random().toString(36).substring(7);
                rooms.set(roomId, {
                    players: [{id: 1, ws}],
                    currentTurn: 1
                });
                playerId = 1;
                ws.send(JSON.stringify({
                    type: 'room_created',
                    roomId,
                    playerId
                }));
                break;

            case 'join_room':
                roomId = data.roomId;
                if (rooms.has(roomId)) {
                    const room = rooms.get(roomId);
                    if (room.players.length < 2) {
                        playerId = 2;
                        room.players.push({id: playerId, ws});
                        
                        room.players.forEach(player => {
                            player.ws.send(JSON.stringify({
                                type: 'game_start'
                            }));
                        });
                    }
                }
                break;

            case 'move':
                if (rooms.has(roomId)) {
                    const room = rooms.get(roomId);
                    room.players.forEach(player => {
                        if (player.id !== playerId) {
                            player.ws.send(JSON.stringify({
                                type: 'opponent_move',
                                position: data.position,
                                diceValue: data.diceValue
                            }));
                        }
                    });
                }
                break;
        }
    });

    ws.on('close', () => {
        if (roomId && rooms.has(roomId)) {
            const room = rooms.get(roomId);
            room.players = room.players.filter(p => p.ws !== ws);
            if (room.players.length === 0) {
                rooms.delete(roomId);
            } else {
                room.players.forEach(player => {
                    player.ws.send(JSON.stringify({
                        type: 'player_disconnected'
                    }));
                });
            }
        }
    });
});

console.log('Server berjalan di port 8080');
