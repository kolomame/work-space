document.addEventListener('DOMContentLoaded', function() {

  function tetrimino(num){
    const tetriminos = [
        [
          [0,1,1,0],
          [0,1,1,0],
          [0,0,0,0],
          [0,0,0,0]
        ],

        [
          [0,1,0,0],
          [0,1,1,0],
          [0,0,1,0],
          [0,0,0,0]
        ],

        [
          [0,0,1,0],
          [0,1,1,1],
          [0,0,0,0],
          [0,0,0,0]
        ],

        [
          [0,1,0,0],
          [0,1,0,0],
          [0,1,0,0],
          [0,1,0,0]
        ],

        [
          [0,1,1,0],
          [0,1,0,0],
          [0,1,0,0],
          [0,0,0,0]
        ]
    ];

    return tetriminos[num];
  }

  let copyField = Array(20).fill().map(() => Array(10).fill(0));
  // 固定されたテトリミノの配置をfieldに記憶(10*20の2次元行列)
  let field = Array(20).fill().map(() => Array(10).fill(0));

  const width = 10; //fieldの横の長さ
  const height = 20; // 

  //横一列揃ったら一列消える
  function disappier(field, point){
    for (let i = 0; i < field.length(); i++){
        if (field[i].indexOf(0) == -1){
            field[i].fill(0)
            //scoreを保存する
            score(point)
            //消えた分下に下がる
            down(i, field)
        }
    }
  }

  //上の段のものが一つ下に落ちる
  function down(i,field){
    for (let j = i; j > 0; j--){
        for (let k = 0; k < field[1].length(); k++){
            field[i][k] = field[i-1][k]
        }
    }
    field[0].fill(0)
  }

  // 落ちてくるテトリミノの初期座標(1の座標)を取得
  function getxy(tetrimino){
      const twidth = 4
      const theight = 4
      position = []
      for (let y = 0; y < twidth; y++) {
          for (let x = 0; x < theight; x++) {
              if (tetrimino[y][x] == 1){
                  position.push([x+3, y])
              }
          }
      }
      return position
  }
  
  // テトリミノを描画
  // function drawTetrimino(context, position, color) {
  //   context.fillStyle = color; // テトリミノの色
  //   const cellSize = 20; // テトリミノのセルのサイズ

  //   for (let i = 0; i < position.length; i++) {
  //       let x = position[i][0]
  //       let y = position[i][1]
  //       context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  //   }
  // }

    //消して描いて消して描いてを考える
    //最初の描く部分は考えていない
  function updateCopyField(copyField, newposition){

      console.log("drow:", copyField)
      //newpositionをcopyFieldに反映させる
      for (let i = 0; i < newposition.length; i++){
          let x = newposition[i][0]
          let y = newposition[i][1]
          copyField[y][x] = 2
      }
  }

  function copyfileddrow(copyField){
    const red = '#ff0000'
    const grey = '#CCCCCC' 
    console.log('copyfileddrow: ',copyField)

    for (let y = 0; y < copyField.length; y++){
        for (let x = 0; x < copyField[0].length; x++){
            if (copyField[y][x] == 2){
                draw(x, y, red)
            }
            else if(copyField[y][x] <= 1){
                copyField[y][x] = 0
                draw(x, y, grey)
            }
        }
    }
  }

    //分岐によって色指定をしたいがうまくいかないので描く部分だけ関数にする
  function draw(x, y, color){
      context.fillStyle = color
      const cellSize = 20;
      context.fillRect(x*cellSize, y*cellSize, cellSize, cellSize)
  }

  //描く関数をまとめてみる
  function alldrow(copyField, position){
    updateCopyField(copyField, position)
    copyfileddrow(copyField)
    //block(field, updatecopyfield, position)

  }


  // 他ブロックとの衝突判定
  function judge(x, y, field) {
    return field[y][x] != 0;
  }

  // 下にブロックがあるか判定（あればtrue）
  function underjudge(field, position){
    for(let i = 0; i < position.length; i++){
        //下にブロックがあったら
        if (position[i][1] === 19 || judge(position[i][0], position[i][1]+1, field)){
            return true
        }
    }
    return false
  }

  // fieldに反映させる（固定）
  function updateField(field, position){
    for (let i = 0; i < position.length; i++){
        let x = position[i][0]
        let y = position[i][1]
        field[y][x] = 1
    }
    return field
  }
  
  // テトリミノを下に落とす
  function under(field, position){

    // 下にブロック、壁があるか判定
    for(let i = 0; i < position.length; i++){
      //下にブロックがあったら
      if (underjudge(field,position)){
          return updateField(field, position)
      }
    }

    // 移動後のpositionを取得
    let newPosition = []

    for (let j = 0; j < position.length; j++){
        // console.log(position[j][1])
        newPosition.push([position[j][0], position[j][1]+1])
    }

    return newPosition
  }

  // 右に移動
  function right(position){
    for (let i = 0; i < position.length; i++){
        let x = position[i][0]
        let y = position[i][1]
        if (x == 9 || judge(x+1, y, field)){
            return position
        }
    }
    newPosition = []
    for (let j = 0; j < position.length; j++){
        let x = position[j][0]
        let y = position[j][1]
        newPosition.push([x+1, y])
    }
    return newPosition
  }

  //左に移動
  function left(position){  
    for (let i = 0; i < position.length; i++){
        let x = position[i][0]
        let y = position[i][1]
        if (x == 0 || judge(x-1, y, field)){
            return position
        }
    }
    newPosition = []
    for (let j = 0; j < position.length; j++){
        let x = position[j][0]
        let y = position[j][1]
        newPosition.push([x-1, y])
    }

    return newPosition
  }

  // 回転
  function rotate(position){

    newPosition = []
    let centerx = 0
    let centery = 0
    for (let i = 0; i < position.length; i++){
        centerx += position[i][0]
        centery += position[i][1]
    }

    for (let j = 0; j < position.length; j++){
        let x = position[j][0]-(centerx/4)
        let y = position[j][1]-(centery/4)
        let X = Math.floor(x*Math.cos(Math.PI/2) - y*Math.sin(Math.PI/2) + (centerx/4))
        let Y = Math.floor(y*Math.cos(Math.PI/2) + x*Math.sin(Math.PI/2) + (centery/4))
        newPosition.push([X,Y])
    }
    return newPosition
  }

  /* テトリミノのx, y座標のはみ出している部分を見つける(あるかどうかも含めて)。
     もしあったら、はみ出ている部分を修正する　*/
  function revisePositionIfOverflow(position) {
    /* x座標のはみ出している部分を見つける(あるかどうかも含めて)。もしあったら、はみ出ている部分を修正する */
     function revisePositionOfX(position) {
      let maxOutX = -1
      let minOutX = 1
      for (let i = 0; i < position.length; i++) {
          // もし＋にはみ出ているx座標があったら、maxを計算
          if (position[i][0] > 9) {
            maxOutX = Math.max(maxOutX, position[i][0]);
          }
          // もし-にはみ出ているx座標があったら、minを計算
          if (position[i][0] < 0) {
            minOutX = Math.min(minOutX, position[i][0]);
          }
      }
      // はみ出している部分があるかどうか確かめ、あれば修正(なければそのまま元のpositionを返す)
      let newPosition = []
      if (maxOutX != -1) {
        for(let i = 0; i < position.length; i++) {
          newPosition.push([position[i][0] - (maxOutX-9), position[i][1]]);
        }
      }
      else if (minOutX != 1) {
        for(let i = 0; i < position.length; i++) {
          newPosition.push([position[i][0] - minOutX, position[i][1]]);
        }
      } else {
        return position
      }
      return newPosition
    }

    /* y座標のはみ出している部分を見つける(あるかどうかも含めて)。もしあったら、はみ出ている部分を修正する*/ 
    function revisePositionOfY(position) {
      let maxOutY = -1
      let minOutY = 1
      for (let i = 0; i < position.length; i++) {
          // もし＋にはみ出ているy座標があったら、maxを計算
          if (position[i][1] > 19) {
            maxOutY = Math.max(maxOutY, position[i][1]);
          }
          // もし-にはみ出ているy座標があったら、minを計算
          if (position[i][1] < 0) {
            minOutY = Math.min(minOutY, position[i][1]);
          }
      }
      // はみ出している部分があるかどうか確かめ、あれば修正(なければそのまま元のpositionを返す)
      let newPosition = []
      if (maxOutY != -1) {
        for(let i = 0; i < position.length; i++) {
          newPosition.push([position[i][0], position[i][1] - (maxOutY-19)]);
        }
      }
      else if (minOutY != 1) {
        for(let i = 0; i < position.length; i++) {
          newPosition.push([position[i][0], position[i][1] - minOutY]);
        }
      } else {
        return position
      }
      return newPosition
    }

    let revesedPosition = revisePositionOfY(revisePositionOfX(position));
    return revesedPosition
  }

  // 点数を保存
  let point = 0
  function score(point){
      point += 10
      return point
  }

  /* ゲームオーバーかどうか判定する関数(ゲームオーバーはTrue)
  getxyで落ちてくるテトリミノの最初の座標を取得するがその取得した座標にすでにブロックがある（1が存在する）場合ゲームオーバー */
  // let judgedPosition = getxy(tetriminoPattern)
  function gameover(position, field){
      for (let i = 0; i < position.length; i++){
          let x = position[i][0]
          let y = position[i][1]
          if (field[y][x] == 1){
              return false
          }
      }
      return true
  }

  // 次に落ちてくるテトリミノを描画する関数
  function nextTetrimino() {
    // 次に落ちてくるテトリミノの、ミニグリッドに描画用の座標(1の座標)を取得する関数
    function miniGetxy(tetrimino){
      const twidth = 4
      const theight = 4
      let position = []
      for (let y = 0; y < twidth; y++) {
          for (let x = 0; x < theight; x++) {
              if (tetrimino[y][x] == 1){
                  position.push([x, y+1])
              }
          }
      }
      return position
    }
    // miniCanvasの呼び出し
    const miniCanvas = document.getElementById('miniCanvas');
    const miniContext = miniCanvas.getContext('2d');
    // 次のテトリミノの呼び出し
    let nextRandomNumber = Math.floor(Math.random() * 5);
    let nextTetriminoPattern = tetrimino(nextRandomNumber);
    // テトリミノのminiCanvas内での位置を取得
    let nextPosition;
    nextPosition = miniGetxy(nextTetriminoPattern);
    // グレーの背景を塗りつぶす
    miniContext.fillStyle = '#CCCCCC'; // グレー色
    miniContext.fillRect(0, 0, miniCanvas.width, miniCanvas.height);
    // miniCanvasに描画
    draw(miniContext, nextPosition, red);
  }
  nextTetrimino();

  function mainTetrimino(tetriminoPattern){
    // テトリミノの初期位置を取得
    let position;
    position = getxy(tetriminoPattern);
    alldrow(copyField, position)
    for (let i = 0; i < position.length; i++){
        let x = position[i][0]
        let y = position[i][1]
        copyField[y][x] = 1
    }  
  }

  //自動落下
  function autodown() {
    alldrow(copyField, position)
    
    if (underjudge(field,position)){
        // 新しいテトリミノを生み出す
        return false;
    }
    else{
        for (let i = 0; i < position.length; i++){
            let x = position[i][0];
            let y = position[i][1];
            copyField[y][x] = 1;
        } 
        position = under(field, position);
        return true;
    }
  }

  function loopInterval() {
    if (autodown() === true) {
        setTimeout(loopInterval, speed);
    }else{
      //着地後の処理
      console.log("着地");
      //copyfileddrow(field)では落ちてきたテトリミノは消える
      copyfielddrow(copyField);
      console.log(copyField);
      mainTetrimino(next);
      next = nextTetrimino();
      loopInterval()
    }
  }
        
  const hashmap = {
    ArrowRight: () => right(position),
    ArrowLeft: () => left(position),
    ArrowUp: () => rotate(position),
    ArrowDown: () => under(field, position)
  };
  document.addEventListener("keydown", function (event) {
      // key プロパティによってどのキーが押されたかを調べます。
      // code プロパティを使うと大文字/小文字が区別されます。
      // 何かキーボードの押して、コンソールに出力されているか確かめましょう。
    if (hashmap[event.key]) {


      for (let i = 0; i < position.length; i++){
          let x = position[i][0]
          let y = position[i][1]
          copyField[y][x] = 1
      }
      position = hashmap[event.key]();
      alldrow(copyField, position)
    }
    return position
  });

  // mainCanvasの呼び出し
  const mainCanvas = document.getElementById('tetrisCanvas');

  // ↓canvasで2次元描画をするために必要らしい
  const context = mainCanvas.getContext('2d');

  /* 0~4のランダムな整数を取得して、
     ランダムなテトリミノを１つ取得 */
  let randomNumber = Math.floor(Math.random() * 5);
  let tetriminoPattern = tetrimino(randomNumber);

  // グレーの背景を塗りつぶす
  context.fillStyle = gray; // グレー色
  context.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

  // テトリミノの初期位置を取得
  // let position;
  // position = getxy(tetriminoPattern);
  // console.log(position);
  // drawTetrimino(context, position, red);
  // drawTetrimino(context, position, gray);


  // //メイン関数
  // function main() {
  //   mainTetrimino(tetriminoPattern);
  //   loopInterval();
  // }
  // main()
});