// screen-switch.js の全体をこちらに書き換えます

const practiceToggleButton = document.getElementById("practiceToggleButton");
const practiceToggleElement = document.getElementById("practiceToggleElement");

const aiChatToggleButton = document.getElementById("aiChatToggleButton");
const aiChatToggleElement = document.getElementById("aiChatToggleElement");

// 「練習」ボタンがクリックされたときの処理
practiceToggleButton.addEventListener('click', () => {
    // 表示する要素から is-hidden を削除
    practiceToggleElement.classList.remove('is-hidden');
    // 非表示にする要素に is-hidden を追加
    aiChatToggleElement.classList.add('is-hidden');

    // morse.jsで定義したリスタート関数を呼び出す
    if (typeof window.restartMorsePractice === 'function') {
        window.restartMorsePractice();
    }
});

// 「AIチャット」ボタンがクリックされたときの処理
aiChatToggleButton.addEventListener( "click", () => {
    // 表示する要素から is-hidden を削除
    aiChatToggleElement.classList.remove('is-hidden');
    // 非表示にする要素に is-hidden を追加
    practiceToggleElement.classList.add('is-hidden');
});
