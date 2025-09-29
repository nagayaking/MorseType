// DOM要素の取得
const header = document.querySelector('header');
const settingsToggleButton = document.getElementById("settingsToggleButton");


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

const timeAttackRadio = document.getElementById('timeAttackRadio');
const startPracticeGameButton = document.getElementById('startPracticeGameButton');
const backToStartScreenFromMode = document.getElementById('backToStartScreenFromMode');

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
    // 選択されたモードをグローバル変数に保存
    window.selectedPracticeMode = timeAttackRadio.checked ? 'timeAttack' : 'scoreAttack';

    hideAllPages();
    practiceToggleElement.classList.remove('is-hidden');
    header.classList.remove('header-hidden');
    
    // ゲーム開始の合図を送る
    if (typeof window.startPracticeGame === 'function') {
        window.startPracticeGame();
    }
}

// --- イベントリスナーの設定 ---

// スタート画面の「タイピング練習」ボタン -> モード選択画面へ
startPracticeButton.addEventListener('click', showModeSelectionScreen);

// モード選択画面の「スタート」ボタン -> タイピング練習画面へ
startPracticeGameButton.addEventListener('click', showTypingPracticeScreen);

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

// --- Morse Visible Toggle Logic --- //

const morseVisibleToggle = document.getElementById('morse-visible-toggle');
const morseJapaneseDisplay = document.getElementById('morseJapanese'); 
const morseGuideOptionItem = morseGuideToggle.closest('.mode-option-item');

if (morseVisibleToggle && morseJapaneseDisplay && morseGuideToggle && morseGuideOptionItem) {
    // Function to set the disabled state of the guide toggle
    const setGuideDisabledState = () => {
        const isVisible = morseVisibleToggle.checked;
        morseGuideToggle.disabled = !isVisible;
        if (isVisible) {
            morseGuideOptionItem.classList.remove('is-disabled');
        } else {
            morseGuideOptionItem.classList.add('is-disabled');
        }
    };

    // Set initial state for visibility and disabled status
    window.isMorseVisible = morseVisibleToggle.checked;
    if (!window.isMorseVisible) {
        morseJapaneseDisplay.classList.add('is-invisible');
    }
    setGuideDisabledState();

    // Add listener for visibility toggle
    morseVisibleToggle.addEventListener('change', (event) => {
        window.isMorseVisible = event.target.checked;
        if (window.isMorseVisible) {
            morseJapaneseDisplay.classList.remove('is-invisible');
        } else {
            morseJapaneseDisplay.classList.add('is-invisible');
        }
        setGuideDisabledState();
    });
}


// 初期状態でスタート画面を表示
document.addEventListener('DOMContentLoaded', () => {
    showStartScreen();

    // --- Start Screen Menu Logic ---
    const startMenuToggle = document.getElementById('start-menu-toggle');
    const startMenuPanel = document.getElementById('start-menu-panel');
    const settingsMenuLink = document.getElementById('settings-menu-link');

    if (startMenuToggle && startMenuPanel) {
        startMenuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            startMenuPanel.classList.toggle('is-hidden');
        });

        document.addEventListener('click', (event) => {
            if (!startMenuPanel.classList.contains('is-hidden') && !startMenuPanel.contains(event.target)) {
                startMenuPanel.classList.add('is-hidden');
            }
        });
    }

    if (settingsMenuLink) {
        settingsMenuLink.addEventListener('click', (event) => {
            event.preventDefault();
            if (typeof openSettings === 'function') {
                openSettings();
            }
            startMenuPanel.classList.add('is-hidden');
        });
    }
});
