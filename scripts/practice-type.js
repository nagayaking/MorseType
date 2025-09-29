let ddtime=0;
let blanktime=0;
window.morseInterval = 200;
let id;
let word = "";
let words=[];
let num = 0;
var morseGain = 0.5;

// --- Game Mode Variables ---
let timerInterval;
let elapsedTimerInterval; // Timer for elapsed time in Time Attack
let score = 0;
let baseScorePerChar = 100;
let flawlessBonus = 0;
let mistakeMadeInChar = false;
let totalCharsTyped = 0;
let correctCharsTyped = 0;
let mistakeCount = 0;
const timeLimit = 60; // 60 seconds
let timeLeft = timeLimit;
let isGameActive = false;
const scoreAttackSentenceLimit = 5;
let sentenceCount = 0;
let sessionStartTime = 0;

// This will be controlled by the settings toggle
window.isMorseGuideActive = true;

// --- DOM Element Variables ---
let textJapaneseElement, textHuriganaElement, morseJapaneseElement, morseButton;
let gameStats, scoreElement;
let resultModal, finalScoreElement, retryButton, backToModeSelectionFromResult;
let accuracyStatElement, charsTypedStatElement, wpmStatElement, mistakesStatElement;

let audioCtx;

let oscillator = null;
let gainNode = null;

const morse_list_guide = {
  "ーー・ーー|":"あ","・ー|":"い","・・ー|":"う","ー・ーーー|":"え","・ー・・・|":"お",
  "・ー・・|":"か","ー・ー・・|":"き","・・・ー|":"く","ー・ーー|":"け","ーーーー|":"こ",
  "ー・ー・ー|":"さ","ーー・ー・|":"し","ーーー・ー|":"す","・ーーー・|":"せ","ーーー・|":"そ",
  "ー・|":"た","・・ー・|":"ち","・ーー・|":"つ","・ー・ーー|":"て","・・ー・・|":"と",
  "・ー・|":"な","ー・ー・|":"に","・・・・|":"ぬ","ーー・ー|":"ね","・・ーー|":"の",
  "ー・・・|":"は","ーー・・ー|":"ひ","ーー・・|":"ふ","・|":"へ","ー・・|":"ほ",
  "ー・・ー|":"ま","・・ー・ー|":"み","ー|":"む","ー・・・ー|":"め","ー・・ー・|":"も",
  "・ーー|":"や","ー・・ーー|":"ゆ","ーー|":"よ",
  "・・・|":"ら","ーー・|":"り","ー・ーー・|":"る","ーーー|":"れ","・ー・ー|":"ろ",
  "ー・ー|":"わ","・ー・・ー|":"ゐ","・ーー・・|":"ゑ","・ーーー|":"を","・ー・ー・|":"ん",

  "・・|":"゛",//濁点
  "・・ーー・|":"゜",//半濁点
  "・ーー・ー|":"ー",//長音
  "・ー・ー・ー|":"、"//読点
}

const morsecodeMap_guide = {
  "あ":"ーー・ーー|","い":"・ー|","う":"・・ー|","え":"ー・ーーー|","お":"・ー・・・|",
  "か":"・ー・・|","き":"ー・ー・・|","く":"・・・ー|","け":"ー・ーー|","こ":"ーーーー|",
  "さ":"ー・ー・ー|","し":"ーー・ー・|","す":"ーーー・ー|","せ":"・ーーー・|","そ":"ーーー・|",
  "た":"ー・|","ち":"・・ー・|","つ":"・ーー・|","て":"・ー・ーー|","と":"・・ー・・|",
  "な":"・ー・|","に":"ー・ー・|","ぬ":"・・・・|","ね":"ーー・ー|","の":"・・ーー|",
  "は":"ー・・・|","ひ":"ーー・・ー|","ふ":"ーー・・|","へ":"・|","ほ":"ー・・|",
  "ま":"ー・・ー|","み":"・・ー・ー|","む":"ー|","め":"ー・・・ー|","も":"ー・・ー・|",
  "や":"・ーー|","ゆ":"ー・・ーー|","よ":"ーー|",
  "ら":"・・・|","り":"ーー・|","る":"ー・ーー・|","れ":"ーーー|","ろ":"・ー・ー|",
  "わ":"ー・ー|","ゐ":"・ー・・ー|","ゑ":"・ーー・・|","を":"・ーーー|","ん":"・ー・ー・|",

  "゛":"・・|",//濁点
  "゜":"・・ーー・|",//半濁点
  "ー":"・ーー・ー|",//長音
  "、":"・ー・ー・ー|"//読点
};

