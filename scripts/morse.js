let ddtime=0;
let blanktime=0;
let interval = 200
let id;
let word = "";
let words=[];
let num = 0;
var morseGain = 0.5;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let oscillator = null;
let gainNode = null;

const button = document.getElementById('soundButton');

const morse_list = {
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

const morsecodeMap = {
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
  ["夜空に月が出ていた", "よぞらにつきがでていた"]
]



const shuffleArray = (array) => {
  const cloneArray = [...array];

  for (let i = cloneArray.length - 1; i >= 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    // 配列の要素の順番を入れ替える
    let tmpStorage = cloneArray[i];
    cloneArray[i] = cloneArray[rand];
    cloneArray[rand] = tmpStorage;
  }

  return cloneArray;
}

let shuffledExample = shuffleArray(examples);

const reset = () => {
  wordsBase = ["", replaceWithMap(shuffledExample[num][1], conversionMap)];
  morseBase = ["", replaceWithMap(wordsBase[1], morsecodeMap)];
  document.getElementById("textJapanese").innerHTML = shuffledExample[num][0];
  document.getElementById("textHurigana").innerHTML = `<span></span>${replaceWithMap(shuffledExample[num][1], conversionMap)}`;
  document.getElementById("morseJapanese").innerHTML = `<span></span>${replaceWithMap(wordsBase[1], morsecodeMap)}`;
  num ++;
}

const deleteFirst = (text) => {
  return text.replace(/^./, "");
}

function replaceWithMap(input, map) {
  // すべてのキーを正規表現のORでまとめてパターン作成
  const pattern = new RegExp(Object.keys(map).join('|'), 'g');
  // 一致した部分だけを map に従って置換
  return input.replace(pattern, match => map[match]);
}

const mapString = (str, base) => 
  str.split("").map((a) => {
    return base[a]
  }).join("");

const judgeMorse = (word, list) => {
  let correctWords = "";
  let newWords;
  if(list[1].startsWith(word)){
    correctWords = list[0] + word;
    newWords = deleteFirst(list[1]);
    return [correctWords,newWords];
  }else{
    return list;//間違えた時の処理１
  }
}

const colorChange = (text, file) => {
  const colors = ["color-white", "color-gray"];
  let newText = "";
  newText = `<span class="${colors[0]}">${text[0]}</span>${text[1]}`;
  document.getElementById(file).innerHTML = newText;
};

//モールスを日本語に変換
const cnv = () => {
  let morse = words;
  if(morse_list[morse]!==NaN && morse_list[morse]!==undefined){
    word += morse_list[morse];
    wordsBase = judgeMorse(word,wordsBase);
    morseBase = [replaceWithMap(wordsBase[0], morsecodeMap), replaceWithMap(wordsBase[1], morsecodeMap)];
    colorChange(wordsBase, "textHurigana");
    colorChange(morseBase, "morseJapanese");
  }else{
    morseBase = [replaceWithMap(wordsBase[0], morsecodeMap), replaceWithMap(wordsBase[1], morsecodeMap)];
    colorChange(morseBase, "morseJapanese");
  }
  if(wordsBase[1] === ""){
    reset();
  }
  word = "";
  words = "";
}

//入力をモールス信号に変換
function mousedown() {
  let start1 = performance.now();
  ddtime = start1;

    // オシレーターとゲインノードを作成
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  // ラの音（A4: 440Hz）
  oscillator.frequency.value = 880;
  oscillator.type = 'sine';

  // ノードを接続
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // 音量を設定
  gainNode.gain.setValueAtTime(morseGain, audioCtx.currentTime);

  // 再生開始
  oscillator.start();

  clearTimeout(id);
}

function mouseup() {
  let mo;
  let end1 = performance.now();
  let result = end1 - ddtime;
  if(result<=interval){
      mo = "・"; //ドット
  }else{
      mo = "ー"; //バー
  }
  morseBase = judgeMorse(mo, morseBase);
  colorChange(morseBase, "morseJapanese");

 if (oscillator) {
    oscillator.stop();
    oscillator = null;
    gainNode = null;
  }

  words += mo;
  mo = "";
  id = setTimeout(cnv, interval);
}

// input要素
const inputElem = document.getElementById('volume');


// inputイベント時に値をセットする関数
const rangeOnChange = (e) =>{
  morseGain = e.target.value
}

window.onload = () => {
  // 変更に合わせてイベントを発火する
  inputElem.addEventListener('input', rangeOnChange);
  // ページ読み込み時の値をセット
}

document.addEventListener("DOMContentLoaded", reset());
inputElem.addEventListener("input", rangeOnChange);

/**
 * ゲームの状態をリセットして最初から始めるための関数
 */
function restartMorsePractice() {
  // 問題番号を0に戻す
  num = 0;
  // 入力途中の文字を空にする
  word = "";
  words = "";
  // 実行待機中のタイマーがあれば解除する
  if (id) {
    clearTimeout(id);
  }
  // 問題リストを再度シャッフルする
  shuffledExample = shuffleArray(examples);
  // 最初の問題を表示する
  reset();
}

// 作成した関数を、他のJavaScriptファイルから呼び出せるようにする
window.restartMorsePractice = restartMorsePractice;

function playClickSound() {
  // Use the existing AudioContext if available, otherwise create a new one.
  const audioContext = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (!window.audioCtx) {
    window.audioCtx = audioContext;
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.frequency.value = 880; // A tone like the morse sound
  oscillator.type = 'sine';

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Use the morseGain value, defaulting if not available.
  const clickVolume = typeof morseGain !== 'undefined' ? morseGain : 0.5;
  gainNode.gain.setValueAtTime(clickVolume, audioContext.currentTime);

  // Play a very short sound
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.07); // 70ms duration
}

// Expose the function to be used in other scripts
window.playClickSound = playClickSound;
