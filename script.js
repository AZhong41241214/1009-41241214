// 圖片資料夾路徑
const imageFolder = 'images/';
const themeFolder = 'theme_images/'; // 新的主題圖片資料夾
const themes = [
    {
        cover: `${imageFolder}img99.png`, // 主題1的封面
        imageCount: 24, // 主題1的圖片數量
    },
    {
        cover: `${themeFolder}img999.png`, // 主題2的封面
        imageCount: 24, // 主題2的圖片數量
    },
    // 可以添加更多主題
];

let currentThemeIndex = 0; // 當前主題索引
let cardData = [];
let canFlip = true; // 一開始允許翻牌
let countdownTimer;
let flippedCards = [];
let gridSize = '4x4';
let countdownTime = 10;

const gridContainer = document.getElementById('card-grid');
const startGameBtn = document.getElementById('start-game-btn');
const timerDisplay = document.getElementById('timer');
const gridSizeSelect = document.getElementById('grid-size-select');
const timerSelect = document.getElementById('timer-select');
const successSound = document.getElementById('success-sound');
const failSound = document.getElementById('fail-sound');

// 按鈕元素
const flipFrontBtn = document.getElementById('flip-front-btn');
const flipBackBtn = document.getElementById('flip-back-btn');
const nextThemeBtn = document.getElementById('next-theme-btn');

// 选择网格大小
gridSizeSelect.addEventListener('change', (e) => {
    gridSize = e.target.value;
});

// 选择倒数时间
timerSelect.addEventListener('change', (e) => {
    countdownTime = parseInt(e.target.value);
});

// 生成隨機圖片對
function generateRandomImagePairs(numPairs) {
    const imageIndices = [];
    
    // 隨機選取圖片索引
    while (imageIndices.length < numPairs) {
        let randomIndex = Math.floor(Math.random() * themes[currentThemeIndex].imageCount) + 1;
        if (!imageIndices.includes(randomIndex)) {
            imageIndices.push(randomIndex);
        }
    }

    // 每個圖片索引配對兩次
    const imagePairs = imageIndices.flatMap(index => [
        { back: `${themeFolder}img${index}.png`, front: themes[currentThemeIndex].cover },
        { back: `${themeFolder}img${index}.png`, front: themes[currentThemeIndex].cover }
    ]);

    return imagePairs;
}

startGameBtn.addEventListener('click', function() {
    // 清空当前网格
    gridContainer.innerHTML = '';

    clearInterval(countdownTimer);
    let timeLeft = countdownTime;
    timerDisplay.innerText = `剩餘時間: ${timeLeft}`;

    // 根據選擇的網格大小生成對應數量的卡片對
    const numPairs = {
        '2x2': 2,
        '4x4': 8,
        '6x6': 18
    }[gridSize];

    // 使用隨機生成的卡片對
    cardData = generateRandomImagePairs(numPairs);
    shuffle(cardData);

    setGridSize(gridSize);

    // 創建卡片
    cardData.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.id = `card${index + 1}`;

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const frontImg = document.createElement('img');
        frontImg.src = card.front; // 使用封面圖作為正面
        cardFront.appendChild(frontImg);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const backImg = document.createElement('img');
        backImg.src = card.back; // 使用隨機圖片作為背面
        cardBack.appendChild(backImg);

        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);
        gridContainer.appendChild(cardElement);

        // 添加翻牌邏輯
        cardElement.addEventListener('click', function() {
            if (canFlip && !this.classList.contains('flipped')) {
                this.classList.toggle('flipped');
                flippedCards.push(this);

                if (flippedCards.length === 2) {
                    const firstCard = flippedCards[0].querySelector('.card-back img').src;
                    const secondCard = flippedCards[1].querySelector('.card-back img').src;

                    if (firstCard === secondCard) {
                        successSound.play();
                        flippedCards.forEach(card => card.style.visibility = 'hidden');
                        flippedCards = [];
                    } else {
                        failSound.play();
                        setTimeout(() => {
                            flippedCards.forEach(card => card.classList.remove('flipped'));
                            flippedCards = [];
                        }, 1000);
                    }
                }
            }
        });
    });

    countdownTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `剩餘時間: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            canFlip = false;
            const allCards = document.querySelectorAll('.card');
            allCards.forEach(card => {
                card.classList.add('flipped'); // 時間到時翻開所有卡片
            });
            timerDisplay.innerText = `剩餘時間: 0`;
        }
    }, 1000);
});

// 翻轉正面按鈕事件
flipFrontBtn.addEventListener('click', function() {
    if (!canFlip) {
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.add('flipped');
        });
    }
});

// 翻轉背面按鈕事件
flipBackBtn.addEventListener('click', function() {
    if (!canFlip) {
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.remove('flipped');
        });
    }
});

// 下一個主題按鈕事件
nextThemeBtn.addEventListener('click', function() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length; // 循環切換主題
    gridContainer.innerHTML = ''; // 清空卡片
    canFlip = true; // 重新允許翻牌

    // 重新生成卡片
    const numPairs = {
        '2x2': 2,
        '4x4': 8,
        '6x6': 18
    }[gridSize];

    cardData = generateRandomImagePairs(numPairs);
    shuffle(cardData);

    setGridSize(gridSize);
    cardData.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.id = `card${index + 1}`;

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const frontImg = document.createElement('img');
        frontImg.src = card.front;
        cardFront.appendChild(frontImg);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const backImg = document.createElement('img');
        backImg.src = card.back;
        cardBack.appendChild(backImg);

        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);
        gridContainer.appendChild(cardElement);

        // 添加翻牌邏輯
        cardElement.addEventListener('click', function() {
            if (canFlip && !this.classList.contains('flipped')) {
                this.classList.toggle('flipped');
                flippedCards.push(this);

                if (flippedCards.length === 2) {
                    const firstCard = flippedCards[0].querySelector('.card-back img').src;
                    const secondCard = flippedCards[1].querySelector('.card-back img').src;

                    if (firstCard === secondCard) {
                        successSound.play();
                        flippedCards.forEach(card => card.style.visibility = 'hidden');
                        flippedCards = [];
                    } else {
                        failSound.play();
                        setTimeout(() => {
                            flippedCards.forEach(card => card.classList.remove('flipped'));
                            flippedCards = [];
                        }, 1000);
                    }
                }
            }
        });
    });
});

// 设置网格大小
function setGridSize(size) {
    gridContainer.classList.remove('grid-2x2', 'grid-4x4', 'grid-6x6');
    switch(size) {
        case '2x2':
            gridContainer.classList.add('grid-2x2');
            break;
        case '4x4':
            gridContainer.classList.add('grid-4x4');
            break;
        case '6x6':
            gridContainer.classList.add('grid-6x6');
            break;
    }
}

// 洗牌函數，隨機打亂陣列
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