const morse_list_no_guide = {
  "ーー・ーー":"あ","・ー":"い","・・ー":"う","ー・ーーー":"え","・ー・・・":"お",
  "・ー・・":"か","ー・ー・・":"き","・・・ー":"く","ー・ーー":"け","ーーーー":"こ",
  "ー・ー・ー":"さ","ーー・ー・":"し","ーーー・ー":"す","・ーーー・":"せ","ーーー・":"そ",
  "ー・":"た","・・ー・":"ち","・ーー・":"つ","・ー・ーー":"て","・・ー・・":"と",
  "・ー・":"な","ー・ー・":"に","・・・・":"ぬ","ーー・ー":"ね","・・ーー":"の",
  "ー・・・":"は","ーー・・ー":"ひ","ーー・・":"ふ","・":"へ","ー・・|":"ほ",
  "ー・・ー":"ま","・・ー・ー":"み","ー":"む","ー・・・ー":"め","ー・・ー・":"も",
  "・ーー":"や","ー・・ーー":"ゆ","ーー":"よ",
  "・・・":"ら","ーー・":"り","ー・ーー・":"る","ーーー":"れ","・ー・ー":"ろ",
  "ー・ー":"わ","・ー・・ー":"ゐ","・ーー・・":"ゑ","・ーーー":"を","・ー・ー・":"ん",

  "・・":"゛",//濁点
  "・・ーー・":"゜",//半濁点
  "・ーー・ー":"ー",//長音
  "・ー・ー・ー":"、"//読点
}

