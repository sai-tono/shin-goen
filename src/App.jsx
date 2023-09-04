import './App.css';
import { useState, useEffect } from "react";
import axios from "axios";


// APIで取得されるデータは仕様書から以下のようなjsonでやりとりされることを想定
const res = {
  data: {
    results: [  // 該当するデータがない場合にはnullが返ってくる
      {
        code: "432101137111",
        name: "おーいお茶",
        price: "150",
      }
    ],
    status: 200
  }
};

function App() {
  const [num, setNum] = useState(""); //　バーコード（入力）情報
  const [query, setQuery] = useState(""); //APIから返ってきたステータスを保持
  const [resultTxt, setResultTxt] = useState(""); //　getしたときに返ってきた情報に応じて返すテキストを定義

  useEffect(() => {
    const fetchData = () => {
      console.log("データを取得します");
      console.log(query);

      axios
        .get(`https://hoge`) //hogeにAPI情報を入れる
        .then((res) => {
          console.log(res);
          // APIがうまく動作していない時のエラー
          if (res.status !== 200) {
            throw new Error("APIがうまく動作していないようです");
          } else {
            // JANコードが存在しない場合のエラーメッセージ
            if (res.data.results == null) {
              setResultTxt("商品が見つかりませんでした");
              return;
            }

            // 取得した商品を格納
            let getItem = res.data.results[0];

            setResultTxt(`${getItem.name}, ${getItem.price}`);
          }
        })
        .catch((err) =>
          setResultTxt(`データがうまく取得できませんでした。${err}`)
        );
    };

    if (query) fetchData(); // JANコードが入力されてたら実行
  }, [query]); /// numの値が更新されたら実行

  // 商品検索をクリックした時
  const onClickGetArea = () => {
    console.log("商品検索をクリックしました");

    // 未入力だったらアラートを表示
    if (num === "") {
      alert("JANコードを入力してください");
      return;
    }

    //　データ取得
    setQuery(num);
  };



// 以下、POSTリクエストを行う関数を作成 → これをどこにおいたらいいのか、取得した商品情報をどう定義して引用すればいいかがわからないー
const postData = async () => {
  try {
    // リクエストボディを設定（getItemは適切なデータを持つ変数と仮定）
    const requestBody = getItem;

    // POSTリクエストを送信
    const response = await axios.post('https://hoge', requestBody, {
      headers: {
        'Content-Type': 'application/json', // リクエストヘッダーを適切に設定
      },
    });

    // レスポンスのステータスコードを確認
    if (response.status === 200) {
      // レスポンスデータを使用して何かを行う（例：状態を更新する）
      // ここでuseStateを使用してコンポーネントの状態を更新できます
      const data = response.data;
    } else {
      // エラーレスポンスを処理する
      console.error('データを追加できませんでした', response.status);
    }
  } catch (error) {
    console.error('エラーが起きました', error);
  }
};

  return (
    <>
      <div className="input">
        <h1 className="title">商品検索</h1>
        <label for="jancode">JANコード 入力欄：</label>
        <input
          type="number"
          id="jancode"
          value={num}
          placeholder="JANコードを入力してください"
          onChange={(e) => setNum(e.target.value)}
        />
        <button onClick={onClickGetArea}>商品検索</button>
      </div>
      <div className="output">
        <h1 className="title">商品読込結果</h1>
        <p>{resultTxt}</p>
        <p>
          <button>追加</button>
        </p>
      </div>

      <div className="list">
        <h1 className="title">購入リスト</h1>
        <ul>
          <li>おーいお茶、100円</li>
          <li>四谷サイダー、160円</li>
          <li>うまい棒、10円</li>
        </ul>
        <p>
          <button>購入</button>
        </p>
      </div>
    </>
  );
}

export default App;


// getしてくる最中に以下を入れていたが取り外し
// JANコードの桁数が不正の場合のメッセージ
/*if (res.data.message) {
  setResultTxt(res.data.message);
  return;
}*/
// とはいえ、入力したcodeが13桁であることのバリデーション入れたい

// 以下のpython requestsでのpostをaxiosで書いてもらうとどうなるかGPTからの知恵をお借りしてpostを記述