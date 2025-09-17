// screen-switch.js の全体をこちらに書き換えます

const practiceToggleButton = document.getElementById("practiceToggleButton");
const practiceToggleElement = document.getElementById("practiceToggleElement");

const aiChatToggleButton = document.getElementById("aiChatToggleButton");
const aiChatToggleElement = document.getElementById("aiChatToggleElement");

const settingsToggleButton = document.getElementById("settingsToggleButton");
const settingsScreen = document.getElementById("settings-screen");
const closeBtn = document.querySelector('.close-btn');
const overlay = document.getElementById('overlay');

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

function openSettings() {
    settingsScreen.classList.add('is-active');
    overlay.classList.add('is-active');
}

function closeSettings() {
    settingsScreen.classList.remove('is-active');
    overlay.classList.remove('is-active');
}

// Open settings with the gear icon
settingsToggleButton.addEventListener('click', openSettings);

// Close settings with the 'X' button
closeBtn.addEventListener('click', closeSettings);

// Close settings by clicking on the overlay
overlay.addEventListener('click', closeSettings);

// Prevent clicks inside the settings screen from closing it
settingsScreen.addEventListener('click', (event) => {
    event.stopPropagation();
});

// --- Volume Control Logic --- //

const typingVolumeSlider = document.getElementById('volume-typing');
const playbackVolumeSlider = document.getElementById('volume-playback');

// Set initial volumes and make them globally accessible
window.typingVolume = typingVolumeSlider.value;
window.playbackVolume = playbackVolumeSlider.value;

typingVolumeSlider.addEventListener('input', (event) => {
    window.typingVolume = event.target.value;
});

playbackVolumeSlider.addEventListener('input', (event) => {
    window.playbackVolume = event.target.value;
});

// --- Morse Guide Toggle Logic --- //

const morseGuideToggle = document.getElementById('morse-guide-toggle');

// Set initial state from the checkbox's default
if (typeof window.isMorseGuideActive !== 'undefined') {
    window.isMorseGuideActive = morseGuideToggle.checked;
}

morseGuideToggle.addEventListener('change', (event) => {
    if (typeof window.isMorseGuideActive !== 'undefined') {
        window.isMorseGuideActive = event.target.checked;
        // If the practice screen is active, restart it to apply the change
        if (!practiceToggleElement.classList.contains('is-hidden')) {
            if (typeof window.restartMorsePractice === 'function') {
                window.restartMorsePractice();
            }
        }
    }
});
