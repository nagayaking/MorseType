document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatContainer = document.getElementById('realtime-chat-container');
    const chatMorseButton = document.getElementById('chat-morse-button');
    const chatSubmitButton = document.getElementById('chat-submit-btn');
    const chatText = document.getElementById('chat-text');
    const chatToggleElement = document.getElementById('chatToggleElement');

    // WebSocket
    let socket;

    // Morse Code Logic Variables
    const morseToJapaneseMap = {
        "ーー・ーー":"あ","・ー":"い","・・ー":"う","ー・ーーー":"え","・ー・・・":"お",
        "・ー・・":"か","ー・ー・・":"き","・・・ー":"く","ー・ーー":"け","ーーーー":"こ",
        "ー・ー・ー":"さ","ーー・ー・":"し","ーーー・ー":"す","・ーーー・":"せ","ーーー・":"そ",
        "ー・":"た","・・ー・":"ち","・ーー・":"つ","・ー・ーー":"て","・・ー・・":"と",
        "・ー・":"な","ー・ー・":"に","・・・・":"ぬ","ーー・ー":"ね","・・ーー":"の",
        "ー・・・":"は","ーー・・ー":"ひ","ーー・・":"ふ","・":"へ","ー・・":"ほ",
        "ー・・ー":"ま","・・ー・ー":"み","ー":"む","ー・・・ー":"め","ー・・ー・":"も",
        "・ーー":"や","ー・・ーー":"ゆ","ーー":"よ",
        "・・・":"ら","ーー・":"り","ー・ーー・":"る","ーーー":"れ","・ー・ー":"ろ",
        "ー・ー":"わ","・ー・・ー":"ゐ","・ーー・・":"ゑ","・ーーー":"を","・ー・ー・":"ん",
        "・・":"゛", "・・ーー・":"゜", "・ーー・ー":"ー", "・ー・ー・ー":"、"
    };

    let startTime = 0;
    let endTime = 0;
    let judgeTime = 200; // ms
    let conversionTimeoutId;
    let currentMorseSequence = "";
    let composedText = "";

    // Audio
    let audioCtx;
    let oscillator = null;

    // --- WebSocket Logic ---
    function connect() {
        if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
            socket.close();
        }
        socket = new WebSocket('ws://localhost:8080');

        socket.onopen = function(e) {
            console.log("[open] Connection established");
            displayStatusMessage('サーバーに接続しました。', 'success');
        };

        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log(`[message] Data received from server:`, data);

            switch (data.type) {
                case 'user':
                    displayChatMessage(data.message, 'model');
                    break;
                case 'info':
                    displayStatusMessage(data.message, 'info');
                    break;
                default:
                    // For history messages that are just strings
                    try {
                        const histData = JSON.parse(event.data);
                        if(histData.type === 'user') {
                             displayChatMessage(histData.message, 'model');
                        }
                    } catch(e) {
                        // if it is not a json, it might be an old message format, ignore
                        console.log("Received non-JSON message, likely old format.");
                    }
                    break;
            }
        };

        socket.onclose = function(event) {
            console.log('[close] Connection closed.');
            displayStatusMessage('サーバーから切断されました。', 'error');
        };

        socket.onerror = function(error) {
            console.log(`[error] ${error.message}`);
        };
    }

    function displayChatMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = type; // 'user' or 'model'
        messageEl.textContent = message;
        chatContainer.appendChild(messageEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function displayStatusMessage(message, type) {
        const statusMsg = document.createElement('div');
        let className = 'system'; // Default to error
        if (type === 'success') {
            className = 'system-success';
        } else if (type === 'info') {
            className = 'system-info';
        }
        statusMsg.className = className;
        statusMsg.textContent = message;
        chatContainer.appendChild(statusMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // --- Morse Code Input Logic ---
    function chatMouseDown() {
        startTime = performance.now();
        clearTimeout(conversionTimeoutId);

        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        if (oscillator) {
            oscillator.stop();
        }

        oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.frequency.value = 880;
        oscillator.type = 'sine';
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        const volume = typeof window.typingVolume !== 'undefined' ? window.typingVolume : 0.5;
        gainNode.gain.setValueAtTime(parseFloat(volume), audioCtx.currentTime);
        oscillator.start();
    }

    function chatMouseUp() {
        endTime = performance.now();
        const intervalTime = endTime - startTime;
        const morseChar = (intervalTime <= judgeTime) ? "・" : "ー";
        
        currentMorseSequence += morseChar;
        updateChatInput();

        conversionTimeoutId = setTimeout(() => convertMorseToJapanese(currentMorseSequence), judgeTime * 2);

        if (oscillator) {
            oscillator.stop();
            oscillator = null;
        }
    }

    function chatMouseLeave() {
        if (oscillator) {
            oscillator.stop();
            oscillator = null;
        }
        clearTimeout(conversionTimeoutId);
    }

    function convertMorseToJapanese(sequence) {
        if (morseToJapaneseMap[sequence]) {
            composedText += morseToJapaneseMap[sequence];
        }
        currentMorseSequence = "";
        updateChatInput();
    }

    function updateChatInput() {
        chatText.textContent = composedText + currentMorseSequence;
    }

    // --- Event Listeners ---
    chatMorseButton.addEventListener('mousedown', chatMouseDown);
    chatMorseButton.addEventListener('mouseup', chatMouseUp);
    chatMorseButton.addEventListener('mouseout', chatMouseLeave);

    chatSubmitButton.addEventListener('click', () => {
        if (currentMorseSequence) {
            convertMorseToJapanese(currentMorseSequence);
        }

        const message = composedText.trim();
        if (message && socket && socket.readyState === WebSocket.OPEN) {
            const payload = JSON.stringify({ type: 'user', message: message });
            socket.send(payload);
            displayChatMessage(message, 'user');

            composedText = "";
            currentMorseSequence = "";
            updateChatInput();
        } else {
            console.log("Cannot send message. Socket not open or message is empty.");
        }
    });

    // Establish connection once the page loads and keep it open
    connect();
});