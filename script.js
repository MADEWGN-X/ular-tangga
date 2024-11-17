// Select elements
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const diceResult = document.getElementById('dice-result');
const playerTurn = document.getElementById('player-turn');
const rollDiceButton = document.getElementById('roll-dice');
const dice = document.getElementById('dice');

// Canvas setup
canvas.width = 500;
canvas.height = 500;
const boardImage = new Image();
boardImage.src = 'board.jpg';

// Players
const players = [
  { x: 25, y: canvas.height - 25, position: 1, color: 'red', name: 'Merah' }, // Tambah properti name
  { x: 25, y: canvas.height - 25, position: 1, color: 'blue', name: 'Biru' }  // Tambah properti name
];
let currentPlayer = 0;

// Ular dan tangga (format: { start: awal, end: akhir })
const snakesAndLadders = [
    // Tangga (start: bawah, end: atas)
    { start: 1, end: 38 },    // Tangga panjang di kiri
    { start: 4, end: 14 },    // Tangga pendek di bawah
    { start: 9, end: 31 },    // Tangga di kanan bawah
    { start: 21, end: 42 },   // Tangga di kiri tengah
    { start: 28, end: 84 },   // Tangga panjang di tengah
    { start: 51, end: 67 },   // Tangga di kanan tengah
    { start: 71, end: 91 },   // Tangga di kanan atas
    { start: 80, end: 100 },  // Tangga di kiri atas

    // Ular (start: atas, end: bawah)
    { start: 98, end: 79 },   // Ular hitam-orange di atas
    { start: 95, end: 75 },   // Ular merah-putih di atas
    { start: 87, end: 24 },   // Ular kuning di tengah atas
    { start: 62, end: 19 },   // Ular merah-hitam di kiri
    { start: 54, end: 34 },   // Ular putih-hitam di tengah
    { start: 17, end: 7 }     // Ular hijau di bawah
];
  

function animatePlayerMovement(player, targetX, targetY) {
    const animationDuration = 2000; // Durasi animasi dalam milidetik (sesuaikan durasi)
    const steps = 200; // Jumlah langkah animasi (sesuaikan langkah)
    const stepX = (targetX - player.x) / steps;
    const stepY = (targetY - player.y) / steps;
    let currentStep = 0;

    function animate() {
        if (currentStep < steps) {
            player.x += stepX;
            player.y += stepY;
            currentStep++;
            drawBoard();
            requestAnimationFrame(animate);
        } else {
            player.x = targetX; // Pastikan posisi akhir tepat
            player.y = targetY;
            drawBoard();
        }
    }

    animate();
}

// Tambahkan fungsi untuk mengambil soal random
function getRandomQuestion() {
    const topics = ['komposisi_dan_invers_fungsi', 'lingkaran'];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const questions = soalData[randomTopic];
    return questions[Math.floor(Math.random() * questions.length)];
}

// Tambahkan fungsi untuk menampilkan soal
async function showQuestion(isLadder) {
    const question = getRandomQuestion();
    const playerAnswer = prompt(`${isLadder ? 'Untuk naik tangga' : 'Untuk menghindari ular'}, jawab pertanyaan berikut:\n\n${question.soal}`);
    return playerAnswer === question.jawaban;
}

