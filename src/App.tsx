import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { generateBoard } from "./lib/boardGenerator";
import "./lib/i18n";
import "./App.css";

declare global {
  const __COMMIT_HASH__: string;
}



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
          {t("YourSymbol")} {getSymbolString(mySymbol)}
          <br />
          {t("YourDebuff")} {myTeam === 0 ? "α" : "β"}
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
