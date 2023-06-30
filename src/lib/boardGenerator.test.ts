import availableBoards from "../board.json";
import { SymbolColor, findBlueSymbol, findMySymbol } from "./boardGenerator";

describe("boardGenerator", () => {
  describe("findBlueSymbol", () => {
    test.each(new Array(availableBoards.length).fill(0).map((_, i) => i))(
      "should return the correct one of blue symbol for board %i",
      (boardIndex) => {
        const board = availableBoards[boardIndex];
        for (let i = 0; i < 4; i++) {
          const [x, y] = findBlueSymbol(board, i);
          expect(board[x][y]).toBe(SymbolColor.Blue);
        }
      }
    );
  });

  describe("findMySymbol", () => {
    test.each(new Array(availableBoards.length).fill(0).map((_, i) => i))(
      "should return the correct one of my symbol for board %i",
      (boardIndex) => {
        const board = availableBoards[boardIndex];
        for (let i = 0; i < 4; i++) {
          const target = findBlueSymbol(board, i);
          const [x, y] = findMySymbol(board, target, SymbolColor.Red);
          expect(board[x][y]).toBe(SymbolColor.Red);
        }
        for (let i = 0; i < 4; i++) {
          const target = findBlueSymbol(board, i);
          const [x, y] = findMySymbol(board, target, SymbolColor.Yellow);
          expect(board[x][y]).toBe(SymbolColor.Yellow);
        }
      }
    );
  });
});