// Modifikasi fungsi movePlayer
function movePlayer(player, steps) {
    let originalPosition = player.position;
    let newPosition = player.position + steps;

    if (newPosition > 100) {
        alert('Anda harus mendapat angka yang pas untuk mencapai 100!');
        return;
    }

    player.position = newPosition;

    // Cek ular dan tangga
    let foundSnakeOrLadder = snakesAndLadders.find(sl => sl.start === player.position);
    if (foundSnakeOrLadder) {
        const isLadder = foundSnakeOrLadder.end > foundSnakeOrLadder.start;
        
        setTimeout(async () => {
            const isCorrect = await showQuestion(isLadder);
            
            if (isLadder) {
                if (isCorrect) {
                    alert('Jawaban benar! Anda naik tangga!');
                    player.position = foundSnakeOrLadder.end;
                } else {
                    alert('Jawaban salah! Anda tidak bisa naik tangga.');
                }
            } else {
                if (isCorrect) {
                    alert('Jawaban benar! Anda berhasil menghindari ular!');
                } else {
                    alert('Jawaban salah! Anda turun mengikuti ular!');
                    player.position = foundSnakeOrLadder.end;
                }
            }

            // Update posisi setelah menjawab soal
            const finalRow = Math.floor((player.position - 1) / 10);
            const finalCol = (player.position - 1) % 10;
            const finalX = (finalRow % 2 === 0 ? finalCol : 9 - finalCol) * (canvas.width / 10) + 25;
            const finalY = canvas.height - finalRow * (canvas.height / 10) - 25;
            
            animatePlayerMovement(player, finalX, finalY);
        }, 2000);
    }

    // Hitung koordinat berdasarkan posisi
    const row = Math.floor((player.position - 1) / 10);
    const col = (player.position - 1) % 10;
    const targetX = (row % 2 === 0 ? col : 9 - col) * (canvas.width / 10) + 25;
    const targetY = canvas.height - row * (canvas.height / 10) - 25;

    // Animasi pergerakan pemain
    animatePlayerMovement(player, targetX, targetY);

    // Cek kondisi menang
    if (player.position === 100) {
        setTimeout(() => {
            alert(`Pemain ${currentPlayer + 1} menang!`);
            resetGame();
        }, 2000);
    }
}
  


// Draw board and players
function drawBoard() {
  ctx.drawImage(boardImage, 0, 0, canvas.width, canvas.height);
  players.forEach(player => {
    ctx.beginPath();
    ctx.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
  });
}

// Roll dice
function rollDice() {
    return new Promise((resolve) => {
        const result = Math.floor(Math.random() * 6) + 1;
        dice.classList.add('rolling');
        
        // Rotasi dadu sesuai dengan hasil
        const rotations = {
            1: 'rotateX(0deg) rotateY(0deg)',
            2: 'rotateX(-90deg) rotateY(0deg)',
            3: 'rotateX(0deg) rotateY(-90deg)',
            4: 'rotateX(0deg) rotateY(90deg)',
            5: 'rotateX(90deg) rotateY(0deg)',
            6: 'rotateX(180deg) rotateY(0deg)'
        };

        setTimeout(() => {
            dice.classList.remove('rolling');
            dice.style.transform = rotations[result];
            resolve(result);
        }, 4000);
    });
}

// Reset game
function resetGame() {
  players.forEach(player => {
    player.position = 1; // Mulai dari posisi 1
    player.x = 25;
    player.y = canvas.height - 25;
  });
  currentPlayer = 0;
  updateUI();
  drawBoard();
}

// Update UI
function updateUI() {
  diceResult.textContent = `Dadu: 0`;
  playerTurn.textContent = `Giliran: Pemain ${players[currentPlayer].name}`;
}

// Tambahkan di awal file
let soalData = {}; // Akan diisi dengan data dari soal.json

// Modifikasi game setup
async function initGame() {
    try {
        // Load soal.json
        const response = await fetch('soal.json');
        if (!response.ok) {
            throw new Error('Gagal memuat soal.json');
        }
        soalData = await response.json();

        // Gambar board segera setelah gambar dimuat
        boardImage.onload = () => {
            resetGame();
            drawBoard(); // Menggambar board segera
        };
        
        // Muat gambar board
        boardImage.src = 'board.jpg';
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Terjadi kesalahan saat memuat game. Pastikan file soal.json tersedia.');
    }
}

// Panggil initGame saat window load
window.addEventListener('load', initGame);

// Event listener
rollDiceButton.addEventListener('click', async () => {
    rollDiceButton.disabled = true;
    const dice = await rollDice();
    diceResult.textContent = `Dadu: ${dice}`;
    movePlayer(players[currentPlayer], dice);
    currentPlayer = (currentPlayer + 1) % players.length;
    playerTurn.textContent = `Giliran: Pemain ${players[currentPlayer].name}`;
    rollDiceButton.disabled = false;
});
