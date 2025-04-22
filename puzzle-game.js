const puzzle = document.getElementById('puzzle');
const shuffleBtn = document.getElementById('shuffle-btn');
const message = document.getElementById('message');

let tiles = [];
let emptyIndex = 8; // last tile is empty in 3x3 grid

function createTiles() {
    tiles = [];
    puzzle.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = (i + 1).toString();
        tile.dataset.index = i;
        tile.addEventListener('click', () => moveTile(i));
        tiles.push(tile);
        puzzle.appendChild(tile);
    }
    // Add empty tile
    const emptyTile = document.createElement('div');
    emptyTile.classList.add('tile', 'empty');
    emptyTile.dataset.index = 8;
    tiles.push(emptyTile);
    puzzle.appendChild(emptyTile);
}

function moveTile(index) {
    if (canMove(index)) {
        swapTiles(index, emptyIndex);
        emptyIndex = index;
        checkWin();
    }
}

function canMove(index) {
    const adjacentIndices = getAdjacentIndices(emptyIndex);
    return adjacentIndices.includes(index);
}

function getAdjacentIndices(index) {
    const adjacent = [];
    const row = Math.floor(index / 3);
    const col = index % 3;
    if (row > 0) adjacent.push(index - 3);
    if (row < 2) adjacent.push(index + 3);
    if (col > 0) adjacent.push(index - 1);
    if (col < 2) adjacent.push(index + 1);
    return adjacent;
}

function swapTiles(i1, i2) {
    const tempText = tiles[i1].textContent;
    const tempClass = tiles[i1].className;

    tiles[i1].textContent = tiles[i2].textContent;
    tiles[i1].className = tiles[i2].className;

    tiles[i2].textContent = tempText;
    tiles[i2].className = tempClass;
}

function shuffle() {
    let shuffleCount = 100;
    while (shuffleCount > 0) {
        const adjacent = getAdjacentIndices(emptyIndex);
        const randIndex = adjacent[Math.floor(Math.random() * adjacent.length)];
        swapTiles(emptyIndex, randIndex);
        emptyIndex = randIndex;
        shuffleCount--;
    }
    message.textContent = '';
}

function checkWin() {
    for (let i = 0; i < 8; i++) {
        if (tiles[i].textContent != (i + 1).toString()) {
            message.textContent = '';
            return;
        }
    }
    message.textContent = 'You solved the puzzle! 🎉';
}

shuffleBtn.addEventListener('click', () => {
    shuffle();
});

createTiles();
