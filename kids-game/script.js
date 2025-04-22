const colors = [
    { name: 'Red', hex: '#ff0000' },
    { name: 'Green', hex: '#00ff00' },
    { name: 'Blue', hex: '#0000ff' },
    { name: 'Yellow', hex: '#ffff00' },
    { name: 'Orange', hex: '#ffa500' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Pink', hex: '#ffc0cb' },
    { name: 'Brown', hex: '#a52a2a' }
];

const colorNameElem = document.getElementById('color-name');
const colorButtonsContainer = document.getElementById('color-buttons');
const resultElem = document.getElementById('result');
const nextBtn = document.getElementById('next-btn');

let currentColor = null;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateButtons() {
    colorButtonsContainer.innerHTML = '';
    const options = [...colors];
    shuffleArray(options);
    const selectedColors = options.slice(0, 4);

    if (!selectedColors.some(c => c.name === currentColor.name)) {
        selectedColors[Math.floor(Math.random() * 4)] = currentColor;
    }

    shuffleArray(selectedColors);

    selectedColors.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'color-button';
        btn.style.backgroundColor = color.hex;
        btn.setAttribute('data-color', color.name);
        btn.addEventListener('click', onColorClick);
        colorButtonsContainer.appendChild(btn);
    });
}

function onColorClick(e) {
    const selectedColor = e.target.getAttribute('data-color');
    if (selectedColor === currentColor.name) {
        resultElem.textContent = 'Correct! 🎉';
    } else {
        resultElem.textContent = 'Try Again! ❌';
    }
}

function nextRound() {
    resultElem.textContent = '';
    currentColor = colors[Math.floor(Math.random() * colors.length)];
    colorNameElem.textContent = currentColor.name;
    generateButtons();
}

nextBtn.addEventListener('click', nextRound);

nextRound();
