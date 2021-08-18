"use strict";

console.clear();
// 今回の例ではブラウザの更新時にコンソールはクリアされているのでソース上でクリアしなくても問題ない。
// ソースからもクリアできるという例のために入れている。

{
  // 全体で使用する以下の変数を、グローバルスコープで定義。

  const today = new Date();
  // 今日のオブジェクトをtodayで保持。

  let year = today.getFullYear();
  // todayから今年の値を取得。

  let month = today.getMonth();
  // todayから今月の値を取得。

  const oneWeek = 7;
  // マジックナンバー7を１週間の日付、7日として、oneWeekと定義。

  // 当月のカレンダーに表示される前月分のデータを作成する関数。

  function getCalendarHead() {
    const dates = [];
    // データを格納する空要素を宣言。

    const d = new Date(year, month, 0).getDate();
    // 当月の0日を指定し、前月の末日を取得。

    const n = new Date(year, month, 1).getDay();
    // カレンダーの前月分の日数と同数である、当月初日曜日のindexを取得。

    for (let i = 0; i < n; i++) {
      // nの値に満たない間、以下の処理を繰り返す。

      dates.unshift({
        // 今日の日付を判定できるように、オブジェクトの配列として日付を取得。
        // dates要素の前から一つずつ値を、以下のプロパティを加えながら追加。

        date: d - i,
        // 前月末日からカウンターiの値を引いて前月分の日付を作成。

        isToday: false,
        // isTodayプロパティをfalseにして、今日の日付を太字にするCSS処理を無効にする。
        // 定義先はrenderWeeks。

        isDisabled: true,
        // isDisabledプロパティをtrueにして、前月分の日付文字色を薄く表示するCSSを有効にする。
        // 定義先はrenderWeeks。
      });
    }

    return dates;
  }

  // 当月のカレンダーに表示される次月分のデータを作成する関数。

  function getCalendarTail() {
    const dates = [];
    const lastDay = new Date(year, month + 1, 0).getDay();
    // 来月0日を指定することで、今月末の日付を指定し、その日付の曜日indexをgetDayで取得。

    for (let i = 1; i < oneWeek - lastDay; i++) {
      // iが7から曜日indexを引いた値より小さい間、iを１ずつ増やしながら、以下の処理をする。
      // 例1 lastDayが土曜日なら、1 < 1 となり、処理は発生しない。(次月分の表示は無い)
      // 例2 lastDayが日曜日なら、1 < 7となり、６回処理を行う。(次月分の表示要素数は６)

      dates.push({
        date: i,
        // 次月の初日、１日に数値を足し上げていく。

        isToday: false,
        isDisabled: true,
      });
    }

    return dates;
  }

  // 当月のカレンダーデータを作成する関数。

  function getCalendarBody() {
    const dates = [];
    const lastDate = new Date(year, month + 1, 0).getDate();
    // 次月の０日目を指定し、当月の末日をgetDateで取得。

    for (let i = 1; i <= lastDate; i++) {
      // 当月の日付分（末日の値）以下の処理を繰り返す。

      dates.push({
        date: i,
        isToday: false,
        isDisabled: false,
        // 当月分の日付なのでisDisabledプロパティをfalseにして、文字色を薄く表示するCSSを無効にする。
      });
    }

    if (year === today.getFullYear() && month === today.getMonth()) {
      // もし、yearが今年で、なおかつ、monthが今月だったら以下の処理をする。
      // この処理がないと、どの年、どの月でも、当月と同じ日付が太字になってしまう。

      dates[today.getDate() - 1].isToday = true;
      // 今日の日付を太字にする。(falseをtrueに書き換えて、todayクラスについたCSSを有効にする)
      // 今日の日付が何番目の要素かは、indexは0スタートなので、1を引いた値を指定する。
    }

    return dates;
  }

  // カレンダー更新時に更新前のカレンダーを消す関数。
  // この処理をしないと、更新したカレンダーが積み重なって表示されてしまう。

  function clearCalendar() {
    const tbody = document.querySelector("tbody");

    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
    // tbody の最初の子要素がある限り、 tbody からその最初の子要素を削除。
    // 子要素が無くなった状態で、カレンダーの描画が行われる。
  }

  // カレンダーに西暦と月を表示。

  function renderTitle() {
    const title = `${year}/${String(month + 1).padStart(2, "0")}`;
    // padStartで月を２桁表示に指定し、１桁の時0を表示させる。
    // padStartは文字列にしか使えないので、Stringで数値を文字列に変更。

    document.getElementById("title").textContent = title;
    // 西暦と月を表示。
  }

  // 当月のカレンダーを週ごとに描写する関数。

  function renderWeeks() {
    const dates = [
      // スプレット構文で下記３つの関数でつくられた前月分、当月分、次月分の配列を、const Datesの中で展開して一つの配列にする。
      // 展開しないと配列が入子になってしまう。

      ...getCalendarHead(),
      ...getCalendarBody(),
      ...getCalendarTail(),
      // 関数なのにカンマ？？
    ];
    // 配列にセミコロン？関数式なのか？関数の中のメソッドってコロン？？
    // ->上記は関数。[]の中の関数は実引数扱いだからカンマ。多分。

    // datesの配列を週ごとの配列に分割する。

    const weeks = [];
    // 週ごとの配列をweeksとして空配列で定義。

    const weeksCount = dates.length / oneWeek;
    // dates.lengthをoneWeekで割り、表示する週の数を定義。

    // 週ごとの配列を作成。
    for (let i = 0; i < weeksCount; i++) {
      // weeksCountで定義された週の数に満たない間、以下の処理を繰り返す。

      weeks.push(dates.splice(0, oneWeek));
      // 定数datesから、定数weeksに7つずつ値を後ろから追加。
    }

    weeks.forEach((week) => {
      // 定数 weeksの各配列をweekとし、それぞれ以下の処理を行う。

      const tr = document.createElement("tr");
      // HTML tr要素をつくり、定数trとして定義。

      week.forEach((date) => {
        // weekの各要素をdateとし、それぞれ以下の処理を行う。

        const td = document.createElement("td");
        // HTML td要素をつくり、定数tdとして定義。

        td.textContent = date.date;
        // ひとつめのdateはweekの各要素。
        // ふたつめのdateは、dateの中のdateプロパティ。（日付の値のみ）
        // dateドットdateなので、tdのテキストに代入するのは、dateのdateプロパティ。

        if (date.isToday) {
          // dateのisTodayプロパティがtureだったら、以下の処理を行う。

          td.classList.add("today");
          // td要素にtodayクラスのCSSを加える。
        }
        if (date.isDisabled) {
          // dateのisDisabledプロパティがtrueだったら、以下の処理を行う。

          td.classList.add("disabled");
          // td要素にisDisabledクラスのCSSを加える。
        }

        tr.appendChild(td);
        // tr要素にtd要素を加える。
      });
      document.querySelector("tbody").appendChild(tr);
      // HTML要素 tbodyにtr要素を加える。
    });
  }

  // 下記の各関数を実行し、カレンダー全体の描画を行う関数。

  function createCalendar() {
    clearCalendar();
    renderTitle();
    renderWeeks();
  }

  // 前月のカレンダーを表示する。

  document.getElementById("prev").addEventListener("click", () => {
    // prevがクリックされた時、以下の処理を行う。

    month--;
    // 月をマイナス１する。

    if (month < 0) {
      // もし月が0未満の時、
      // 例)2020年１月の時、prevがクリックされたら、2019年12月が表示される。

      year--;
      // 年をマイナス1する。

      month = 11;
      // 月を１２月にする。
    }

    // カレンダー全体を描画する関数を実行。
    createCalendar();
  });

  // 次月のカレンダーを表示する。

  document.getElementById("next").addEventListener("click", () => {
    // nextがクリックされたとき、以下の処理を行う。

    month++;
    // 月にプラス１する。

    if (month > 11) {
      // もし月が12を超過したら、

      year++;
      // 年にプラス１し、

      month = 0;
      // 月を1月にする。
    }

    createCalendar();
  });

  // 今月以外のカレンダーが表示されている時に、今月のカレンダーを表示する処理。

  document.getElementById("today").addEventListener("click", () => {
    year = today.getFullYear();
    month = today.getMonth();

    createCalendar();
  });

  // カレンダー全体を描画する関数を実行。

  createCalendar();
}
