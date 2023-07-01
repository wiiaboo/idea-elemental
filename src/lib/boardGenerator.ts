import availableBoards from "../board.json";

export enum SymbolColor {
  Blue = 1,
  Red = 2,
  Yellow = 3,
}

export const ANSWER_CELL = -2;

let prevSymbol = -1;

function chooseBoard() {
  return Math.floor(Math.random() * availableBoards.length);
}

function chooseSymbol() {
  const symbolMap = [];
  for (let symbol = 0; symbol < 4; symbol++) {
    symbolMap.push(symbol);
    if (symbol !== prevSymbol) {
      symbolMap.push(symbol);
      symbolMap.push(symbol);
      symbolMap.push(symbol);
    } else {
      if (prevSymbol !== 0) {
        symbolMap.push(0);
      }
      if (prevSymbol !== 1) {
        symbolMap.push(1);
      }
      if (prevSymbol !== 2) {
        symbolMap.push(2);
      }
      if (prevSymbol !== 3) {
        symbolMap.push(3);
      }
    }
  }
  console.log(symbolMap)
  const nextSymbol = symbolMap[Math.floor(Math.random() * symbolMap.length)];
  prevSymbol = nextSymbol;
  return nextSymbol;
}

function chooseDebuff() {
  return Math.floor(Math.random() * 2);
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

export function findBlueSymbol(
  board: number[][],
  mySymbol: number
): [number, number] {
  const targetBlueSymbol: [number, number] = [-1, mySymbol];
  for (let x = 0; x < 3; x++) {
    if (board[x][mySymbol] === SymbolColor.Blue) {
      targetBlueSymbol[0] = x;
      break;
    }
  }

  return targetBlueSymbol;
}

export function findMySymbol(
  board: number[][],
  target: number[],
  myTeam: SymbolColor
): [number, number] {
  const targetMySymbols = findSibling(board, target[0], target[1], myTeam);
  // 青に隣接する担当カラーが1個の場合は確定
  if (targetMySymbols.length === 1) {
    return targetMySymbols[0] as [number, number];
  }

  // 青に隣接する担当カラーが2個以上ある場合は、
  // その中でほかの青に隣接していない物が担当
  let targetMySymbol: [number, number] = [-1, -1];
  for (const availableSymbol of targetMySymbols) {
    const siblingBlue = findSibling(
      board,
      availableSymbol[0],
      availableSymbol[1],
      SymbolColor.Blue
    );
    const isSiblingMyself = siblingBlue.every(([x, y]) => {
      return x === target[0] && y === target[1];
    });
    if (isSiblingMyself) {
      targetMySymbol = availableSymbol as typeof targetMySymbol;
    }
  }

  return targetMySymbol;
}

export const generateBoard = (ideaElementalII = false) => {
  // 自分のシンボルは○×△□の4種類
  const mySymbol = chooseSymbol();
  // 自分の担当はαβの2種類
  const myDebuff = chooseDebuff();
  // 自分の担当カラー
  const myColor = myDebuff === 0 ? SymbolColor.Red : SymbolColor.Yellow;

  const boardId = chooseBoard();
  const baseBoard = availableBoards[boardId];
  const board = expandBoard(baseBoard);

  // 担当の青シンボルを探す
  const targetBlueSymbol = findBlueSymbol(baseBoard, mySymbol);

  // 上下左右から担当のシンボルを探す
  const targetMySymbol = findMySymbol(baseBoard, targetBlueSymbol, myColor);

  const answerPosition = [
    targetBlueSymbol[0] * 2 - (targetBlueSymbol[0] - targetMySymbol[0]),
    targetBlueSymbol[1] * 2 - (targetBlueSymbol[1] - targetMySymbol[1]),
  ];

  if (ideaElementalII) {
    // 180度回転する
    answerPosition[0] = 4 - answerPosition[0];
    answerPosition[1] = 6 - answerPosition[1];
  }

  board[answerPosition[0]][answerPosition[1]] = ANSWER_CELL;

  return { board: board.flatMap((a) => a), mySymbol, myDebuff, boardId };
};
