// APIキーをここに設定してください
let API_KEY ="";

// APIキーを取得
function clickBtn() {
    const pass = document.getElementById("APIkey");
    API_KEY = pass.value;
}

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

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

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userMessage = userInput.value;
    if (userMessage.trim() === '') return;

    // ユーザーのメッセージを画面と履歴に追加
    addMessageToChat(userRole, userMessage);
    addMessageToHistory(userRole, userMessage);
    userInput.value = '';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // ここにsystem_instructionを追加します
                system_instruction: {
                  parts: [{ text: "あなたはユーザーの質問に日常会話のように親しみやすい口調で回答してください。敬語は使わず、簡潔に話してください。また会話は一文で返答してください。ひらがなと長音、句読点以外は使わないでください。" }]
                },
                // history配列をAPIリクエストのcontentsに設定
                contents: history
            })
        });

        const data = await response.json();
        const geminiResponse = data.candidates[0].content.parts[0].text;
        
        // Geminiの応答を画面と履歴に追加
        addMessageToChat(modelRole, geminiResponse);
        addMessageToHistory(modelRole, geminiResponse);

    } catch (error) {
        console.error('API呼び出しエラー:', error);
        addMessageToChat('system', 'エラーが発生しました。もう一度お試しください。');
    }
}