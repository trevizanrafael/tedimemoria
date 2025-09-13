const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const movesSpan = document.getElementById('moves');
const matchesSpan = document.getElementById('matches');

const cardImages = [
    'mouse.jpg',
    'teclado.jpg',
    'computador.jpg',
    'tedi.jpg',
    'ursotedi.jpg',
    'laptop.jpg'
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false; // To prevent multiple flips while two cards are checking

function initializeGame() {
    matchedPairs = 0;
    moves = 0;
    movesSpan.textContent = moves;
    matchesSpan.textContent = matchedPairs;
    gameBoard.innerHTML = ''; // Clear existing cards

    // Duplicate images for pairs and shuffle
    const gameCards = [...cardImages, ...cardImages];
    shuffleArray(gameCards);

    cards = []; // Clear previous card objects
    gameCards.forEach((imageName, index) => {
        const cardElement = createCard(imageName, index);
        gameBoard.appendChild(cardElement);
        cards.push({
            id: index,
            image: imageName,
            element: cardElement,
            isFlipped: false,
            isMatched: false
        });
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCard(imageName, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = imageName;
    card.dataset.id = index;

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-face', 'card-front');
    const img = document.createElement('img');
    img.src = imageName; // Path to image
    img.alt = imageName.split('.')[0]; // Alt text from filename
    cardFront.appendChild(img);

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-face', 'card-back');
    cardBack.textContent = '?'; // Simple question mark for card back

    card.appendChild(cardFront);
    card.appendChild(cardBack);

    card.addEventListener('click', () => flipCard(card, imageName, index));
    return card;
}

function flipCard(cardElement, imageName, cardIndex) {
    if (lockBoard) return;
    const cardObject = cards.find(c => c.id === cardIndex);
    if (cardObject.isFlipped || cardObject.isMatched) return;

    cardElement.classList.add('flipped');
    cardObject.isFlipped = true;
    flippedCards.push(cardObject);

    if (flippedCards.length === 2) {
        moves++;
        movesSpan.textContent = moves;
        lockBoard = true; // Lock the board
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.image === card2.image) {
        // Match found!
        card1.isMatched = true;
        card2.isMatched = true;
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        matchesSpan.textContent = matchedPairs;
        resetFlippedCards();

        if (matchedPairs === cardImages.length) {
            setTimeout(() => alert('Parabéns! Você encontrou todos os pares!'), 500);
        }
    } else {
        // No match, flip back
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            card1.isFlipped = false;
            card2.isFlipped = false;
            resetFlippedCards();
        }, 1000); // Wait 1 second before flipping back
    }
}

function resetFlippedCards() {
    flippedCards = [];
    lockBoard = false;
}

resetButton.addEventListener('click', initializeGame);

// Initial game setup
initializeGame();

