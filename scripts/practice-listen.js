const listeningExample = [
  ["今日はいい天気だ", "きょうはいいてんきだ"],
  ["桜が咲いている", "さくらがさいている"],
  ["猫が窓の外にいる", "ねこがまどのそとにいる"],
  ["風が心地よい", "かぜがここちよい"],
  ["美しい海を見た", "うつくしいうみをみた"],
  ["本を読む時間", "ほんをよむじかん"],
  ["月が輝いている", "つきがかがやいている"],
  ["静かな夜の森", "しずかなよるのもり"],
  ["少年が走る", "しょうねんがはしる"],
  ["雨音を聞く", "あまおとをきく"],
  ["光が差し込む", "ひかりがさしこむ"],
  ["山道を歩く", "やまみちをあるく"],
  ["鳥の歌が響く", "とりのうたがひびく"], 
  ["夢を追いかける", "ゆめをおいかける"],
  ["花びら舞い落ちる", "はなびらまいおちる"],
  ["星が瞬く夜", "ほしがまたたくよる"],
  ["川のせせらぎ", "かわのせせらぎ"],
  ["友と語らう", "ともとかたらう"],
  ["音楽を感じる", "おんがくをかんじる"],
  ["心に希望を", "こころにきぼうを"],
  ["川で石を投げる", "かわでいしをなげる"],
  ["机の上に本がある", "つくえのうえにほんがある"],
  ["夕日が沈む海岸", "ゆうひがしずむかいがん"],
  ["山頂からの眺め", "さんちょうからのながめ"],
  ["春の風に吹かれる", "はるのかぜにふかれる"],
  ["冷たい雨が降る", "つめたいあめがふる"],
  ["小鳥が歌う朝", "ことりがうたうあさ"],
  ["星空に願いを込める", "ほしぞらにねがいをこめる"],
  ["街灯が灯る夜道", "がいとうがともるよみち"],
  ["雪が舞い落ちる", "ゆきがまいおちる"],
  ["灯台が海を守る", "とうだいがうみをまもる"],
  ["春雨が優しい", "はるさめがやさしい"],
  ["笑顔がこぼれる", "えがおがこぼれる"],
  ["虹が橋を架ける", "にじがはしをかける"],
  ["花の香りが漂う", "はなのかおりがただよう"],
  ["川辺で本を読む", "かわべでほんをよむ"],
  ["風鈴の音が涼しい", "ふうりんのおとがすずしい"],
  ["朝露が光る草", "あさつゆがひかるくさ"],
  ["月夜に歌う虫", "つきよにうたうむし"],
  ["希望の朝が来る", "きぼうのあさがくる"]
];

const questionStatement = document.getElementById("question-statement");
const firstChoice = document.getElementById("choice1");
const secondChoice = document.getElementById("choice2");
const thirdChoice = document.getElementById("choice3");
const fourthChoice = document.getElementById("choice4");
const feedbackOverlay = document.getElementById("feedback-overlay");
let questionNumber = 0;
const choiceArray = [firstChoice, secondChoice, thirdChoice, fourthChoice];

let listenShuffledExample = shuffleArray(listeningExample);

//リセットが必要なもの
let questionAnswer = listenShuffledExample[questionNumber]
let choices = selectChoices(listenShuffledExample, questionAnswer);
let answerNumber = choices.indexOf(questionAnswer);

function selectChoices(array, answer) {
  // 修正点1: 配列の中身を比較してフィルタリングする
  // n[0]とanswer[0]、かつ、n[1]とanswer[1]が一致するものを除外する
  const otherElements = array.filter(n => n[0] !== answer[0] || n[1] !== answer[1]);
  // 1. `answer` 以外の要素をシャッフルし、先頭から3つを取得します。
  const selectedElements = shuffleArray(otherElements).slice(0, 3);

  // 2. 取得した3つの要素に `answer` を加えた4つの要素の配列を作成します。
  const finalArray = [...selectedElements, answer];

  // 3. 最後に、4つの要素が含まれた配列全体をシャッフルして返します。
  return shuffleArray(finalArray);
}

//画面に選択肢を表示
function screenShift(array) {
  for(let i = 0; i < 4; i ++){
    choiceArray[i].textContent = array[i][0];
  }
}

screenShift(choices);

function showFeedback(isCorrect) {
  feedbackOverlay.classList.remove("correct", "incorrect", "animate");
  void feedbackOverlay.offsetWidth; // Trigger reflow

  if (isCorrect) {
    feedbackOverlay.textContent = "正解";
    feedbackOverlay.classList.add("correct");
  } else {
    feedbackOverlay.textContent = "不正解";
    feedbackOverlay.classList.add("incorrect");
  }

  feedbackOverlay.classList.add("animate");

  setTimeout(() => {
    feedbackOverlay.classList.remove("animate");
    if(isCorrect) {
        questionNumber++;
        questionAnswer = listenShuffledExample[questionNumber];
        choices = selectChoices(listenShuffledExample, questionAnswer);
        screenShift(choices);
    }
  }, 1000);
}

choiceArray.forEach(button => {
  button.addEventListener("click", (event) => {
    stopMorseSound(); // 音を即座に停止

    const clickedChoiceText = event.target.textContent;
    const isCorrect = clickedChoiceText === questionAnswer[0];
    showFeedback(isCorrect);
  });
});

// --- ここから追加 ---

