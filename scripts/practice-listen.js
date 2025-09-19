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

function listenReset() {
  choices = selectChoices(listenShuffledExample, questionAnswer);
  answerNumber = choices.indexOf(questionAnswer);
}
console.log(choiceArray[answerNumber])

screenShift(choices);

//正解のとき
choiceArray[answerNumber].addEventListener("click", () => {
  questionAnswer ++;
  listenReset();
  screenShift();
  console.log("kkakakak")
})
