/**
 * キソジオンライン ミュラーリヤー錯視実験
 * 
 * 恒常法
 * - 内向 or 外向
 * - 90〜220まで10 pxごとにランダム
 * - 各条件10試行（14 長さ x 2 向き x 10 rep = 280 試行）
 *
 * by kohske takahashi
 *
 * MIT License | https://github.com/kohske/KisojiOnline/blob/master/LICENSE
 */

// 表示領域サイズ
var canvas_width = 600;
var canvas_height = 600;

// 実験パラメータ
// 定数
var std_width = 150; // 標準刺激（直線）の長辺
var std_height = 75; // 標準刺激（直線）の短辺
var std_posY = 100; // 標準刺激（ML）のY座標
var std_arrow_len = 50; // 矢羽の長さ

var comp_posY = 200; // 比較刺激のY座標



// 変数
var comp_len; // 比較刺激の長さ
var std_angle; // 標準刺激の角度


// 要因計画は親HTMLで。
//var fac = {
//  angles: [60, 120, 180, 240, 300], // 角度
//  up_down: ["up", "down"], // 系列
//  rept: [1,2],
//};

// 要因の直積
var factors = jsPsych.randomization.factorial(fac, 5);  //後ろの数字は１セットの試行回数でした（福井）

var n_trial = 1;
var n_trial_all = factors.length;


// 標準刺激
var std_line = {
  obj_type: 'rect', // オブジェクトの種類を 'rect' に変更
  startX: canvas_width/4.0,
  startY: std_posY, // 長方形の中心のY座標に変更
  width: std_width,
  height: std_height,
  line_width: 3,
  line_color: "#000000",
};

// 比較刺激の線
var comp_line = {
obj_type: 'rect', 
  startX: 3*canvas_width/4.0,
  startY: comp_posY, 
  width: std_width,
  height: 0,
  line_width: 3,
  line_color: "#000000",
}

// 標準刺激の矢羽
var std_arrow = {
  obj_type: 'line',
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  line_width: 3,
  line_color: "#000000"
};

var text_object = {
  obj_type: 'text',
  startX: 'center',
  startY: 500,
  content: "",
  font: "22px 'Arial'",
  text_color: 'black',
  text_space: 100,
};

// 刺激提示
var trial = {
  type: 'psychophysics',
  stimuli: [comp_line, std_line, std_arrow, std_arrow, std_arrow, std_arrow, text_object],
  response_type: 'key',
  std_angle: jsPsych.timelineVariable('angles'),
  comp_len: jsPsych.timelineVariable('comp_len'),
  data :{
    std_angle: jsPsych.timelineVariable('angles'),
    comp_len: jsPsych.timelineVariable('comp_len'),
    record: 1
  },
  choices: ["ArrowLeft", "ArrowRight"],
  canvas_width: canvas_width,
  canvas_height:canvas_height,
  background_color: '#DDDDDD',

  // 試行の刺激を設定する
  on_start: function(trial){
    // 矢羽の角度
    var rad = trial.std_angle*Math.PI/180/2;
    var comp_len = trial.comp_len;
    
    // 刺激の座標指定
    trial.stimuli[0].height = comp_len;
    
    trial.stimuli[2].x1 = canvas_width/4.0-std_width/2.0;
    trial.stimuli[2].x2 = canvas_width/4.0-std_width/2.0+std_arrow_len*Math.cos(rad);
    trial.stimuli[2].y1 = std_posY + std_height / 2.0
    trial.stimuli[2].y2 = std_posY+ std_height / 2.0 +std_arrow_len*Math.sin(rad);

    trial.stimuli[3].x1 = canvas_width/4.0-std_width/2.0,    
    trial.stimuli[3].x2 = canvas_width/4.0-std_width/2.0+std_arrow_len*Math.cos(rad);
    trial.stimuli[3].y1 = std_posY - std_height / 2.0
    trial.stimuli[3].y2 = std_posY - std_height / 2.0 -std_arrow_len*Math.sin(rad);

    trial.stimuli[4].x1 = canvas_width/4.0+std_width/2.0,    
    trial.stimuli[4].x2 = canvas_width/4.0+std_width/2.0-std_arrow_len*Math.cos(rad);
    trial.stimuli[4].y1 = std_posY + std_height / 2.0
    trial.stimuli[4].y2 = std_posY+ std_height / 2.0 +std_arrow_len*Math.sin(rad);

    trial.stimuli[5].x1 = canvas_width/4.0+std_width/2.0,    
    trial.stimuli[5].x2 = canvas_width/4.0+std_width/2.0-std_arrow_len*Math.cos(rad);
    trial.stimuli[5].y1 = std_posY - std_height / 2.0
    trial.stimuli[5].y2 = std_posY- std_height / 2.0 -std_arrow_len*Math.sin(rad);

    trial.stimuli[6].content = String(n_trial)+" / "+String(n_trial_all);
    ++n_trial;
  }
};

