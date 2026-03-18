let createPlayer = (() => {
  let index = -1;
  return function (name) {
    let _name = name;
    index++;
    let _token = index % 2 == 0 ? "X" : "O";

    const getName = () => _name;
    const getToken = () => _token;
    const setName = (name) => {
      _name = name;
    };
    return { getName, getToken, setName };
  };
})();

let gameboard = (() => {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  let p1 = createPlayer("Player 1");
  let p2 = createPlayer("Player 2");
  let active = false;
  let hasWon = false;
  const isDraw = () => board.flat().every((cell) => cell !== "");

  const checkWin = () => {
    let rowWin = false;
    for (let i = 0; i < 3; i++) {
      rowWin =
        rowWin || (board[i][0] != "" && board[i][0] == board[i][1] && board[i][0] == board[i][2]);
    }
    let colWin = false;
    for (let j = 0; j < 3; j++) {
      colWin =
        colWin || (board[0][j] != "" && board[0][j] == board[1][j] && board[0][j] == board[2][j]);
    }

    return (
      (board[0][0] != "" && board[0][0] == board[1][1] && board[0][0] == board[2][2]) ||
      (board[0][2] != "" && board[0][2] == board[1][1] && board[0][2] == board[2][0]) ||
      rowWin ||
      colWin
    );
  };

  const showWin = () => {
    let n = document.querySelector(".notif");
    n.textContent = `${active.getName()} WINS!!!`;
  };
  const showDraw = () => {
    let n = document.querySelector(".notif");
    n.textContent = `DRAWWW!!!`;
  };
  const renderBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let v = i * 3 + j;
        let p = document.getElementById("t" + v.toString());
        let str = board[i][j];
        p.textContent = str;
        if (str == "X") {
          p.style.borderColor = "#ff0000";
        } else if (str == "O") {
          p.style.borderColor = "#0000ff";
        } else {
          p.style.borderColor = "#ffffff";
        }
      }
    }
  };

  const setName = (val, p) => {
    val = val.slice(0, 10);
    if (p === "p1") {
      p1Input.value = val;
      p1.setName(val);
    } else {
      p2Input.value = val;
      p2.setName(val);
    }
  };

  let p1Input;
  let p2Input;
  let tiles;

  newGame = () => {
    board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    if (active) {
      let tmp = p1.getName();
      p1.setName(p2.getName());
      p2.setName(tmp);
      setName(p1.getName(), "p1");
      setName(p2.getName(), "p2");
    } else {
      setName("Player 1", "p1");
      setName("Player 2", "p2");
    }

    active = p1;
    hasWon = false;

    renderBoard();
  };

  const move = (i, j) => {
    if (board[i][j] || hasWon) {
      return;
    } else {
      board[i][j] = active.getToken();
      if (checkWin()) {
        showWin();
        hasWon = true;
      } else if (isDraw()) {
        showDraw();
        hasWon = true;
      } else {
        active = active === p1 ? p2 : p1;
      }
      renderBoard();
    }
  };

  const addListeners = () => {
    p1Input = document.querySelector("#p1");
    p2Input = document.querySelector("#p2");

    p1Input.addEventListener("input", (e) => {
      setName(e.target.value, "p1");
    });

    p2Input.addEventListener("input", (e) => {
      setName(e.target.value, "p2");
    });

    let new_btn = document.querySelector(".new-game");
    new_btn.addEventListener("click", () => newGame());

    for (let i = 0; i < 9; i++) {
      let p = document.querySelector("#t" + i.toString());
      p.addEventListener("click", () => {
        move(Math.floor(i / 3), i % 3);
      });
    }

    tiles = document.querySelector(".tiles");
  };

  return { newGame, move, addListeners };
})();

gameboard.addListeners();
gameboard.newGame();