const morseCodeMap = {
  'ア': '--.--', 'イ': '.-', 'ウ': '..-', 'エ': '-.---', 'オ': '.-...',
  'カ': '.-..', 'キ': '-.-..', 'ク': '...-', 'ケ': '-.--', 'コ': '----',
  'サ': '-.-.-', 'シ': '--.-.', 'ス': '---.-', 'セ': '.---.', 'ソ': '---.',
  'タ': '-.', 'チ': '..-.', 'ツ': '.--.', 'テ': '.-.--', 'ト': '..-..',
  'ナ': '.-.', 'ニ': '-.-.', 'ヌ': '....', 'ネ': '--.-', 'ノ': '..--',
  'ハ': '-...', 'ヒ': '--..-', 'フ': '--..', 'ヘ': '.', 'ホ': '-..',
  'マ': '-..-', 'ミ': '..-.-', 'ム': '-', 'メ': '-...-', 'モ': '-..-.',
  'ヤ': '.--', 'ユ': '-..--', 'ヨ': '--',
  'ラ': '...', 'リ': '--.', 'ル': '-.--.', 'レ': '---', 'ロ': '.-.-',
  'ワ': '-.-', 'ヰ': '.-..-', 'ヱ': '.--..', 'ヲ': '.---',
  'ン': '.-.-.',
  'ガ': '.-..', 'ギ': '-.-..', 'グ': '...-', 'ゲ': '-.--', 'ゴ': '----',
  'ザ': '-.-.-', 'ジ': '--.-.', 'ズ': '---.-', 'ゼ': '.---.', 'ゾ': '---.',
  'ダ': '-.', 'ヂ': '..-.', 'ヅ': '.--.', 'デ': '.-.--', 'ド': '..-..',
  'バ': '-...', 'ビ': '--..-', 'ブ': '--..', 'ベ': '.', 'ボ': '-..',
  'パ': '-...', 'ピ': '--..-', 'プ': '--..', 'ペ': '.', 'ポ': '-..',
  '゛': '..',
  '゜': '..--.',
  '、': '.-.-.-', '。': '.-.-..', 'ー': '.--.-', '（': '-.--.-', '）': '.-..-.',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----'
};

// カタカナをひらがなに変換
function katakanaToHiragana(text) {
  return text.replace(/[ァ-ン]/g, s => String.fromCharCode(s.charCodeAt(0) - 0x60));
}

// テキストをモールス信号に変換
function textToMorse(text) {
    const hiraganaText = katakanaToHiragana(text);
    let morseString = '';
    for (let i = 0; i < hiraganaText.length; i++) {
        let char = hiraganaText[i];
        let nextChar = hiraganaText[i + 1];
        
        // 濁点・半濁点の処理
        if (nextChar === '゛' || nextChar === '゜') {
            let combined = char + nextChar;
            // マップに合致する文字を探す（例：「か゛」を「ガ」として探す）
            let found = Object.keys(morseCodeMap).find(key => katakanaToHiragana(key) === combined);
            if (found) {
                morseString += morseCodeMap[found] + ' ';
                i++; // 2文字分進める
                continue;
            }
        }
        
        // 通常の文字
        let found = Object.keys(morseCodeMap).find(key => katakanaToHiragana(key) === char);
        if (found) {
            morseString += morseCodeMap[found] + ' ';
        }
    }
    return morseString.trim();
}


const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let isPlaying = false;

// 再生中の音源とタイマーを管理するオブジェクト
let activeMorseSound = {
    oscillators: [],
    timeouts: []
};

// 再生中の音とタイマーをすべて停止する関数
function stopMorseSound() {
    activeMorseSound.oscillators.forEach(osc => {
        try {
            osc.stop();
        } catch (e) {
            // 既に停止しているオシレーターでエラーが出ても無視する
        }
    });
    activeMorseSound.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    activeMorseSound.oscillators = [];
    activeMorseSound.timeouts = [];
    isPlaying = false;
}

function playTone(duration, frequency = 600) {
  return new Promise(resolve => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(parseFloat(window.playbackVolume || 0.5), audioContext.currentTime);
    
    activeMorseSound.oscillators.push(oscillator); // 管理リストに追加

    oscillator.start();
    const timeoutId = setTimeout(() => {
      oscillator.stop();
      resolve();
    }, duration);
    activeMorseSound.timeouts.push(timeoutId); // 管理リストに追加
  });
}

function sleep(ms) {
  return new Promise(resolve => {
    const timeoutId = setTimeout(resolve, ms);
    activeMorseSound.timeouts.push(timeoutId); // 管理リストに追加
  });
}

async function playMorse(morseCode) {
  if (isPlaying) {
      stopMorseSound();
  }
  isPlaying = true;

  // isPlayingフラグがfalseになったら再生を中断するためのチェック
  const playExecution = async () => {
    const dotDuration = 80;
    const dashDuration = dotDuration * 3;
    const symbolSpace = dotDuration;
    const letterSpace = dotDuration * 3;

    for (const symbol of morseCode) {
      if (!isPlaying) break; // 再生がキャンセルされたかチェック
      switch (symbol) {
        case '.':
          await playTone(dotDuration);
          await sleep(symbolSpace);
          break;
        case '-':
          await playTone(dashDuration);
          await sleep(symbolSpace);
          break;
        case ' ':
          await sleep(letterSpace - symbolSpace);
          break;
      }
    }
  };

  await playExecution();
  // 正常に最後まで再生された場合もステータスをリセット
  if (isPlaying) {
      stopMorseSound();
  }
}

const questionListenButton = document.getElementById('question-listen');
questionListenButton.addEventListener('click', () => {
  // questionAnswer[1] には "きょうはいいてんきだ" のようなひらがな文字列が入っている
  const morse = textToMorse(questionAnswer[1]);
  console.log(`Playing: ${questionAnswer[1]} -> ${morse}`);
  playMorse(morse);
});