var test_procedure = {
  timeline: [trial],
  timeline_variables: factors,
  randomize_order: true
}

//フルスクはじまり
var start_fullscreen = {
  type: 'fullscreen',
  message: '<p>ウィンドウサイズを最大化します。下のボタンを押してください。</p>',
  button_label: '次へ',
  fullscreen_mode: true, // 全画面表示にする
};
//フルスク終わり
var end_fullscreen = {
  type: 'fullscreen',
  fullscreen_mode: false, // 全画面表示を解除
};


// 開始時の画面
var start_experiment_procedure = {
  type: 'html-keyboard-response',
  stimulus: '<p><b>ウエイト・マッサロの実験（恒常法）</b></p>',
  choices: [" "],
  prompt: "<p>左と右に長方形が出てきます。左の長方形の四隅には矢羽（短い直線）がついています。<br/><br/>"+
  "右（矢羽がない方）の長方形の縦方向の長さが左（矢羽がある方）の長方形の縦方向の長さよりも短く見えれば「左矢印キー」を、右の長方形の縦方向の長さが左の長方形の縦方向の長さよりも長く見えれば「右矢印キー」を押してください。<br/><br/>"+
  "または、左右どちらの長方形の縦方向の長さの方が長く見えるか、左右の矢印キーで回答してください（意味は同じです）。<br/><br/>"+
  "判断するのは下図の赤い矢印の方向の長さです。</p><img src = ../WM教示縦.png>"+
  "<p>左右の長方形の縦方向の長さが同じ長さに見える場合でも、どちらが長く見えるか無理矢理判断して回答してください。<br/><br/>"+
  "スペースキーを押すと始まります。"+
  "</p>"
};

// 実験終了時の画面
var finish_experiment_procedure = {
  type: 'html-keyboard-response',
  stimulus: "",
  choices: jsPsych.NO_KEYS,
  on_start: function(trial) {
    var dt = jsPsych.data.get().filter([{record: 1}]);    
    dt = dt.ignore(["response_type", "key_press", "avg_frame_time", "trial_type", "trial_index", "time_elapsed", "internal_node_id", "stimulus", "center_x", "center_y", "record"]);
    var txt = dt.csv().replace(/,/g, "\t").replace(/"/g,"");
    trial.stimulus = '<p>実験終了です。</p><p>WaiteMassaroV.csvというファイル名のデータファイルが自動的にダウンロードされています。Excelで開けるので確認してください。</p>'+
      '<p>データファイルがダウンロードできていない場合は、下の枠の中のデータをエクセルなどに貼り付けて保存しましょう。</p>'+
      '<p>枠の中をクリックしてから、Ctrl+A (コントロールキーを押しながらAキーを押す)ですべて選択し、Ctrl+Cでクリップボードにコピーできます。</p>'+
      '<p>コピーしたら、新しいエクセルファイルを開き、Ctrl+Vで貼付けましょう。</p>'+
      '<textarea style="width:450px; height: 300px">'+txt+'</textarea>';
    dt.localSave('csv', 'WaiteMassaroV.csv');    
  }
};

jsPsych.init({
  override_safe_mode: true,
  default_iti: 100,
  timeline:  [start_fullscreen, start_experiment_procedure, test_procedure, end_fullscreen, finish_experiment_procedure]
});
