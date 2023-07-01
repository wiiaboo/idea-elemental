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
      return "/marker_circle.svg";
    case 1:
      return "/marker_cross.svg";
    case 2:
      return "/marker_triangle.svg";
    case 3:
      return "/marker_square.svg";
  }
}

function getDebuffString(debuff: number) {
  switch (debuff) {
    case 0:
      return "/debuff_alpha.svg";
    case 1:
      return "/debuff_beta.svg";
  }
}

function getIconClassName(symbol: number) {
  switch (symbol) {
    case 1:
      return "icon blue";
    case 2:
      return "icon red";
    case 3:
      return "icon yellow";
  }
}

function App() {
  const { t } = useTranslation();

  const [game, setGame] = useState(generateBoard());
  const [ideaElementalII, setIdeaElementalII] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(-1);
  const { board, myDebuff, mySymbol, boardId } = game;

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
      <div>
        <h2>
          <div className="line">
            <span>{t("YourSymbol")}</span>
            <img src={getSymbolString(mySymbol)} height={32} />
          </div>
          <div className="line">
            <span>{t("YourDebuff")}</span>
            <img src={getDebuffString(myDebuff)} height={32} />
          </div>
        </h2>
        <div className="checkbox-wrapper-13">
          <input
            id="c1-13"
            type="checkbox"
            onChange={updateMode}
            checked={ideaElementalII}
          />
          <label htmlFor="c1-13">{t("IdeaElemental2")}</label>
        </div>
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
            ) : (
              <div className={getIconClassName(cell)} key={i} />
            )
          )}
        </div>

        <div className="subtle">
          Board ID: {boardId} |{" "}
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
