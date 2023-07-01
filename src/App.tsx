import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ANSWER_CELL, generateBoard } from "./lib/boardGenerator";
import "./lib/i18n";
import "./App.scss";
import {
  getButtonClassName,
  getDebuffClassName,
  getIconClassName,
  getMarkerClassName,
} from "./lib/classNames";

declare global {
  const __COMMIT_HASH__: string;
}

function App() {
  const { t } = useTranslation();

  const [game, setGame] = useState(generateBoard());
  const [ideaElementalII, setIdeaElementalII] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(-1);
  const { board, myDebuff, mySymbol, boardId } = game;
  const timerIdRef = React.useRef<number | undefined>(undefined);

  const updateMode = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIdeaElementalII(e.target.checked);
      setGame(generateBoard(e.target.checked));
      setShowAnswer(false);
      clearTimeout(timerIdRef.current);
    },
    []
  );

  const revealAnswer = React.useCallback(
    (index: number) => {
      setShowAnswer(true);
      setClickedIndex(index);
      timerIdRef.current = window.setTimeout(() => {
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
            <div className={getMarkerClassName(mySymbol)} />
          </div>
          <div className="line">
            <span>{t("YourDebuff")}</span>
            <div className={getDebuffClassName(myDebuff)} />
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
                className={getButtonClassName(clickedIndex === i, showAnswer)}
                data-correct={cell === ANSWER_CELL}
                onClick={() => revealAnswer(i)}
              />
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
      </div>
    </>
  );
}

export default App;
