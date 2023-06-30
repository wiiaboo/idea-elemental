import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import availableBoards from "./board.json";
import "./lib/i18n";
import "./App.css";

declare global {
  const __COMMIT_HASH__: string;
}

enum SymbolColor {
  Blue = 1,
  Red = 2,
  Yellow = 3,
}

function expandBoard(baseBoard: number[][]) {
  const board = [
    [0, -1, 0, -1, 0, -1, 0],
    [-1, undefined, -1, undefined, -1, undefined, -1],
    [0, -1, 0, -1, 0, -1, 0],
    [-1, undefined, -1, undefined, -1, undefined, -1],
    [0, -1, 0, -1, 0, -1, 0],
  ];

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 4; y++) {
      board[x * 2][y * 2] = baseBoard[x][y];
    }
  }

  return board;
}

function findSibling(
  board: number[][],
  x: number,
  y: number,
  color: SymbolColor
) {
  const siblings = [];
  if (board[x - 1]?.[y] === color) {
    siblings.push([x - 1, y]);
  }
  if (board[x + 1]?.[y] === color) {
    siblings.push([x + 1, y]);
  }
  if (board[x]?.[y - 1] === color) {
    siblings.push([x, y - 1]);
  }
  if (board[x]?.[y + 1] === color) {
    siblings.push([x, y + 1]);
  }
  return siblings;
}

const generateBoard = (ideaElementalII = false) => {
  // 自分のシンボルは○×△□の4種類
  const mySymbol = Math.floor(Math.random() * 4);
  // 自分の担当はαβの2種類
  const myTeam = Math.floor(Math.random() * 2);

  const boardIndex = Math.floor(Math.random() * availableBoards.length);
  const baseBoard = availableBoards[boardIndex];
  const board = expandBoard(baseBoard);

  // 担当の青シンボルを探す
  const targetBlueSymbol = [-1, mySymbol];
  for (let x = 0; x < 3; x++) {
    if (baseBoard[x][mySymbol] === SymbolColor.Blue) {
      targetBlueSymbol[0] = x;
      break;
    }
  }

  // 上下左右から担当のシンボルを探す
  const targetMySymbols = findSibling(
    baseBoard,
    targetBlueSymbol[0],
    targetBlueSymbol[1],
    myTeam + 2
  );
  let targetMySymbol = targetMySymbols[0];

  if (targetMySymbols.length > 1) {
    for (const availableSymbol of targetMySymbols) {
      const siblingBlue = findSibling(
        baseBoard,
        availableSymbol[0],
        availableSymbol[1],
        SymbolColor.Blue
      );
      const isSiblingMyself = siblingBlue.every(([x, y]) => {
        return x === targetBlueSymbol[0] && y === targetBlueSymbol[1];
      });
      if (isSiblingMyself) {
        targetMySymbol = availableSymbol;
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

  return { board: board.flatMap((a) => a), mySymbol, myTeam };
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
  const { t } = useTranslation();

  const [game, setGame] = useState(generateBoard());
  const [ideaElementalII, setIdeaElementalII] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(-1);
  const { board, myTeam, mySymbol } = game;

  const updateMode = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIdeaElementalII(e.target.checked);
      setGame(generateBoard(e.target.checked));
      setShowAnswer(false);
    },
    []
  );

  const revealAnswer = React.useCallback(
    (index: number) => {
      setShowAnswer(true);
      setClickedIndex(index);
      setTimeout(() => {
        setGame(generateBoard(ideaElementalII));
        setShowAnswer(false);
      }, 3000);
    },
    [ideaElementalII]
  );

  return (
    <>
      <div className="card">
        <h2>
          {t("YourSymbol")}: {getSymbolString(mySymbol)}
          <br />
          {t("YourDebuff")}: {myTeam === 0 ? "α" : "β"}
        </h2>
        <label>
          <input type="checkbox" onChange={updateMode} />
          {t("IdeaElemental2")}
        </label>
        <div className="table">
          {board.map((cell, i) =>
            cell === undefined ? (
              <div key={i} />
            ) : cell < 0 ? (
              <button
                key={i}
                data-correct={cell === -2}
                onClick={() => revealAnswer(i)}
                className={
                  showAnswer && (clickedIndex === i || cell === -2)
                    ? "reveal"
                    : ""
                }
              >
                {showAnswer
                  ? cell === -2
                    ? "○"
                    : clickedIndex === i
                    ? "✖️"
                    : ""
                  : "？"}
              </button>
            ) : cell === 0 ? (
              <div key={i} />
            ) : cell === 1 ? (
              <div className="icon blue" key={i} />
            ) : cell === 2 ? (
              <div className="icon red" key={i} />
            ) : (
              <div className="icon yellow" key={i} />
            )
          )}
        </div>

        <div className="subtle">
          <a href="https://github.com/tmyt/idea-elemental">
            Version: {__COMMIT_HASH__}
          </a>
        </div>
        {/*
          <button onClick={() => console.log(board)}>debug</button>
          <button onClick={() => setGame(generateBoard(ideaElementalII))}>
            update
         </button>
        */}
      </div>
    </>
  );
}

export default App;
