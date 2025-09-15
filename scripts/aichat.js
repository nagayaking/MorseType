// APIキーをここに設定してください
let API_KEY ="";

// APIキーを取得
function clickBtn() {
    const pass = document.getElementById("APIkey");
    API_KEY = pass.value;
}

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const aiText = document.getElementById("aitext");

// 会話履歴を保存する配列
let history = []; 

// ユーザーとモデルの役割を定義
const userRole = 'user';
const modelRole = 'model';

// メッセージをチャットコンテナに表示する関数
function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender);

    if (sender === modelRole) {
        const messageContent = document.createElement('span');
        messageContent.textContent = message;
        messageContent.style.display = 'none'; // デフォルトで非表示

        const toggleButton = document.createElement('button');
        toggleButton.classList.add('toggle-button');
        toggleButton.title = 'ひらがなを表示';

        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-eye-slash'); // 初期アイコンを非表示状態に
        toggleButton.appendChild(icon);

        toggleButton.addEventListener('click', () => {
            const isHidden = messageContent.style.display === 'none';
            messageContent.style.display = isHidden ? '' : 'none';
            icon.classList.toggle('fa-eye', isHidden);
            icon.classList.toggle('fa-eye-slash', !isHidden);
        });

        messageDiv.appendChild(toggleButton);
        messageDiv.appendChild(messageContent);
    } else {
        messageDiv.textContent = message;
    }

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

const japaneseToMorseMap = {
  "あ":"ーー・ーー","い":"・ー","う":"・・ー","え":"ー・ーーー","お":"・ー・・・",
  "か":"・ー・・","き":"ー・ー・・","く":"・・・ー","け":"ー・ーー","こ":"ーーーー",
  "さ":"ー・ー・ー","し":"ーー・ー・","す":"ーーー・ー","せ":"・ーーー・","そ":"ーーー・",
  "た":"ー・","ち":"・・ー・","つ":"・ーー・","て":"・ー・ーー","と":"・・ー・・",
  "な":"・ー・","に":"ー・ー・","ぬ":"・・・・","ね":"ーー・ー","の":"・・ーー",
  "は":"ー・・・","ひ":"ーー・・ー","ふ":"ーー・・","へ":"・","ほ":"ー・・",
  "ま":"ー・・ー","み":"・・ー・ー","む":"ー","め":"ー・・・ー","も":"ー・・ー・",
  "や":"・ーー","ゆ":"ー・・ーー","よ":"ーー",
  "ら":"・・・","り":"ーー・","る":"ー・ーー・","れ":"ーーー","ろ":"・ー・ー",
  "わ":"ー・ー","ゐ":"・ー・・ー","ゑ":"・ーー・・","を":"・ーーー","ん":"・ー・ー・",

  "゛":"・・",//濁点
  "゜":"・・ーー・",//半濁点
  "ー":"・ーー・ー",//長音
  "、":"・ー・ー・ー"//読点
};



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
  aiText.textContent = screenText.join("");
  aiID = setTimeout(conversionToJapanese, judgeTime, bufferMorseCode, morseToJapaneseMap);
  
  if (aiOscillator) {
    aiOscillator.stop();
    aiOscillator = null;
  }
}

// 文字を変換して画面に表示する
function conversionToJapanese(string, base) {
  if (string === bufferMorseCode && base[string]!==undefined ) {
    text += base[string];
  }
  bufferMorseCode = "";
  screenText = [text, bufferMorseCode];
  aiText.textContent = screenText.join("");
}

function aiMouseLeave() {
  if (aiOscillator) {
    aiOscillator.stop();
    aiOscillator = null;
  }
  clearTimeout(aiID);
}

// Send message on Enter key
const sendBtn = document.getElementById('send-btn');
if (sendBtn) {
  sendBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Stop default behavior
      sendMessage();
    }
  });                                               
}                                                       

function replaceWithMap(input, map) {
  // すべてのキーを正規表現のORでまとめてパターン作成
  const pattern = new RegExp(Object.keys(map).join('|'), 'g');
  // 一致した部分だけを map に従って置換
  return input.replace(pattern, match => map[match]);
}

/**
 * ひらがなの文字列をカタカナに変換します。（モダンな書き方）
 * ひらがな以外の文字はすべて除去されます。
 * @param {string} inputText - 変換したい文字列
 * @returns {string} カタカナに変換された文字列
 */
function converJapaneseToMorse(inputText) {
  let outputText = replaceWithMap(inputText, conversionMap);
  return outputText
    .split('') // 1. 文字列を1文字ずつの配列に分解
    .map(char => japaneseToMorseMap[char]) // 2. 各文字をモールス信号に変換（ひらがな以外は undefined になる）
    .filter(Boolean) // 3. undefined や空文字などの「偽」の値を配列から除去
    .join('|'); // 4. 配列の要素を結合して文字列に戻す
}

// --- Send Message Logic ---

async function sendMessage() {
  const userMessage = text.trim();
  if (userMessage === '') return;
  console.log(userMessage)
    // Add user's message to chat and history
    addMessageToChat(userRole, userMessage);
    addMessageToHistory(userRole, userMessage);
    text = "";
    screenText =["",""];
    aiText.textContent = screenText.join("");
    

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
        const geminiResponse = [data.candidates[0].content.parts[0].text, converJapaneseToMorse(data.candidates[0].content.parts[0].text)];
        
        // Add Gemini's response to chat and history
        addMessageToChat(modelRole, geminiResponse[0]);
        addMessageToHistory(modelRole, geminiResponse[0]);
        console.log(geminiResponse)

    } catch (error) {
        console.error('API呼び出しエラー:', error);
        addMessageToChat('system', 'エラーが発生しました。もう一度お試しください。');
    }
}