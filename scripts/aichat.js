// APIキーをここに設定してください
let API_KEY ="";

// APIキーを取得
function clickBtn() {
    const pass = document.getElementById("APIkey");
    API_KEY = pass.value;
}

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');

// 会話履歴を保存する配列
let history = []; 

// ユーザーとモデルの役割を定義
const userRole = 'user';
const modelRole = 'model';

// メッセージをチャットコンテナに表示する関数
function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender);
    messageDiv.textContent = message;
    chatContainer.appendChild(messageDiv);
    
    // スクロールを一番下にする
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// メッセージを履歴に追加する関数
function addMessageToHistory(role, text) {
  history.push({
    role: role,
    parts: [{ text: text }]
  });
}

// --- Audio and Event Listeners for AI Chat Button ---

let aiAudioCtx;
let aiOscillator = null;


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
  
  "・・":"゛",//濁点
  "・・ーー・":"゜",//半濁点
  "・ーー・ー":"ー",//長音
  "・ー・ー・ー":"、"//読点
}

let startTime = 0;
let endTime = 0;
let intervalTime = 0;
let judgeTime = 200;
let aiID;
let currentMorseCode = "";
let bufferMorseCode = "";
let text = "";
let screenText = ["",""];

// Function to start the sound
function aiMouseDown() {
  startTime = performance.now();
  clearTimeout(aiID);

  if (!aiAudioCtx) {
    aiAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  // Stop any previous sound
  if (aiOscillator) {
    aiOscillator.stop();
  }

  aiOscillator = aiAudioCtx.createOscillator();
  const gainNode = aiAudioCtx.createGain();
  
  aiOscillator.frequency.value = 880;
  aiOscillator.type = 'sine';
  aiOscillator.connect(gainNode);
  gainNode.connect(aiAudioCtx.destination);
  
  // Use morseGain from morse.js if available, otherwise default
  const volume = typeof morseGain !== 'undefined' ? morseGain : 0.5;
  gainNode.gain.setValueAtTime(volume, aiAudioCtx.currentTime);
  
  aiOscillator.start();
}

// Function to stop the sound
function aiMouseUp() {
  endTime = performance.now();
  intervalTime = endTime -startTime;

  if (intervalTime <= judgeTime) {
    currentMorseCode = "・";
  } else {
    currentMorseCode = "ー";
  }

  bufferMorseCode += currentMorseCode;
  screenText[1] = bufferMorseCode;
  document.getElementById("aitext").textContent = screenText.join("");
  aiID = setTimeout(conversion, judgeTime, bufferMorseCode, morseToJapaneseMap);

  if (aiOscillator) {
    aiOscillator.stop();
    aiOscillator = null;
  }
}

// 文字を変換して画面に表示する
function conversion(string, base) {
  if (string === bufferMorseCode && base[string]!==undefined ) {
    text += base[string];
  }
  bufferMorseCode = "";
  screenText = [text, bufferMorseCode];
  document.getElementById("aitext").textContent = screenText.join("");
}

function aiMouseLeave() {
  if (aiOscillator) {
    aiOscillator.stop();
    aiOscillator = null;
  }
  clearTimeout(aiID);
}

// Send message on Enter key
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// --- Send Message Logic ---

async function sendMessage() {
    if (text.trim() === '') return;

    // Add user's message to chat and history
    addMessageToChat(userRole, userMessage);
    addMessageToHistory(userRole, userMessage);
    text = "";
    screenText =["",""];

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: "あなたはユーザーの質問に日常会話のように親しみやすい口調で回答してください。敬語は使わず、簡潔に話してください。また会話は一文で返答してください。ひらがなと長音、句読点以外は使わないでください。" }]
                },
                contents: history
            })
        });

        const data = await response.json();
        const geminiResponse = data.candidates[0].content.parts[0].text;
        
        // Add Gemini's response to chat and history
        addMessageToChat(modelRole, geminiResponse);
        addMessageToHistory(modelRole, geminiResponse);

    } catch (error) {
        console.error('API呼び出しエラー:', error);
        addMessageToChat('system', 'エラーが発生しました。もう一度お試しください。');
    }
}