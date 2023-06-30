import React, { useState } from "react";
import redSymbol from "/red.svg";
import yellowSymbol from "/yellow.svg";
import blueSymbol from "/blue.svg";
import "./App.css";

declare global {
  const __COMMIT_HASH__: string;
}

// 4x3の盤面は14パターンしかない
const availableBoards = [
  [
    [1, -2, 2, 4],
    [-1, 2, 3, -4],
    [1, 3, -3, 4],
  ],
  [
    [1, -2, 2, 4],
    [-1, 2, 4, -4],
    [1, 3, -3, 3],
  ],
  [
    [1, 2, 4, -4],
    [-1, -2, 2, 4],
    [1, 3, -3, 3],
  ],
  [
    [1, 3, -3, 3],
    [-1, 2, 4, -4],
    [1, -2, 2, 4],
  ],
  [
    [1, 3, -3, 3],
    [-1, -2, 2, 4],
    [1, 2, 4, -4],
  ],
  [
    [1, 3, -3, 4],
    [-1, 2, 3, -4],
    [1, -2, 2, 4],
  ],
  // [
  //   [1, 2, 3, 4],
  //   [-1, -2, -3, -4],
  //   [1, 2, 3, 4],
  // ],
  [
    [-1, 1, 3, 4],
    [1, 3, -3, -4],
    [2, -2, 2, 4],
  ],
  [
    [1, 3, -3, 4],
    [-1, 1, 3, -4],
    [2, -2, 2, 4],
  ],
  [
    [-1, 1, -3, 3],
    [1, 2, 3, 4],
    [2, -2, 4, -4],
  ],
  // [
  //   [-1, 1, 3, 4],
  //   [1, 2, -3, -4],
  //   [2, -2, 3, 4],
  // ],
  [
    [-1, 1, 4, -4],
    [1, 2, 3, 4],
    [2, -2, -3, 3],
  ],
  // [
  //   [1, 2, -3, 3],
  //   [-1, -2, 3, 4],
  //   [1, 2, 4, -4],
  // ],
  [
    [2, -2, 2, 4],
    [1, 3, -3, -4],
    [-1, 1, 3, 4],
  ],
  [
    [2, -2, 2, 4],
    [-1, 1, 3, -4],
    [1, 3, -3, 4],
  ],
  [
    [2, -2, -3, 3],
    [1, 2, 3, 4],
    [-1, 1, 4, -4],
  ],
  // [
  //   [2, -2, 3, 4],
  //   [1, 2, -3, -4],
  //   [-1, 1, 3, 4],
  // ],
  [
    [2, -2, 4, -4],
    [1, 2, 3, 4],
    [-1, 1, -3, 3],
  ],
  // [
  //   [1, 2, 4, -4],
  //   [-1, -2, 3, 4],
  //   [1, 2, -3, 3],
  // ],
] as const;

const generateBoard = (ideaElementalII = false) => {
  // 自分のシンボルは○×△□の4種類
  const mySymbol = Math.floor(Math.random() * 4);
  // 自分の担当はαβの2種類
  const myTeam = Math.floor(Math.random() * 2);

  const boardIndex = Math.floor(Math.random() * availableBoards.length);
  const baseBoard = availableBoards[boardIndex];
  const board = [
    [0, -1, 0, -1, 0, -1, 0],
    [-1, undefined, -1, undefined, -1, undefined, -1],
    [0, -1, 0, -1, 0, -1, 0],
    [-1, undefined, -1, undefined, -1, undefined, -1],
    [0, -1, 0, -1, 0, -1, 0],
  ];

  let targetBlueSymbol = [-1, -1];
  let targetMySymbol = [-1, -1];

  for (let color = 1; color <= 4; ++color) {
    let isRed = Math.random() < 0.5;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 4; y++) {
        if (baseBoard[x][y] === color) {
          board[x * 2][y * 2] = isRed ? 2 : 3;
          if (color - 1 === mySymbol && !myTeam === isRed) {
            targetMySymbol = [x, y];
          }
          isRed = !isRed;
        }
        if (baseBoard[x][y] === -color) {
          board[x * 2][y * 2] = 1;
          if (Math.abs(color) - 1 === mySymbol) {
            targetBlueSymbol = [x, y];
          }
        }
      }
    }
  }

  const answerPosition = [
    targetBlueSymbol[0] * 2 - (targetBlueSymbol[0] - targetMySymbol[0]),
    targetBlueSymbol[1] * 2 - (targetBlueSymbol[1] - targetMySymbol[1]),
  ];

  if (ideaElementalII) {
    // 180度回転する
    answerPosition[0] = 4 - answerPosition[0];
    answerPosition[1] = 6 - answerPosition[1];
  }

  board[answerPosition[0]][answerPosition[1]] = -2;

  return { board, mySymbol, myTeam };
};

function getSymbolString(symbol: number) {
  switch (symbol) {
    case 0:
      return "○";
    case 1:
      return "×";
    case 2:
      return "△";
    case 3:
      return "□";
  }
}

function App() {
  const [{ board, myTeam, mySymbol }, setBoard] = useState(generateBoard());
  const [ideaElementalII, setIdeaElementalII] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(-1);

  const updateMode = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIdeaElementalII(e.target.checked);
      setBoard(generateBoard(e.target.checked));
      setShowAnswer(false);
    },
    []
  );

  const revealAnswer = React.useCallback(
    (index: number) => {
      setShowAnswer(true);
      setClickedIndex(index);
      setTimeout(() => {
        setBoard(generateBoard(ideaElementalII));
        setShowAnswer(false);
      }, 3500);
    },
    [ideaElementalII]
  );

  return (
    <>
      <div className="card">
        <h2>
          YourSymbol: {getSymbolString(mySymbol)}
          <br />
          YourDebuff: {myTeam === 0 ? "α" : "β"}
        </h2>
        <label>
          <input type="checkbox" onChange={updateMode} />
          Idea Elemental II
        </label>
        <table>
          <tbody>
            {board.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>
                    {cell === undefined ? (
                      ""
                    ) : cell < 0 ? (
                      <button
                        data-correct={cell === -2}
                        onClick={() => revealAnswer(i * row.length + j)}
                        className={
                          showAnswer &&
                          (clickedIndex === i * row.length + j || cell === -2)
                            ? "reveal"
                            : ""
                        }
                      >
                        {showAnswer
                          ? cell === -2
                            ? "○"
                            : clickedIndex === i * row.length + j
                            ? "✖️"
                            : ""
                          : "？"}
                      </button>
                    ) : cell === 0 ? (
                      ""
                    ) : cell === 1 ? (
                      <img src={blueSymbol} />
                    ) : cell === 2 ? (
                      <img src={redSymbol} />
                    ) : (
                      <img src={yellowSymbol} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="subtle">Version: {__COMMIT_HASH__}</div>
      </div>
    </>
  );
}

export default App;
