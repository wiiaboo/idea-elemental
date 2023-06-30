import availableBoards from "../board.json";

export enum SymbolColor {
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

function chooseBoard() {
  return Math.floor(Math.random() * availableBoards.length);
}

function chooseSymbol() {
  return Math.floor(Math.random() * 4);
}

function chooseDebuff() {
  return Math.floor(Math.random() * 2);
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

function solveCore(solvedBoard: number[][][]): number[][][] {
  let i = 0;
  // 2カ所以上で候補になっているマスがあるので解決する
  while (!solvedBoard.flatMap((row) => row).every((col) => col.length === 1)) {
    i++;
    if (i > 10) throw new Error();
    // シンボルごとの候補マス数を数える
    const flattedBoard = solvedBoard
      .flatMap((row) => row)
      .flatMap((col) => col);
    const symbolA = flattedBoard.filter((symbol) => symbol === 0).length;
    const symbolB = flattedBoard.filter((symbol) => symbol === 1).length;
    const symbolC = flattedBoard.filter((symbol) => symbol === 2).length;
    const symbolD = flattedBoard.filter((symbol) => symbol === 3).length;

    // 3マスしかないものを先に確定させる
    for (const row of solvedBoard) {
      for (let col = 0; col < 4; col++) {
        if (symbolA === 3) {
          if (row[col].includes(0)) {
            row[col] = [0];
          }
        }
        if (symbolB === 3) {
          if (row[col].includes(1)) {
            row[col] = [1];
          }
        }
        if (symbolC === 3) {
          if (row[col].includes(2)) {
            row[col] = [2];
          }
        }
        if (symbolD === 3) {
          if (row[col].includes(3)) {
            row[col] = [3];
          }
        }
      }
    }
  }

  return solvedBoard;
}

// まじめに盤面を解く
export function solve(
  board: number[][],
  mySymbol: number,
  myColor: SymbolColor
): [number, number] {
  const solvedBoard: number[][][] = [
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
  ];

  for (let symbol = 0; symbol < 4; symbol++) {
    // 青を埋める
    const [x, y] = findBlueSymbol(board, symbol);
    solvedBoard[x][y] = [symbol];
    // 赤を埋める
    findSibling(board, x, y, SymbolColor.Red).forEach(([x, y]) => {
      solvedBoard[x][y].push(symbol);
    });
    // 黄色を埋める
    findSibling(board, x, y, SymbolColor.Yellow).forEach(([x, y]) => {
      solvedBoard[x][y].push(symbol);
    });
  }

  // 盤面を解く
  solveCore(solvedBoard);

  // 盤面が解けたはずなので自分が担当すべき候補マスを探す
  const targetCells: number[][] = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 4; y++) {
      if (solvedBoard[x][y].includes(mySymbol)) {
        targetCells.push([x, y]);
      }
    }
  }

  // 候補マスのうち自分の担当カラーのマスを探す
  const answerCell = targetCells.find(([x, y]) => board[x][y] === myColor);

  return answerCell as [number, number];
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
  const myTeam = chooseDebuff();

  const baseBoard = availableBoards[chooseBoard()];
  const board = expandBoard(baseBoard);

  // 担当の青シンボルを探す
  const targetBlueSymbol = findBlueSymbol(baseBoard, mySymbol);

  // 上下左右から担当のシンボルを探す
  const targetMySymbol = findMySymbol(baseBoard, targetBlueSymbol, myTeam);

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
