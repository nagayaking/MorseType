// DOM要素の取得
const header = document.querySelector('header');
const practiceToggleButton = document.getElementById("practiceToggleButton");
const aiChatToggleButton = document.getElementById("aiChatToggleButton");
const settingsToggleButton = document.getElementById("settingsToggleButton");
const listeningPracticeButton = document.getElementById("listeningPracticeButton");
const backToPracticeButton = document.getElementById("backToPracticeButton");

const startScreen = document.getElementById('start-screen');
const modeSelectionScreen = document.getElementById('mode-selection-screen');
const practiceToggleElement = document.getElementById("practiceToggleElement");
const aiChatToggleElement = document.getElementById("aiChatToggleElement");
const listeningPracticeElement = document.getElementById("listeningPracticeElement");
const settingsScreen = document.getElementById("settings-screen");

const startPracticeButton = document.getElementById('startPracticeButton');
const startListeningButton = document.getElementById('startListeningButton');
const startAiChatButton = document.getElementById('startAiChatButton');
const headerLeft = document.querySelector('.header-left');

const startPracticeGameButton = document.getElementById('startPracticeGameButton');
const backToStartScreenFromMode = document.getElementById('backToStartScreenFromMode');
const backToModeSelection = document.getElementById('backToModeSelection');

const closeBtn = document.querySelector('.close-btn');
const overlay = document.getElementById('overlay');

// 全てのページコンテンツを非表示にする関数
function hideAllPages() {
    startScreen.classList.add('is-hidden');
    modeSelectionScreen.classList.add('is-hidden');
    practiceToggleElement.classList.add('is-hidden');
    aiChatToggleElement.classList.add('is-hidden');
    listeningPracticeElement.classList.add('is-hidden');
}

// スタート画面を表示する関数
function showStartScreen() {
    hideAllPages();
    startScreen.classList.remove('is-hidden');
    header.classList.add('header-hidden');
}

// モード選択画面を表示する関数
function showModeSelectionScreen() {
    hideAllPages();
    modeSelectionScreen.classList.remove('is-hidden');
    header.classList.add('header-hidden');
}

// タイピング練習画面を表示する関数
function showTypingPracticeScreen() {
    hideAllPages();
    practiceToggleElement.classList.remove('is-hidden');
    header.classList.remove('header-hidden');
    if (typeof window.restartMorsePractice === 'function') {
        window.restartMorsePractice();
    }
}

// --- イベントリスナーの設定 ---

// スタート画面の「タイピング練習」ボタン -> モード選択画面へ
startPracticeButton.addEventListener('click', showModeSelectionScreen);

// モード選択画面の「スタート」ボタン -> タイピング練習画面へ
startPracticeGameButton.addEventListener('click', showTypingPracticeScreen);

// タイピング練習画面 -> モード選択画面へ戻る
backToModeSelection.addEventListener('click', showModeSelectionScreen);

// モード選択画面 -> スタート画面へ戻る
backToStartScreenFromMode.addEventListener('click', showStartScreen);

// スタート画面の「リスニング練習」ボタン
startListeningButton.addEventListener('click', () => {
    hideAllPages();
    listeningPracticeElement.classList.remove('is-hidden');
    header.classList.remove('header-hidden');
});

// スタート画面の「AIチャット」ボタン
startAiChatButton.addEventListener('click', () => {
    hideAllPages();
    aiChatToggleElement.classList.remove('is-hidden');
    header.classList.remove('header-hidden');
});

// ヘッダーの「練習」ボタン -> モード選択画面へ
practiceToggleButton.addEventListener('click', showModeSelectionScreen);

// ヘッダーの「AIチャット」ボタン
aiChatToggleButton.addEventListener('click', () => {
    hideAllPages();
    aiChatToggleElement.classList.remove('is-hidden');
    header.classList.remove('header-hidden');
});

// 「リスニング練習」ボタン (練習画面内)
listeningPracticeButton.addEventListener('click', () => {
    hideAllPages();
    listeningPracticeElement.classList.remove('is-hidden');
    header.classList.remove('header-hidden');
});

// 「練習に戻る」ボタン (リスニング画面内)
backToPracticeButton.addEventListener('click', () => {
    hideAllPages();
    practiceToggleElement.classList.remove('is-hidden');
    header.classList.remove('header-hidden');
});

// ヘッダーのロゴクリックでスタート画面に戻る
headerLeft.addEventListener('click', showStartScreen);


// --- Settings Screen Logic --- //

function openSettings() {
    settingsScreen.classList.add('is-active');
    overlay.classList.add('is-active');
}

function closeSettings() {
    settingsScreen.classList.remove('is-active');
    overlay.classList.remove('is-active');
}

settingsToggleButton.addEventListener('click', openSettings);
closeBtn.addEventListener('click', closeSettings);
overlay.addEventListener('click', closeSettings);

settingsScreen.addEventListener('click', (event) => {
    event.stopPropagation();
});

// --- Volume Control Logic --- //

const typingVolumeSlider = document.getElementById('volume-typing');
const playbackVolumeSlider = document.getElementById('volume-playback');

if (typingVolumeSlider) {
    window.typingVolume = typingVolumeSlider.value;
    typingVolumeSlider.addEventListener('input', (event) => {
        window.typingVolume = event.target.value;
    });
}

if (playbackVolumeSlider) {
    window.playbackVolume = playbackVolumeSlider.value;
    playbackVolumeSlider.addEventListener('input', (event) => {
        window.playbackVolume = event.target.value;
    });
}

// --- Morse Guide Toggle Logic --- //

const morseGuideToggle = document.getElementById('morse-guide-toggle');

if (morseGuideToggle) {
    if (typeof window.isMorseGuideActive !== 'undefined') {
        window.isMorseGuideActive = morseGuideToggle.checked;
    }

    morseGuideToggle.addEventListener('change', (event) => {
        if (typeof window.isMorseGuideActive !== 'undefined') {
            window.isMorseGuideActive = event.target.checked;
            if (!practiceToggleElement.classList.contains('is-hidden')) {
                if (typeof window.restartMorsePractice === 'function') {
                    window.restartMorsePractice();
                }
            }
        }
    });
}

// 初期状態でスタート画面を表示
document.addEventListener('DOMContentLoaded', showStartScreen);
