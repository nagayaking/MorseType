// screen-switch.js の全体をこちらに書き換えます

const practiceToggleButton = document.getElementById("practiceToggleButton");
const practiceToggleElement = document.getElementById("practiceToggleElement");

const aiChatToggleButton = document.getElementById("aiChatToggleButton");
const aiChatToggleElement = document.getElementById("aiChatToggleElement");

const settingsToggleButton = document.getElementById("settingsToggleButton");
const settingsScreen = document.getElementById("settings-screen");
const closeBtn = document.querySelector('.close-btn');

// 「練習」ボタンがクリックされたときの処理
practiceToggleButton.addEventListener('click', () => {
    practiceToggleElement.classList.remove('is-hidden');
    aiChatToggleElement.classList.add('is-hidden');
    if (typeof window.restartMorsePractice === 'function') {
        window.restartMorsePractice();
    }
});

// 「AIチャット」ボタンがクリックされたときの処理
aiChatToggleButton.addEventListener( "click", () => {
    aiChatToggleElement.classList.remove('is-hidden');
    practiceToggleElement.classList.add('is-hidden');
});

// --- Settings Screen Logic --- //

// Open settings with the gear icon
settingsToggleButton.addEventListener('click', (event) => {
    // このイベントがbodyのリスナーに伝わってすぐに画面が閉じるのを防ぐ
    event.stopPropagation(); 
    settingsScreen.classList.add('is-active');
});

// Close settings with the 'X' button
closeBtn.addEventListener('click', () => {
    settingsScreen.classList.remove('is-active');
});

// Stop propagation when clicking inside the settings screen
// これがないと、設定画面内のクリックもbodyのリスナーに拾われて画面が閉じてしまう
settingsScreen.addEventListener('click', (event) => {
    event.stopPropagation();
});

// Close settings when clicking outside (on the main content)
document.body.addEventListener('click', () => {
    if (settingsScreen.classList.contains('is-active')) {
        settingsScreen.classList.remove('is-active');
    }
});