const morsecodeMap_no_guide = {
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

let morse_list = morse_list_guide;
let morsecodeMap = morsecodeMap_guide;

const conversionMap = {
  //濁音  
  'が': 'か゛', 'ぎ': 'き゛', 'ぐ': 'く゛', 'げ': 'け゛', 'ご': 'こ゛',
  'ざ': 'さ゛', 'じ': 'し゛', 'ず': 'す゛', 'ぜ': 'せ゛', 'ぞ': 'そ゛',
  'だ': 'た゛', 'ぢ': 'ち゛', 'づ': 'つ゛', 'で': 'て゛', 'ど': 'と゛',
  'ば': 'は゛', 'び': 'ひ゛', 'ぶ': 'ふ゛', 'べ': 'へ゛', 'ぼ': 'ほ゛',

  //半濁音
  'ぱ': 'は゜', 'ぴ': 'ひ゜', 'ぷ': 'ふ゜', 'ぺ': 'へ゜', 'ぽ': 'ほ゜',

  //小文字 → 大文字
  'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
  'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ',
  'ゎ': 'わ', 'っ': 'つ',
  'ゕ': 'か', 'ゖ': 'け'
}


const examples = [
  ["今日はりんごを食べました","きょうはりんごをたべました"],
  ["友達をぶった","ともだちをぶった"],
  ["明日は雨が降る", "あしたはあめがふる"],
  ["猫が窓から落ちた", "ねこがまどからおちた"],
  ["春が待ち遠しい", "はるがまちどおしい"],
  ["友達と映画を見た", "ともだちとえいがをみた"],
  ["宿題を忘れた", "しゅくだいをわすれた"],
  ["夏祭りに行こう", "なつまつりにいこう"],
  ["彼は走るのが速い", "かれははしるのがはやい"],
  ["電車が遅れている", "でんしゃがおくれている"],
  ["手紙を書いて送った", "てがみをかいておくった"],
  ["朝ごはんを食べた", "あさごはんをたべた"],
  ["花が咲いている", "はながさいている"],
  ["プラナリアはおいしい","ぷらなりあはおいしい"],
  ["公園で遊んだ", "こうえんであそんだ"],
  ["本を読むのが好き", "ほんをよむのがすき"],
  ["山に登った", "やまにのぼった"],
  ["海で泳いだ", "うみでおよいだ"],
  ["風が強く吹いている", "かぜがつよくふいている"],
  ["時計を見て驚いた", "とけいをみておどろいた"],
  ["鳥が空を飛ぶ", "とりがそらをとぶ"],
  ["机の上に猫がいる", "つくえのうえにねこがいる"],
  ["財布を落とした", "さいふをおとした"],
  ["星がきれいに光る", "ほしがきれいにひかる"],
  ["歌を口ずさんだ", "うたをくちずさんだ"],
  ["雪が静かに降る", "ゆきがしずかにふる"],
  ["母に電話をかけた", "ははにでんわをかけた"],
  ["鍵をどこかに忘れた", "かぎをどこかにわすれた"],
  ["空が赤く染まった", "そらがあかくそまった"],
  ["犬が吠えている", "いぬがほえている"],
  ["机に本を置いた", "つくえにほんをおいた"],
  ["彼女は優しかった", "かのじょはやさしかった"],
  ["夜空に月が出ていた", "よぞらにつきがでていた"],

  // 追加分（20文字以内）
  ["部屋を掃除しました","へやをそうじしました"],
  ["彼はギターを弾いた","かれはぎたーをひいた"],
  ["川で魚を釣りました","かわでさかなをつりました"],
  ["父と散歩に出かけた","ちちとさんぽにでかけた"],
  ["ケーキを三つ食べた","けーきをみっつたべた"],
  ["写真を一枚撮った","しゃしんをいちまいとった"],
  ["電気を消して寝た","でんきをけしてねた"],
  ["雨が止んで虹が出た","あめがやんでにじがでた"],
  ["机にリンゴを置いた","つくえにりんごをおいた"],
  ["夜に星を数えた","よるにほしをかぞえた"],
  ["彼は歌を歌った","かれはうたをうたった"],
  ["図書館で本を借りた","としょかんでほんをかりた"],
  ["砂浜を歩きました","すなはまをあるきました"],
  ["赤い花を摘みました","あかいはなをつみました"],
  ["妹と遊びました","いもうととあそびました"],
  ["犬と一緒に走った","いぬといっしょにはしった"]
]

const shuffleArray = (array) => {
  const cloneArray = [...array];
  for (let i = cloneArray.length - 1; i >= 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    let tmpStorage = cloneArray[i];
    cloneArray[i] = cloneArray[rand];
    cloneArray[rand] = tmpStorage;
  }
  return cloneArray;
}

let shuffledExample = shuffleArray(examples);

// --- Game Control Functions ---

window.startPracticeGame = () => {
    isGameActive = true;
    morseButton.disabled = false;
    resultModal.classList.add('is-hidden');

    if (window.selectedPracticeMode === 'timeAttack') {
        startScoreAttack(); // Corrected logic: Time Attack is sentence-based
    } else {
        startTimeAttack(); // Corrected logic: Score Attack is time-based
    }
};

function startTimeAttack() { // This is now SCORE ATTACK
    gameStats.classList.remove('is-hidden');
    score = 0;
    flawlessBonus = 0;
    mistakeMadeInChar = false;
    totalCharsTyped = 0;
    correctCharsTyped = 0;
    mistakeCount = 0;
    timeLeft = timeLimit;
    
    scoreElement.textContent = score;
    document.getElementById('game-stat-label').textContent = '残り時間:';
    document.getElementById('game-stat-value').textContent = `${timeLeft}秒`;

    clearInterval(timerInterval);
    clearInterval(elapsedTimerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    restartMorsePractice();
}

function startScoreAttack() { // This is now TIME ATTACK
    gameStats.classList.remove('is-hidden');
    score = 0;
    flawlessBonus = 0;
    mistakeMadeInChar = false;
    totalCharsTyped = 0;
    correctCharsTyped = 0;
    mistakeCount = 0;
    sentenceCount = 0;
    
    // In Time Attack, the right stat shows elapsed time, not score
    scoreElement.previousElementSibling.textContent = '時間:';
    scoreElement.textContent = '0.0秒';

    document.getElementById('game-stat-label').textContent = '問題:';
    document.getElementById('game-stat-value').innerHTML = `<span id="sentence-counter">${sentenceCount + 1}</span> / ${scoreAttackSentenceLimit}`;

    sessionStartTime = performance.now();
    
    clearInterval(timerInterval);
    clearInterval(elapsedTimerInterval);
    elapsedTimerInterval = setInterval(updateElapsedTime, 100);

    restartMorsePractice();
}

function updateTimer() { // For Score Attack (time limit)
    timeLeft--;
    document.getElementById('game-stat-value').textContent = `${timeLeft}秒`;
    if (timeLeft <= 0) {
        endGame();
    }
}

function updateElapsedTime() { // For Time Attack (elapsed time)
    if (!isGameActive) return;
    const elapsedSeconds = (performance.now() - sessionStartTime) / 1000;
    scoreElement.textContent = `${elapsedSeconds.toFixed(1)}秒`;
}

function endGame() {
    isGameActive = false;
    clearInterval(timerInterval);
    clearInterval(elapsedTimerInterval);
    clearTimeout(id);

    if (oscillator) {
        oscillator.stop();
        oscillator = null;
        gainNode = null;
    }

    morseButton.disabled = true;

    // --- Common Stats Calculation ---
    const accuracy = totalCharsTyped > 0 ? Math.round((correctCharsTyped / totalCharsTyped) * 100) : 0;
    accuracyStatElement.textContent = `${accuracy}%`;
    charsTypedStatElement.textContent = totalCharsTyped;
    mistakesStatElement.textContent = mistakeCount;

    const resultTitle = document.querySelector('.result-title');
    const finalScoreLabel = document.querySelector('.final-score-label');
    const wpmStatLabel = document.getElementById('wpm-stat-label');

    if (window.selectedPracticeMode === 'timeAttack') {
        resultTitle.textContent = '終了！';

        const totalTimeSeconds = (performance.now() - sessionStartTime) / 1000;
        const timeElapsedInMinutes = totalTimeSeconds / 60;
        const wpm = timeElapsedInMinutes > 0 ? Math.round((totalCharsTyped / 5) / timeElapsedInMinutes) : 0;

        finalScoreLabel.textContent = 'クリア時間';
        finalScoreElement.textContent = `${totalTimeSeconds.toFixed(2)}秒`;

        wpmStatLabel.textContent = 'WPM';
        wpmStatElement.textContent = wpm;

    } else { // scoreAttack
        resultTitle.textContent = 'タイムアップ！';
        finalScoreLabel.textContent = '最終スコア';
        
        const timeElapsedInMinutes = timeLimit / 60;
        const wpm = timeElapsedInMinutes > 0 ? Math.round((totalCharsTyped / 5) / timeElapsedInMinutes) : 0;
        wpmStatLabel.textContent = 'WPM';
        wpmStatElement.textContent = wpm;

        // Animate score
        let currentScore = 0;
        const finalScoreValue = score;
        finalScoreElement.textContent = 0;

        if (finalScoreValue === 0) {
            finalScoreElement.textContent = '0';
        } else {
            const duration = 1000; // ms
            const stepTime = 10; // ms
            const totalSteps = duration / stepTime;
            const increment = finalScoreValue / totalSteps;

            const scoreAnimation = setInterval(() => {
                currentScore += increment;
                if (currentScore >= finalScoreValue) {
                    currentScore = finalScoreValue;
                    clearInterval(scoreAnimation);
                }
                finalScoreElement.textContent = Math.round(currentScore);
            }, stepTime);
        }
    }
    
    resultModal.classList.remove('is-hidden');
}


// --- Core Practice Logic ---

const reset = () => {
  if (window.isMorseGuideActive) {
    morse_list = morse_list_guide;
    morsecodeMap = morsecodeMap_guide;
  } else {
    morse_list = morse_list_no_guide;
    morsecodeMap = morsecodeMap_no_guide;
  }

  if (num >= shuffledExample.length) {
      num = 0; // Loop back to the start if all words are used
      shuffledExample = shuffleArray(examples);
  }

  wordsBase = ["", replaceWithMap(shuffledExample[num][1], conversionMap)];
  morseBase = ["", replaceWithMap(wordsBase[1], morsecodeMap)];
  textJapaneseElement.innerHTML = shuffledExample[num][0];
  textHuriganaElement.innerHTML = `<span></span>${replaceWithMap(shuffledExample[num][1], conversionMap)}`;
  const morseText = replaceWithMap(wordsBase[1], morsecodeMap);
  const displayText = window.isMorseGuideActive ? morseText.replace(/\|/g, '　') : morseText;
  morseJapaneseElement.innerHTML = `<span></span>${displayText}`;
  num ++;
}

const deleteFirst = (text) => {
  return text.replace(/^./, "");
}

function replaceWithMap(input, map) {
  const pattern = new RegExp(Object.keys(map).join('|'), 'g');
  return input.replace(pattern, match => map[match]);
}

const judgeMorse = (word, list) => {
  let correctWords = "";
  let newWords;
  if(list[1].startsWith(word)){
    correctWords = list[0] + word;
    newWords = deleteFirst(list[1]);
    return [correctWords,newWords];
  }else{
    return list;
  }
}

const colorChange = (text, file) => {
  const colors = ["color-white", "color-gray"];
  let newText = "";
  const targetElement = file === "morseJapanese" ? morseJapaneseElement : textHuriganaElement;

  if (file === "morseJapanese") {
    const part1 = window.isMorseGuideActive ? text[0].replace(/\|/g, '　') : text[0];
    const part2 = window.isMorseGuideActive ? text[1].replace(/\|/g, '　') : text[1];
    newText = `<span class="${colors[0]}">${part1}</span>${part2}`;
  } else {
    newText = `<span class="${colors[0]}">${text[0]}</span>${text[1]}`;
  }
  targetElement.innerHTML = newText;
};

const cnv = () => {
  let morse = window.isMorseGuideActive ? words + '|' : words;
  if(morse_list[morse]!==NaN && morse_list[morse]!==undefined){
    totalCharsTyped++;
    const typedChar = morse_list[morse];
    const expectedChar = wordsBase[1] ? wordsBase[1][0] : null;
    const isCorrect = !mistakeMadeInChar && typedChar === expectedChar;

    if (isGameActive) {
        if (isCorrect) {
            correctCharsTyped++;
            score += baseScorePerChar + flawlessBonus;
            flawlessBonus++;
        } else {
            flawlessBonus = 0;
            mistakeCount++;
        }
        // Only update score display in score attack mode
        if (window.selectedPracticeMode === 'scoreAttack') {
            scoreElement.textContent = score;
        }
    }

    if (isCorrect) {
        word += typedChar;
        wordsBase = judgeMorse(word, wordsBase);
    }
    
    mistakeMadeInChar = false; // Reset for next attempt

    morseBase = [replaceWithMap(wordsBase[0], morsecodeMap), replaceWithMap(wordsBase[1], morsecodeMap)];
    colorChange(wordsBase, "textHurigana");
    colorChange(morseBase, "morseJapanese");
  }else{
    if (words !== "") {
        flawlessBonus = 0;
        mistakeMadeInChar = true;
        mistakeCount++;
    }
    morseBase = [replaceWithMap(wordsBase[0], morsecodeMap), replaceWithMap(wordsBase[1], morsecodeMap)];
    colorChange(morseBase, "morseJapanese");
  }
  if(wordsBase[1] === ""){
    if (isGameActive) {
        score += 500; // Add bonus for completing a sentence
        if (window.selectedPracticeMode === 'scoreAttack') {
            scoreElement.textContent = score;
        }
    }
    
    if (window.selectedPracticeMode === 'timeAttack') {
        sentenceCount++;
        if (sentenceCount >= scoreAttackSentenceLimit) {
            endGame();
        } else {
            document.getElementById('game-stat-value').innerHTML = `<span id="sentence-counter">${sentenceCount + 1}</span> / ${scoreAttackSentenceLimit}`;
            reset();
        }
    } else {
        reset();
    }
  }
  word = "";
  words = "";
}

function mousedown() {
  if (!isGameActive) return;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  let start1 = performance.now();
  ddtime = start1;

  if (oscillator) {
    oscillator.stop();
  }

  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();
  oscillator.frequency.value = 880;
  oscillator.type = 'sine';
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  gainNode.gain.setValueAtTime(window.typingVolume, audioCtx.currentTime);
  oscillator.start();

  clearTimeout(id);
}

function mouseup() {
  if (!isGameActive) return;
  let mo;
  let end1 = performance.now();
  let result = end1 - ddtime;
  if(result<=window.morseInterval){
      mo = "・";
  }else{
      mo = "ー";
  }

  const originalCorrectLength = morseBase[0].length;
  morseBase = judgeMorse(mo, morseBase);
  if (morseBase[0].length === originalCorrectLength && mo !== "") {
    mistakeMadeInChar = true;
  }
  colorChange(morseBase, "morseJapanese");

 if (oscillator) {
    oscillator.stop();
    oscillator = null;
    gainNode = null;
  }

  words += mo;
  mo = "";
  id = setTimeout(cnv, window.morseInterval);
}

function mouseLeave() {
  console.log("practice-type.js: mouseLeave called");
  if (oscillator) {
    oscillator.stop();
    oscillator = null;
    gainNode = null;
  }
  clearTimeout(id);
}

function restartMorsePractice() {
  num = 0;
  word = "";
  words = "";
  if (id) {
    clearTimeout(id);
  }
  shuffledExample = shuffleArray(examples);
  reset();
}
window.restartMorsePractice = restartMorsePractice;


document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Element Initialization ---
    textJapaneseElement = document.getElementById("textJapanese");
    textHuriganaElement = document.getElementById("textHurigana");
    morseJapaneseElement = document.getElementById("morseJapanese");
    morseButton = document.querySelector(".morse-button");
    gameStats = document.getElementById('game-stats');
    scoreElement = document.getElementById('score');
    resultModal = document.getElementById('result-modal');
    finalScoreElement = document.getElementById('final-score');
    retryButton = document.getElementById('retry-button');
    backToModeSelectionFromResult = document.getElementById('backToModeSelectionFromResult');

    accuracyStatElement = document.getElementById('accuracy-stat');
    charsTypedStatElement = document.getElementById('chars-typed-stat');
    wpmStatElement = document.getElementById('wpm-stat');
    mistakesStatElement = document.getElementById('mistakes-stat');

    // --- Event Listeners for Modal ---
    retryButton.addEventListener('click', () => {
        resultModal.classList.add('is-hidden');
        startPracticeGame(); // Re-call the main start function
    });

    backToModeSelectionFromResult.addEventListener('click', () => {
        resultModal.classList.add('is-hidden');
        if(typeof showModeSelectionScreen === 'function') {
            showModeSelectionScreen();
        }
    });

    // --- Initial Page Setup ---
    restartMorsePractice(); 
    gameStats.classList.add('is-hidden');
    morseButton.disabled = true; // Initially disabled

    // --- Settings for Morse Threshold ---
    const thresholdSlider = document.getElementById('threshold-duration');
    const thresholdValueDisplay = document.getElementById('threshold-value');

    // Load saved threshold from localStorage
    const savedThreshold = localStorage.getItem('morseThreshold');
    if (savedThreshold) {
        const value = parseInt(savedThreshold, 10);
        window.morseInterval = value;
        thresholdSlider.value = value;
        thresholdValueDisplay.textContent = `${value}ms`;
    }

    // Listen for changes on the slider
    thresholdSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value, 10);
        window.morseInterval = value;
        thresholdValueDisplay.textContent = `${value}ms`;
        localStorage.setItem('morseThreshold', value);
    });
});